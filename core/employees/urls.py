from django.urls import path
from .views import (
    EmployeeListCreateView, EmployeeDetailView,
    EmployeeTerminateView, EmployeeProfileCardView, EmployeeSearchView
)

urlpatterns = [
    path('',              EmployeeListCreateView.as_view(), name='employee-list-create'),
    path('search/',       EmployeeSearchView.as_view(),     name='employee-search'),
    path('<int:pk>/',     EmployeeDetailView.as_view(),     name='employee-detail'),
    path('<int:pk>/terminate/', EmployeeTerminateView.as_view(),    name='employee-terminate'),
    path('<int:pk>/profile/',   EmployeeProfileCardView.as_view(),  name='employee-profile-card'),
]