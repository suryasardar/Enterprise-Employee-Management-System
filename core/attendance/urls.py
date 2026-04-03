from django.urls import path
from .views import (
    CheckInView, CheckOutView, AttendanceListView,
    MyAttendanceView, MonthlyReportView, EmployeeAttendanceView
)

urlpatterns = [
    path('checkin/',          CheckInView.as_view(),           name='attendance-checkin'),
    path('checkout/',         CheckOutView.as_view(),          name='attendance-checkout'),
    path('',                  AttendanceListView.as_view(),    name='attendance-list'),
    path('my/',               MyAttendanceView.as_view(),      name='attendance-my'),
    path('report/monthly/',   MonthlyReportView.as_view(),     name='attendance-monthly-report'),
    path('<str:employee_id>/', EmployeeAttendanceView.as_view(), name='attendance-employee'),
]