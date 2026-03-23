from rest_framework import serializers
from .models import EmployeeProfile

class EmployeeProfileSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = EmployeeProfile
        fields = '__all__'