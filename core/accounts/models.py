from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
# Create your models here.
 
class User(AbstractUser):
    ROLE_CHOICES = [
        ('Admin', 'Admin'),
        ('HR', 'HR'),
        ('Manager', 'Manager'),
        ('Employee', 'Employee')
    ]

    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    phone = models.CharField(max_length=15)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.username)
    
 
    
 