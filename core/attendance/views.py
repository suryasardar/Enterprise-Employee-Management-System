from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Sum, Count, Q

from accounts.permissions import IsAdminOrHR, IsAdminHROrManager
from employees.models import EmployeeProfile
from .models import Attendance
from .serializers import AttendanceSerializer, MonthlyReportSerializer

import datetime


class CheckInView(APIView):
    """POST /api/attendance/checkin/ — Employee only"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role not in ['Employee', 'Manager']:
            return Response(
                {'detail': 'Only employees can check in.'},
                status=status.HTTP_403_FORBIDDEN
            )

        today = timezone.now().date()
        now   = timezone.now().time()

        # Prevent duplicate check-in
        if Attendance.objects.filter(employee=request.user, date=today).exists():
            return Response(
                {'detail': 'Already checked in for today.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Mark Late if check-in after 09:30
        late_threshold = datetime.time(9, 30, 0)
        status_val     = 'Late' if now > late_threshold else 'Present'

        attendance = Attendance.objects.create(
            employee  = request.user,
            date      = today,
            check_in  = now,
            status    = status_val,
        )

        return Response({
            'detail':   'Check-in recorded successfully.',
            'date':     str(attendance.date),
            'check_in': str(attendance.check_in),
            'status':   attendance.status,
        }, status=status.HTTP_201_CREATED)


class CheckOutView(APIView):
    """POST /api/attendance/checkout/ — Employee only"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role not in ['Employee', 'Manager']:
            return Response(
                {'detail': 'Only employees can check out.'},
                status=status.HTTP_403_FORBIDDEN
            )

        today = timezone.now().date()
        now   = timezone.now().time()

        try:
            attendance = Attendance.objects.get(employee=request.user, date=today)
        except Attendance.DoesNotExist:
            return Response(
                {'detail': 'No check-in found for today. Please check in first.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if attendance.check_out:
            return Response(
                {'detail': 'Already checked out for today.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Calculate work hours
        check_in_dt  = datetime.datetime.combine(today, attendance.check_in)
        check_out_dt = datetime.datetime.combine(today, now)
        work_hours   = round((check_out_dt - check_in_dt).seconds / 3600, 2)

        attendance.check_out  = now
        attendance.work_hours = work_hours
        attendance.save()

        return Response({
            'detail':     'Check-out recorded successfully.',
            'date':       str(attendance.date),
            'check_in':   str(attendance.check_in),
            'check_out':  str(attendance.check_out),
            'work_hours': attendance.work_hours,
        })


class AttendanceListView(APIView):
    """GET /api/attendance/ — Admin, HR, Manager"""
    permission_classes = [IsAuthenticated, IsAdminHROrManager]

    def get(self, request):
        queryset = Attendance.objects.select_related('employee').all().order_by('-date')

        # Optional filters
        date_filter = request.query_params.get('date')
        dept_filter = request.query_params.get('department')
        stat_filter = request.query_params.get('status')

        if date_filter:
            queryset = queryset.filter(date=date_filter)
        if dept_filter:
            queryset = queryset.filter(
                employee__profile__department__icontains=dept_filter
            )
        if stat_filter:
            queryset = queryset.filter(status=stat_filter)

        # Pagination
        page      = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('page_size', 20))
        start     = (page - 1) * page_size
        end       = start + page_size

        total      = queryset.count()
        serializer = AttendanceSerializer(queryset[start:end], many=True)

        return Response({
            'count':   total,
            'page':    page,
            'results': serializer.data,
        })


class MyAttendanceView(APIView):
    """GET /api/attendance/my/ — Employee views own history"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = Attendance.objects.filter(
            employee=request.user
        ).order_by('-date')

        # Optional month filter e.g. ?month=2025-03
        month = request.query_params.get('month')
        if month:
            try:
                year, mon = map(int, month.split('-'))
                queryset  = queryset.filter(date__year=year, date__month=mon)
            except ValueError:
                return Response(
                    {'detail': 'Invalid month format. Use YYYY-MM.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        serializer = AttendanceSerializer(queryset, many=True)
        return Response({
            'count':   queryset.count(),
            'results': serializer.data,
        })


class MonthlyReportView(APIView):
    """GET /api/attendance/report/monthly/?month=2025-03 — Admin, HR"""
    permission_classes = [IsAuthenticated, IsAdminOrHR]

    def get(self, request):
        month = request.query_params.get('month')
        if not month:
            return Response(
                {'detail': 'month parameter is required. Format: YYYY-MM'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            year, mon = map(int, month.split('-'))
        except ValueError:
            return Response(
                {'detail': 'Invalid month format. Use YYYY-MM.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        records = Attendance.objects.filter(
            date__year=year, date__month=mon
        ).select_related('employee')

        # Group by employee
        from collections import defaultdict
        report_map = defaultdict(lambda: {
            'present': 0, 'absent': 0, 'late': 0, 'hours': 0.0
        })

        for rec in records:
            key = rec.employee
            if rec.status == 'Present': report_map[key]['present'] += 1
            elif rec.status == 'Absent': report_map[key]['absent']  += 1
            elif rec.status == 'Late':   report_map[key]['late']    += 1
            report_map[key]['hours'] += rec.work_hours or 0

        # Total working days in the month
        import calendar
        total_days = len([
            d for d in range(1, calendar.monthrange(year, mon)[1] + 1)
            if datetime.date(year, mon, d).weekday() < 5  # Mon–Fri
        ])

        report = []
        for emp, data in report_map.items():
            try:
                emp_id = emp.profile.employee_id
            except Exception:
                emp_id = 'N/A'
            report.append({
                'employee_id':   emp_id,
                'username':      emp.username,
                'month':         month,
                'total_present': data['present'],
                'total_absent':  data['absent'],
                'total_late':    data['late'],
                'total_days':    total_days,
                'total_hours':   round(data['hours'], 2),
            })

        return Response({'month': month, 'report': report})


class EmployeeAttendanceView(APIView):
    """GET /api/attendance/{employee_id}/ — Admin, HR, Manager"""
    permission_classes = [IsAuthenticated, IsAdminHROrManager]

    def get(self, request, employee_id):
        try:
            profile = EmployeeProfile.objects.get(employee_id=employee_id)
        except EmployeeProfile.DoesNotExist:
            return Response(
                {'detail': 'Employee not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        queryset = Attendance.objects.filter(
            employee=profile.user
        ).order_by('-date')

        month = request.query_params.get('month')
        if month:
            try:
                year, mon = map(int, month.split('-'))
                queryset  = queryset.filter(date__year=year, date__month=mon)
            except ValueError:
                return Response(
                    {'detail': 'Invalid month format. Use YYYY-MM.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        serializer = AttendanceSerializer(queryset, many=True)
        return Response({
            'employee_id': employee_id,
            'username':    profile.user.username,
            'count':       queryset.count(),
            'results':     serializer.data,
        })