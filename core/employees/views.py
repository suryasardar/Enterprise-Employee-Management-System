from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import EmployeeProfile
from .serializers import EmployeeProfileSerializer
from audit.models import AuditLog

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_profile(request):
    """Admin/HR creates the extended profile for a User"""
    if request.user.role not in ['Admin', 'HR']:
        return Response({"error": "Unauthorized"}, status=403)
    
    serializer = EmployeeProfileSerializer(data=request.data)
    if serializer.is_valid():
        profile = serializer.save()
        AuditLog.objects.create(
            user=request.user,
            action="PROFILE_CREATE",
            description=f"Created profile for Employee ID: {profile.employee_id}"
        )
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_employee_status(request, emp_id):
    """Handles Status Updates, Transfers, and Terminations"""
    if request.user.role not in ['Admin', 'HR']:
        return Response({"error": "Unauthorized"}, status=403)

    try:
        print(EmployeeProfile.objects.all())
        profile = EmployeeProfile.objects.get(employee_id=emp_id)
    except EmployeeProfile.DoesNotExist:
        return Response({"error": "Employee not found"}, status=404)

    # Logic for Department Transfer
    new_dept = request.data.get("department")
    if new_dept and new_dept != profile.department:
        old_dept = profile.department
        profile.department = new_dept
        AuditLog.objects.create(
            user=request.user,
            action="DEPT_TRANSFER",
            description=f"Transferred {emp_id} from {old_dept} to {new_dept}"
        )

    # Logic for Termination
    new_status = request.data.get("status")
    if new_status:
        profile.status = new_status
        if new_status == "Terminated":
            # Set associated User to inactive so they can't login
            profile.user.is_active = False
            profile.user.save()
        
        AuditLog.objects.create(
            user=request.user,
            action="STATUS_CHANGE",
            description=f"Changed status of {emp_id} to {new_status}"
        )

    profile.save()
    return Response({"message": "Employee updated successfully"})