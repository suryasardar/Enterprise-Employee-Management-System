from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, LoginView, LogoutView,
    ChangePasswordView, ResetPasswordView
)

urlpatterns = [
    path('register/',         RegisterView.as_view(),       name='auth-register'),
    path('login/',            LoginView.as_view(),           name='auth-login'),
    path('logout/',           LogoutView.as_view(),          name='auth-logout'),
    path('token/refresh/',    TokenRefreshView.as_view(),    name='token-refresh'),
    path('change-password/',  ChangePasswordView.as_view(),  name='change-password'),
    path('reset-password/',   ResetPasswordView.as_view(),   name='reset-password'),
]