from django.db import models
from accounts.models import User


class EmployeeProfile(models.Model):
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
        ('Terminated', 'Terminated'),
    ]

    id                  = models.AutoField(primary_key=True)
    user                = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    employee_id         = models.CharField(max_length=20, unique=True)
    department          = models.CharField(max_length=100)
    designation         = models.CharField(max_length=100)
    joining_date        = models.DateField()
    reporting_manager   = models.ForeignKey(
                            User, on_delete=models.SET_NULL,
                            null=True, blank=True,
                            related_name='subordinates'
                          )
    status              = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')

    class Meta:
        db_table = 'employee_profiles'

    def __str__(self):
        return f"{self.employee_id} — {self.user.username}"