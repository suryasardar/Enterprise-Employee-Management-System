from rest_framework import serializers
from .models import LeaveType, LeaveBalance, LeaveRequest


class LeaveTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model  = LeaveType
        fields = ['id', 'name', 'total_days', 'carry_forward_allowed']


class LeaveBalanceSerializer(serializers.ModelSerializer):
    leave_type_name = serializers.CharField(source='leave_type.name',       read_only=True)
    total_days      = serializers.IntegerField(source='leave_type.total_days', read_only=True)
    username        = serializers.CharField(source='employee.username',     read_only=True)

    class Meta:
        model  = LeaveBalance
        fields = [
            'id', 'username', 'leave_type', 'leave_type_name',
            'total_days', 'remaining_days'
        ]


class LeaveRequestSerializer(serializers.ModelSerializer):
    username        = serializers.CharField(source='employee.username',   read_only=True)
    leave_type_name = serializers.CharField(source='leave_type.name',     read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.username', read_only=True, allow_null=True)

    class Meta:
        model  = LeaveRequest
        fields = [
            'id', 'username', 'leave_type', 'leave_type_name',
            'start_date', 'end_date', 'reason',
            'status', 'approved_by', 'approved_by_name', 'created_at'
        ]
        read_only_fields = ['status', 'approved_by', 'created_at']