from django.db import models
from accounts.models import User


class Attendance(models.Model):
    STATUS_CHOICES = [
        ('Present', 'Present'),
        ('Absent',  'Absent'),
        ('Late',    'Late'),
    ]

    employee   = models.ForeignKey(User, on_delete=models.CASCADE, related_name='attendance')
    date       = models.DateField()
    check_in   = models.TimeField(null=True, blank=True)
    check_out  = models.TimeField(null=True, blank=True)
    work_hours = models.FloatField(default=0)
    status     = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Absent')

    class Meta:
        db_table        = 'attendance'
        unique_together = ['employee', 'date']

    def __str__(self):
        return f"{self.employee.username} - {self.date} - {self.status}"