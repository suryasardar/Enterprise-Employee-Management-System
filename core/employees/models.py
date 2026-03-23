 
# Create your models here.
from django.db import models
from accounts.models import User


class EmployeeProfile(models.Model):

    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
        ('Terminated', 'Terminated')
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    employee_id = models.CharField(max_length=50, unique=True)
    department = models.CharField(max_length=100)
    designation = models.CharField(max_length=100)
    joining_date = models.DateField()
    reporting_manager = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="manager")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)

    def __str__(self):
        return str(self.employee_id)