from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from accounts.permissions import IsAdminOrHR, IsAdmin, IsAdminHROrManager
from employees.models import EmployeeProfile
from .models import LeaveType, LeaveBalance
from .serializers import LeaveTypeSerializer, LeaveBalanceSerializer


class LeaveTypeListCreateView(APIView):
    """
    GET  /api/leaves/types/ — All authenticated
    POST /api/leaves/types/ — Admin, HR
    """

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated(), IsAdminOrHR()]
        return [IsAuthenticated()]

    def get(self, request):
        types      = LeaveType.objects.all()
        serializer = LeaveTypeSerializer(types, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = LeaveTypeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LeaveTypeDetailView(APIView):
    """
    PUT    /api/leaves/types/{id}/ — Admin, HR
    DELETE /api/leaves/types/{id}/ — Admin only
    """

    def get_object(self, pk):
        try:
            return LeaveType.objects.get(pk=pk)
        except LeaveType.DoesNotExist:
            return None

    def get_permissions(self):
        if self.request.method == 'DELETE':
            return [IsAuthenticated(), IsAdmin()]
        return [IsAuthenticated(), IsAdminOrHR()]

    def put(self, request, pk):
        leave_type = self.get_object(pk)
        if not leave_type:
            return Response(
                {'detail': 'Leave type not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = LeaveTypeSerializer(leave_type, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        leave_type = self.get_object(pk)
        if not leave_type:
            return Response(
                {'detail': 'Leave type not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        leave_type.delete()
        return Response(
            {'detail': f'Leave type "{leave_type.name}" deleted.'},
            status=status.HTTP_200_OK
        )


class MyLeaveBalanceView(APIView):
    """GET /api/leaves/balance/ — Employee views own balance"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        balances   = LeaveBalance.objects.filter(
                        employee=request.user
                     ).select_related('leave_type')
        serializer = LeaveBalanceSerializer(balances, many=True)
        return Response({
            'username': request.user.username,
            'balances': serializer.data,
        })


class EmployeeLeaveBalanceView(APIView):
    """GET /api/leaves/balance/{employee_id}/ — Admin, HR, Manager"""
    permission_classes = [IsAuthenticated, IsAdminHROrManager]

    def get(self, request, employee_id):
        try:
            profile = EmployeeProfile.objects.get(employee_id=employee_id)
        except EmployeeProfile.DoesNotExist:
            return Response(
                {'detail': 'Employee not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        balances   = LeaveBalance.objects.filter(
                        employee=profile.user
                     ).select_related('leave_type')
        serializer = LeaveBalanceSerializer(balances, many=True)
        return Response({
            'employee_id': employee_id,
            'username':    profile.user.username,
            'balances':    serializer.data,
        })