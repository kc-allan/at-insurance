from django.contrib import admin
from .models import Policy


# Register your models here.
admin.site.site_header = "AT Insurance Admin"
admin.site.register(Policy)