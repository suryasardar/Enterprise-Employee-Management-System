"""
URL configuration for EmployeeManagement project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Admin panel
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/auth/', include('accounts.urls')),
    path('api/employees/', include('employees.urls')),
    
    # Add other app URLs here as you implement them
    # path('api/attendance/', include('attendance.urls')),
    # path('api/leave/', include('leave_management.urls')),
    # path('api/payroll/', include('payroll.urls')),
    # path('api/audit/', include('audit.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Customize admin site
admin.site.site_header = "HRMS Administration"
admin.site.site_title = "HRMS Admin Portal"
admin.site.index_title = "Welcome to HRMS Admin Portal"