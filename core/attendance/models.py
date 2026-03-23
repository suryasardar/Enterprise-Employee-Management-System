 
# Create your models here.
from django.db import models
from accounts.models import User


class Attendance(models.Model):

    STATUS_CHOICES = [
        ('Present', 'Present'),
        ('Absent', 'Absent'),
        ('Late', 'Late')
    ]

    employee = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    check_in = models.TimeField()
    check_out = models.TimeField()
    work_hours = models.FloatField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)