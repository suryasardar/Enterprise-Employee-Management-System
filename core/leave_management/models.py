from django.db import models
from accounts.models import User


class LeaveType(models.Model):
    name                  = models.CharField(max_length=100, unique=True)
    total_days            = models.IntegerField()
    carry_forward_allowed = models.BooleanField(default=False)

    class Meta:
        db_table = 'leave_types'

    def __str__(self):
        return self.name


class LeaveBalance(models.Model):
    employee       = models.ForeignKey(User, on_delete=models.CASCADE, related_name='leave_balances')
    leave_type     = models.ForeignKey(LeaveType, on_delete=models.CASCADE, related_name='balances')
    remaining_days = models.IntegerField(default=0)

    class Meta:
        db_table        = 'leave_balances'
        unique_together = ['employee', 'leave_type']

    def __str__(self):
        return f"{self.employee.username} - {self.leave_type.name} - {self.remaining_days}d"


class LeaveRequest(models.Model):
    STATUS_CHOICES = [
        ('Pending',  'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]

    employee    = models.ForeignKey(User, on_delete=models.CASCADE, related_name='leave_requests')
    leave_type  = models.ForeignKey(LeaveType, on_delete=models.CASCADE)
    start_date  = models.DateField()
    end_date    = models.DateField()
    reason      = models.TextField()
    status      = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    approved_by = models.ForeignKey(
                    User, on_delete=models.SET_NULL,
                    null=True, blank=True,
                    related_name='approved_leaves'
                  )
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'leave_requests'

    def __str__(self):
        return f"{self.employee.username} - {self.leave_type.name} - {self.status}"