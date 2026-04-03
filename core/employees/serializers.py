from rest_framework import serializers
from accounts.models import User
from accounts.serializers import UserSerializer
from .models import EmployeeProfile


class EmployeeProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model  = EmployeeProfile
        fields = [
            'id', 'user', 'employee_id', 'department',
            'designation', 'joining_date', 'reporting_manager', 'status'
        ]


class CreateEmployeeSerializer(serializers.Serializer):
    """Creates a User + EmployeeProfile in one call."""
    # User fields
    username  = serializers.CharField(max_length=150)
    email     = serializers.EmailField()
    password  = serializers.CharField(write_only=True)
    role      = serializers.ChoiceField(choices=['Admin', 'HR', 'Manager', 'Employee'], default='Employee')
    phone     = serializers.CharField(max_length=20, required=False, allow_blank=True)

    # Profile fields
    # employee_id       = serializers.CharField(max_length=20)
    department        = serializers.CharField(max_length=100)
    designation       = serializers.CharField(max_length=100)
    joining_date      = serializers.DateField()
    reporting_manager = serializers.PrimaryKeyRelatedField(
                            queryset=User.objects.all(), required=False, allow_null=True
                        )
    status            = serializers.ChoiceField(
                            choices=['Active', 'Inactive', 'Terminated'], default='Active'
                        )

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value

    def validate_employee_id(self, value):
        if EmployeeProfile.objects.filter(employee_id=value).exists():
            raise serializers.ValidationError("Employee ID already exists.")
        return value

    def create(self, validated_data):
        # 1. Extract profile data
        profile_fields = ['department', 'designation', 'joining_date', 'reporting_manager', 'status']
        profile_data = {f: validated_data.pop(f) for f in profile_fields if f in validated_data}

        # 2. Create the User first
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data.get('role', 'Employee'),
            phone=validated_data.get('phone', ''),
             )

        # 3. AUTO-GENERATE EMPLOYEE ID (Format: ARKA + random/sequential number)
        # Using a count + 1000 approach for a clean look (ARKA1001, ARKA1002...)
        count = EmployeeProfile.objects.count() + 1
        generated_id = f"ARKA{1000 + count}" 
        
        # Ensure it's unique just in case a record was deleted
        while EmployeeProfile.objects.filter(employee_id=generated_id).exists():
            count += 1
            generated_id = f"ARKA{1000 + count}"

        # 4. Create the Profile with the generated ID
        profile = EmployeeProfile.objects.create(
            user=user, 
            employee_id=generated_id, 
            **profile_data
        )
        return profile


class UpdateEmployeeSerializer(serializers.ModelSerializer):
    """Updates EmployeeProfile fields (PUT / PATCH)."""
    class Meta:
        model  = EmployeeProfile
        fields = ['department', 'designation', 'joining_date', 'reporting_manager', 'status']


class EmployeeProfileCardSerializer(serializers.ModelSerializer):
    """Lightweight card view."""
    username    = serializers.CharField(source='user.username')
    email       = serializers.CharField(source='user.email')
    role        = serializers.CharField(source='user.role')
    phone       = serializers.CharField(source='user.phone')
    is_active   = serializers.BooleanField(source='user.is_active')

    class Meta:
        model  = EmployeeProfile
        fields = [
            'id', 'employee_id', 'username', 'email', 'role',
            'phone', 'is_active', 'department', 'designation',
            'joining_date', 'status'
        ]