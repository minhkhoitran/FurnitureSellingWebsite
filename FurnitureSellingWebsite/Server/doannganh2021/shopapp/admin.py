from django.contrib import admin
from django import forms
from django.db.models import Count
from django.template.response import TemplateResponse
from .models import LoaiHang, SanPham, NhaCungCap, Tag, KhongGian, User, MauSac, HinhAnhSanPham
from django.utils.html import mark_safe
from ckeditor_uploader.widgets import CKEditorUploadingWidget
from django.urls import path

# Register your models here.



class SanPhamInLineAdmin(admin.StackedInline):
    model = SanPham
    fk_name = 'loaihang'


class SanPhamTagInLineAdmin(admin.StackedInline):
    model = SanPham.tags.through


class KhongGianAdmin(admin.ModelAdmin):
    list_display = ["makg", "tenkg", "created_date"]


class TagAdmin(admin.ModelAdmin):
#    inlines = [SanPhamTagInLineAdmin, ]
    list_display = ["name", "created_date"]


class LoaiHangAdmin(admin.ModelAdmin):
    list_display = ["id", "maloaihang", "tenloaihang", "created_date"]
    search_fields = ["maloaihang", "tenloaihang"]
    list_filter = []
    inlines = [SanPhamInLineAdmin, ]


class SanPhamAdmin(admin.ModelAdmin):
    list_display = ["id", "masp", "tensp", "loaihang", "active", "shipping", "stock", "created_date"]
    search_fields = ["masp", "tensp", "loaihang__tenloaihang", "active", "stock"]
    list_filter = ["loaihang", "active", "stock", "shipping"]
    inlines = [SanPhamTagInLineAdmin, ]

    class Media:
        css = {
            'all': ('/static/css/style.css', )
        }
        js = ('/static/js/script.js', )


class HinhAnhAdmin(admin.ModelAdmin):
    list_display = ["id", "diachi", "sanpham"]
    search_fields = []
    list_filter = []
    readonly_fields = ["img"]

    def img(self, obj):
        return mark_safe("<img src='/static/{img_url}' width='120'/>".format(img_url=obj.diachi.name))


class NhaCungCapAdmin(admin.ModelAdmin):
    list_display = ["id", "mancc", "tenncc", "website"]
    search_fields = ["mancc", "tenncc", "loaihangs"]
    list_filter = []


class ShopAppAdminSite(admin.AdminSite):
    site_header = 'HỆ THỐNG BÁN HÀNG TRỰC TUYẾN'

    def get_urls(self):
        return [
            path('shopapp-stats/', self.shop_stats)
        ] + super().get_urls()

    def shop_stats(self, request):
        sp_count = SanPham.objects.filter(active=True).count()
        stats = LoaiHang.objects.annotate(count=Count('sanpham')).values('id', 'tenloaihang', 'count')
        return TemplateResponse(request, 'admin/stats.html', {
            'sp_count': sp_count,
            'sp_stats': stats
        })


admin_site = ShopAppAdminSite('myapp')


admin_site.register(SanPham, SanPhamAdmin)
admin_site.register(LoaiHang, LoaiHangAdmin)
admin_site.register(NhaCungCap, NhaCungCapAdmin)
admin_site.register(User)
admin_site.register(Tag, TagAdmin)
admin_site.register(KhongGian, KhongGianAdmin)
admin_site.register(MauSac)
admin_site.register(HinhAnhSanPham,HinhAnhAdmin)