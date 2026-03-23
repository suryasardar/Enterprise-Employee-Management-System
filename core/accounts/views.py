from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.hashers import check_password
from django.contrib.auth.hashers import make_password
from .models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer
from audit.models import AuditLog
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

@api_view(["POST"])
@permission_classes([IsAuthenticated]) # This ensures JWT is checked first
def register_user(request):
    # Check permission (Ideally move this to a custom Permission Class later)
    # For now, we still rely on the token of the person making the request
    if not request.user.is_authenticated or request.user.role not in ["Admin", "HR"]:
        return Response({"error": "Only Admin or HR can register users"}, status=403)

    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User created successfully"}, status=201)
    return Response(serializer.errors, status=400)

@api_view(["POST"])
def login_user(request):
    username = request.data.get("username")
    password = request.data.get("password")

    # Use Django's authenticate for better security/logging
    from django.contrib.auth import authenticate
    user = authenticate(username=username, password=password)

    if user is not None:
        refresh = RefreshToken.for_user(user)
        
        # Log the successful login
        AuditLog.objects.create(
            user=user,
            action="LOGIN",
            description=f"User {username} logged in successfully"
        )

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "role": user.role
        })
    
    return Response({"error": "Invalid credentials"}, status=401)