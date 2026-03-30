from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'Admin'


class IsAdminOrHR(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['Admin', 'HR']


class IsAdminHROrManager(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['Admin', 'HR', 'Manager']


class IsAuthenticated(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated