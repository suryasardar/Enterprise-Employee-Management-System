from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role', 'phone']
        extra_kwargs = {
            'password': {'write_only': True} # Security: Hide password in responses
        }

    def create(self, validated_data):
        # Extracts password, creates user, hashes password, and returns user
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password) # Django's built-in hashing
        user.save()
        return user