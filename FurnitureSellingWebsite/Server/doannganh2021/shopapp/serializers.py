from rest_framework.serializers import ModelSerializer, SerializerMethodField
from .models import LoaiHang, SanPham, Nhanxet, NhaCungCap, Tag, Danhgia, DonHang, \
    SanPhamView, Nhanxet, Action, KhongGian, MauSac, User, HinhAnhSanPham, SanPhamThuocDonHang


class LoaiHangSerializer(ModelSerializer):
    class Meta:
        model = LoaiHang
        fields = ["id", "tenloaihang", "maloaihang", "created_date"]


class TagSerializers(ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name"]


class KhongGianSerializers(ModelSerializer):
    class Meta:
        model = KhongGian
        fields = "__all__"


class MauSacSerializers(ModelSerializer):
    class Meta:
        model = MauSac
        fields = ["id", "name"]


class SanPhamSerializer(ModelSerializer):
    class Meta:
        model = SanPham
        fields = ["id", "masp", "tensp", "mota", "loaihang"]


class SanPhamDetailSerializer(SanPhamSerializer):
    tags = TagSerializers(many=True)
    mausac = MauSacSerializers(many=True)
    hinhanh = SerializerMethodField()
    danhgia = SerializerMethodField()

    def get_danhgia(self, sanpham):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            r = sanpham.rating_set.filter(nguoitao=request.user).first()
            if r:
                return r.danhgia
        return -1

    def get_hinhanh(self, obj):
        request = self.context['request']
        name = obj.hinhanh.name
        if name.startswith("static/"):
            path = '/%s' % name
        else:
            path = '/static/%s' % name

        return request.build_absolute_uri(path)

    class Meta:
        model = SanPhamSerializer.Meta.model
        fields = SanPhamSerializer.Meta.fields + ["baohanh", "dongianiemyet", "giakhuyenmai", "active", "stock",
                                                  "created_date", "khonggian", "hinhanh",
                                                  "shipping", "tags", "mausac", "danhgia"]


class HinhAnhSerializers(ModelSerializer):
    diachi = SerializerMethodField()

    def get_diachi(self, obj):
        request = self.context['request']
        name = obj.diachi.name
        if name.startswith("static/"):
            path = '/%s' % name
        else:
            path = '/static/%s' % name

        return request.build_absolute_uri(path)

    class Meta:
        model = HinhAnhSanPham
        fields = ["id", "diachi", "sanpham"]


class NhaCungCapSerializer(ModelSerializer):
    hinhncc = SerializerMethodField()
    loaihang = LoaiHangSerializer()

    def get_hinhncc(self, obj):
        requests = self.context['request']
        name = obj.hinhncc.name
        if name.startswith("static/"):
            path = '/%s' % name
        else:
            path = 'static/%s' % name

        return requests.build_absolute_uri(path)

    class Meta:
        model = NhaCungCap
        fields = "__all__"


class UserSerializer(ModelSerializer):
    avatar = SerializerMethodField()

    def get_avatar(self, user):
        request = self.context['request']
        if user.avatar:
            name = user.avatar.name
            if name.startswith("static/"):
                path = '/%s' % name
            else:
                path = '/static/%s' % name

            return request.build_absolute_uri(path)

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(user.password)
        user.save()

        return user

    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "avatar",
                  "username", "password", "email", "date_joined"]
        extra_kwargs = {
            'password': {'write_only': 'true'}
        }


class NhanXetSerializer(ModelSerializer):
    nguoinhanxet = SerializerMethodField()

    def get_nguoinhanxet(self, nhanxet):
        return UserSerializer(nhanxet.nguoinhanxet, context={"request": self.context.get('request')}).data

    class Meta:
        model = Nhanxet
        fields = ['id', 'noidung', 'created_date', 'updated_date', 'nguoinhanxet']


class ActionSerializer(ModelSerializer):
    class Meta:
        model = Action
        fields =['id', 'type', 'created_date']


class RatingSerializer(ModelSerializer):
    class Meta:
        model = Danhgia
        fields = ['id', 'danhgia', 'created_date']


class SanPhamViewSerializer(ModelSerializer):
    class Meta:
        model = SanPhamView
        fields = ['id', 'views', 'sanpham']


class DonHangSerializers(ModelSerializer):
    makhachhang = SerializerMethodField()
    # sanpham = SerializerMethodField()

    def get_makhachhang(self, donhang):
        return UserSerializer(donhang.makhachhang, context={"request": self.context.get('request')}).data

    class Meta:
        model = DonHang
        fields = ['id', 'madonhang', 'makhachhang']


class SanPhamThuocDonHangSerializers(ModelSerializer):

    class Meta:
        model = SanPhamThuocDonHang
        fields = ['id', 'soluong','donhang']