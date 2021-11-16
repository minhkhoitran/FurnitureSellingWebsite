from rest_framework import routers, permissions
from . import views
from django.contrib import admin
from django.urls import path, re_path, include
from .admin import admin_site

router = routers.DefaultRouter()
router.register("LoaiHang", views.LoaiHangViewSet, 'LoaiHang')
router.register("NhaCungCap", views.NhaCungCapViewSet, 'NhaCungCap')
router.register("SanPham", views.SanPhamViewSet, 'SanPham')
router.register("NhanXet", views.NhanXetViewSet, 'NhanXet')
router.register("KhongGian", views.KhongGianViewSet, 'KhongGian')
router.register("User", views.UserViewSet, 'User')
router.register("DonHang", views.DonHangViewSet, 'DonHang')


urlpatterns = [
    path('', include(router.urls)),
    path('admin/', admin_site.urls),
    path('oauth2-info/', views.AuthInfo.as_view())
]