from django.urls import path
from .views import (
    LeaveTypeListCreateView, LeaveTypeDetailView,
    MyLeaveBalanceView, EmployeeLeaveBalanceView
)

urlpatterns = [
    path('types/',                      LeaveTypeListCreateView.as_view(), name='leave-type-list'),
    path('types/<int:pk>/',             LeaveTypeDetailView.as_view(),     name='leave-type-detail'),
    path('balance/',                    MyLeaveBalanceView.as_view(),      name='my-leave-balance'),
    path('balance/<str:employee_id>/',  EmployeeLeaveBalanceView.as_view(),name='employee-leave-balance'),
]