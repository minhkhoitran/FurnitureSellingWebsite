from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    avatar = models.ImageField(upload_to='user/%Y/%m')


class LoaiHang(models.Model):
    maloaihang = models.CharField(max_length=255, null=False)
    tenloaihang = models.CharField(max_length=255, null=False, unique=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.tenloaihang


class KhongGian(models.Model):
    makg = models.CharField(max_length=255, unique=True)
    tenkg = models.CharField(max_length=50, unique=True)
    created_date = models.DateTimeField(auto_now_add=True)


class NhaCungCap(models.Model):
    mancc = models.CharField(max_length=255, null=False)
    tenncc = models.CharField(max_length=255, null=False, unique=True)
    dienthoai = models.CharField(max_length=255, null=False, blank=False)
    email = models.CharField(max_length=255, null=False, blank=True)
    website = models.CharField(max_length=255, null=False)
    hinhncc = models.ImageField(upload_to='nhacungcap/%Y/%m')
    active = models.BooleanField(default=True)
    loaihang = models.ForeignKey(LoaiHang, on_delete=models.CASCADE)


class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    created_date = models.DateTimeField(auto_now_add=True)


class MauSac(models.Model):
    name = models.CharField(max_length=50, unique=True)
    created_date = models.DateTimeField(auto_now_add=True)


class SanPham(models.Model):
    masp = models.CharField(max_length=255, null=False)
    tensp = models.CharField(max_length=255, null=False, unique=True)
    mota = models.TextField(max_length=255)
    baohanh = models.CharField(max_length=255, null=False)
    dongianiemyet = models.CharField(max_length=255, null=False)
    giakhuyenmai = models.CharField(max_length=255, null=True)
    loaihang = models.ForeignKey(LoaiHang, on_delete=models.SET_NULL, null=True, related_name="sanpham")
    active = models.BooleanField(default=True)
    stock = models.CharField(max_length=255, null=False)
    shipping = models.BooleanField(default=False)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    hinhanh = models.ImageField(upload_to='sanpham/%Y/%m')
    tags = models.ManyToManyField(Tag, related_name="sanpham", blank=True, null=True)
    mausac = models.ManyToManyField(MauSac, related_name="sanpham", blank=True, null=True)
    khonggian = models.ForeignKey(KhongGian, on_delete=models.CASCADE, related_name="sanpham")

    def __str__(self):
        return self.tensp


class HinhAnhSanPham(models.Model):
    diachi = models.ImageField(upload_to='sanpham/%Y/%m')
    sanpham = models.ForeignKey(SanPham, on_delete=models.CASCADE, related_name="diachi")


class SanPhamThuocDonHang(models.Model):
    sanpham = models.ForeignKey(SanPham, on_delete=models.CASCADE, null=True)
    soluong = models.CharField(max_length=255, null=False, default=1)
    donhang = models.ForeignKey('DonHang', on_delete=models.CASCADE, null=False)


class DonHang(models.Model):
    madonhang = models.CharField(max_length=255, null=False)
    created_date = models.DateField(auto_now_add=True)
    makhachhang = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    dongiaban = models.CharField(max_length=255, null=False, blank=False)
    khuyenmai = models.CharField(max_length=255, null=False, blank=False)


class Nhanxet(models.Model):
    sanpham = models.ForeignKey(SanPham, on_delete=models.CASCADE)
    nguoinhanxet = models.ForeignKey(User, on_delete=models.CASCADE)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    noidung = models.TextField()

    def __str__(self):
        return self.noidung


class ActionBase(models.Model):
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    sanpham = models.ForeignKey(SanPham, on_delete=models.CASCADE)
    nguoitao = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        abstract = True
        unique_together = ("sanpham", "nguoitao")


class Action(ActionBase):
    LIKE, HAHA, HEART = range(3)
    ACTIONS = [
        (LIKE, 'like'),
        (HAHA, 'haha'),
        (HEART, 'heart'),
    ]

    type = models.PositiveSmallIntegerField(choices=ACTIONS, default=LIKE)


class Danhgia(ActionBase):
    danhgia = models.PositiveSmallIntegerField(default=0)


class SanPhamView(models.Model):
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    views = models.IntegerField(default=0)
    sanpham = models.OneToOneField(SanPham, on_delete=models.CASCADE)