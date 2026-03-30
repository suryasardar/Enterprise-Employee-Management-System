from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from accounts.permissions import IsAdminOrHR, IsAdminHROrManager
from .models import EmployeeProfile
from .serializers import (
    EmployeeProfileSerializer, CreateEmployeeSerializer,
    UpdateEmployeeSerializer, EmployeeProfileCardSerializer
)


class EmployeeListCreateView(APIView):
    """
    GET  /api/employees/       — list all (Admin, HR, Manager)
    POST /api/employees/       — create new employee (Admin, HR)
    """

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated(), IsAdminOrHR()]
        return [IsAuthenticated(), IsAdminHROrManager()]

    def get(self, request):
        page      = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('page_size', 10))
        start     = (page - 1) * page_size
        end       = start + page_size

        employees = EmployeeProfile.objects.select_related('user', 'reporting_manager')
        total     = employees.count()
        serializer = EmployeeProfileSerializer(employees[start:end], many=True)

        return Response({
            'count':   total,
            'page':    page,
            'results': serializer.data,
        })

    def post(self, request):
        serializer = CreateEmployeeSerializer(data=request.data)
        if serializer.is_valid():
            profile = serializer.save()
            return Response(
                EmployeeProfileSerializer(profile).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EmployeeDetailView(APIView):
    """
    GET   /api/employees/{id}/  — Admin, HR, Manager
    PUT   /api/employees/{id}/  — Admin, HR
    PATCH /api/employees/{id}/  — Admin, HR
    """

    def get_object(self, pk):
        try:
            return EmployeeProfile.objects.select_related('user').get(pk=pk)
        except EmployeeProfile.DoesNotExist:
            return None

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated(), IsAdminHROrManager()]
        return [IsAuthenticated(), IsAdminOrHR()]

    def get(self, request, pk):
        employee = self.get_object(pk)
        if not employee:
            return Response({'detail': 'Employee not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(EmployeeProfileSerializer(employee).data)

    def put(self, request, pk):
        employee = self.get_object(pk)
        if not employee:
            return Response({'detail': 'Employee not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = UpdateEmployeeSerializer(employee, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(EmployeeProfileSerializer(employee).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        employee = self.get_object(pk)
        if not employee:
            return Response({'detail': 'Employee not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = UpdateEmployeeSerializer(employee, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(EmployeeProfileSerializer(employee).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EmployeeTerminateView(APIView):
    """DELETE /api/employees/{id}/ — Admin, HR (soft delete → Terminated)"""
    permission_classes = [IsAuthenticated, IsAdminOrHR]

    def delete(self, request, pk):
        try:
            employee = EmployeeProfile.objects.get(pk=pk)
        except EmployeeProfile.DoesNotExist:
            return Response({'detail': 'Employee not found.'}, status=status.HTTP_404_NOT_FOUND)

        employee.status = 'Terminated'
        employee.save()
        employee.user.is_active = False
        employee.user.save()
        return Response({'detail': f'Employee {employee.employee_id} has been terminated.'})


class EmployeeProfileCardView(APIView):
    """GET /api/employees/{id}/profile/ — All authenticated"""
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        # Employees can only view their own profile card
        if request.user.role == 'Employee':
            try:
                employee = EmployeeProfile.objects.get(user=request.user)
                if employee.pk != int(pk):
                    return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
            except EmployeeProfile.DoesNotExist:
                return Response({'detail': 'Profile not found.'}, status=status.HTTP_404_NOT_FOUND)
        else:
            try:
                employee = EmployeeProfile.objects.select_related('user').get(pk=pk)
            except EmployeeProfile.DoesNotExist:
                return Response({'detail': 'Employee not found.'}, status=status.HTTP_404_NOT_FOUND)

        return Response(EmployeeProfileCardSerializer(employee).data)


class EmployeeSearchView(APIView):
    """GET /api/employees/search/?q=&dept= — Admin, HR, Manager"""
    permission_classes = [IsAuthenticated, IsAdminHROrManager]

    def get(self, request):
        query      = request.query_params.get('q', '').strip()
        department = request.query_params.get('dept', '').strip()

        employees = EmployeeProfile.objects.select_related('user')

        if query:
            employees = employees.filter(
                Q(user__username__icontains=query) |
                Q(user__email__icontains=query)    |
                Q(employee_id__icontains=query)
            )
        if department:
            employees = employees.filter(department__icontains=department)

        serializer = EmployeeProfileSerializer(employees, many=True)
        return Response({'count': employees.count(), 'results': serializer.data})