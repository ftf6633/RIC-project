from django.contrib import admin
from django.urls import path, include, re_path
from django.conf.urls import include, url, i18n
from home.view import *
from django.views.generic import TemplateView

# urlpatterns = [
#     path('api-auth/', include('rest_framework.urls')),
#     path('rest-auth/', include('rest_auth.urls')),
#     path('rest-auth/registration/', include('rest_auth.registration.urls')),
#     path('admin/', admin.site.urls),
#     re_path(r'^.*', TemplateView.as_view(template_name='index.html')),
# ]

urlpatterns = [
    url(r'^login/$', ajaxLogin, name="login"),
    url(r'^logout/$', logout, name="logout"),
    url(r'^list/$', getClientList, name="get list"),
    url(r'^getClientDetail/$', getClientDetail, name="get list"),
    url(r'^getOtherClientList/$', getOtherClientList, name="get deleted or canceled clients list"),
    url(r'^saveClientDetail/$', saveClientDetail, name="get list"),
    url(r'^getUserList/$', getUserList, name="get user list"),
    url(r'^deleteClient/$', deleteClient, name="delete client"),
    url(r'^cancelClient/$', cancelClient, name="cancel client"),
]