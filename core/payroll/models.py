from django.db import models
from accounts.models import User

# Create your models here.
class Payroll(models.Model):

    employee = models.ForeignKey(User, on_delete=models.CASCADE)

    month = models.CharField(max_length=20)

    basic_salary = models.FloatField()
    allowances = models.FloatField()
    deductions = models.FloatField()
    bonus = models.FloatField()

    net_salary = models.FloatField()