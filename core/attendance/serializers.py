from rest_framework import serializers
from .models import Attendance


class AttendanceSerializer(serializers.ModelSerializer):
    username    = serializers.CharField(source='employee.username', read_only=True)
    employee_id = serializers.CharField(source='employee.profile.employee_id', read_only=True)

    class Meta:
        model  = Attendance
        fields = [
            'id', 'employee', 'username', 'employee_id',
            'date', 'check_in', 'check_out', 'work_hours', 'status'
        ]
        read_only_fields = ['employee', 'date', 'work_hours', 'status']


class CheckInSerializer(serializers.Serializer):
    # No input needed — employee and time derived from request
    pass


class CheckOutSerializer(serializers.Serializer):
    # No input needed — employee and time derived from request
    pass


class MonthlyReportSerializer(serializers.Serializer):
    employee_id   = serializers.CharField()
    username      = serializers.CharField()
    month         = serializers.CharField()
    total_present = serializers.IntegerField()
    total_absent  = serializers.IntegerField()
    total_late    = serializers.IntegerField()
    total_days    = serializers.IntegerField()
    total_hours   = serializers.FloatField()