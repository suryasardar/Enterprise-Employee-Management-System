from django.db import models
from accounts.models import User

# Create your models here.
class LeaveType(models.Model):

    name = models.CharField(max_length=100)
    total_days = models.IntegerField()
    carry_forward_allowed = models.BooleanField()
    
    
class LeaveBalance(models.Model):

    employee = models.ForeignKey(User, on_delete=models.CASCADE)
    leave_type = models.ForeignKey(LeaveType, on_delete=models.CASCADE)
    remaining_days = models.IntegerField()
    
    
class LeaveRequest(models.Model):

    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected')
    ]

    employee = models.ForeignKey(User, on_delete=models.CASCADE)
    leave_type = models.ForeignKey(LeaveType, on_delete=models.CASCADE)

    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField()

    status = models.CharField(max_length=20, choices=STATUS_CHOICES)

    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="approver")

    created_at = models.DateTimeField(auto_now_add=True)
    
    
    