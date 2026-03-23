from django.urls import path
from .views import create_profile, update_employee_status

urlpatterns = [
    path('profile/create/', create_profile),
    path('profile/update/<str:emp_id>/', update_employee_status),
]