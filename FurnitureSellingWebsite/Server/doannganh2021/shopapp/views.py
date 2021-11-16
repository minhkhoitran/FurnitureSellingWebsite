from typing import Union
from django.conf import settings
from django.db.models import F
from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.
from django.views import View
from rest_framework import viewsets, generics, status, permissions
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from django.http import Http404
from rest_framework.views import APIView

from .paginator import BasePagination
from rest_framework.decorators import action
from .models import LoaiHang, SanPham, Nhanxet, NhaCungCap, Tag, Danhgia, DonHang, \
    SanPhamView, Nhanxet, Action, KhongGian, User
from .serializers import (LoaiHangSerializer, SanPhamSerializer,
                          NhaCungCapSerializer, TagSerializers,
                          KhongGianSerializers, UserSerializer,
                          SanPhamDetailSerializer, HinhAnhSerializers,
                          DonHangSerializers, NhanXetSerializer,
                          ActionSerializer, RatingSerializer,
                          SanPhamViewSerializer,)


# class TestView(View):
#
#    def get(self, request):
#        return HttpResponse("TESTING")
#
#    def post(self, request):
#        pass


class LoaiHangViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    serializer_class = LoaiHangSerializer
    queryset = LoaiHang.objects.all()

    @action(methods=['get'], detail=True, url_path='sanpham')
    def get_sanpham(self, request, pk):
        sanpham = LoaiHang.objects.get(pk=pk).sanpham.filter(active=True)

        q = request.query_params.get('q')
        if q is not None:
            sanpham = sanpham.filter(tensp__icontains=q)

        shipping = self.request.query_params.get('shipping')
        if shipping is not None:
            sanpham = sanpham.filter(shipping=shipping)

        kg = self.request.query_params.get('khonggian')
        if kg is not None:
            sanpham = sanpham.filter(khonggian=kg)

        return Response(SanPhamSerializer(sanpham, many=True, context={"request": request}).data,
                        status=status.HTTP_200_OK)

   # permission_classes = [permissions.IsAuthenticated, ]
# phân quyền
#    def get_permissions(self):
#        if self.action == 'list':
#            return [permissions.AllowAny()]
#        return [permissions.IsAuthenticated()]


class SanPhamViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    serializer_class = SanPhamDetailSerializer
    queryset = SanPham.objects.filter(active=True)

    def get_queryset(self):
        sanpham = SanPham.objects.filter(active=True)

        ten = self.request.query_params.get('ten')
        if ten is not None:
            sanpham = sanpham.filter(tensp__icontains=ten)

        loai_id = self.request.query_params.get('loaihang')
        if loai_id is not None:
            sanpham = sanpham.filter(loaihang_id=loai_id)

        shipping = self.request.query_params.get('shipping')
        if shipping is not None:
            sanpham = sanpham.filter(shipping=shipping)

        kg = self.request.query_params.get('khonggian')
        if kg is not None:
            sanpham = sanpham.filter(khonggian=kg)

        masp = self.request.query_params.get('masp')
        if masp is not None:
            sanpham = sanpham.filter(masp=masp)

        stock = self.request.query_params.get('stock')
        if stock is not None:
            sanpham = sanpham.filter(stock=stock)

        return sanpham

    def get_permissions(self):
        if self.action in ['add_comment', 'take_action', 'rate', 'inc_view']:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(methods=['get'], detail=True, url_path="img")
    def get_img(self, request, pk):
        diachi = SanPham.objects.get(pk=pk).diachi

        return Response(HinhAnhSerializers(diachi, many=True, context={"request": request}).data,
                        status=status.HTTP_200_OK)

    @action(methods=['post'], detail=True, url_path="tags")
    def add_tag(self, request, pk):
        try:
            sanpham = self.get_object()
        except Http404:
            return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            tags = request.data.get("tags")
            if tags is not None:
                for tag in tags:
                    t, _ = Tag.objects.get_or_create(name=tag)
                    sanpham.tags.add(t)

                sanpham.save()

                return Response(self.serializer_class(sanpham).data,
                                status=status.HTTP_201_CREATED)

        return Response(status=status.HTTP_404_NOT_FOUND)

    @action(methods=['post'], detail=True, url_path="add-comment")
    def add_comment(self, request, pk):
        noidung = request.data.get('noidung')
        if noidung:
            c = Nhanxet.objects.create(noidung=noidung,
                                       sanpham=self.get_object(),
                                       nguoinhanxet=request.user)

            return Response(NhanXetSerializer(c).data,
                            status=status.HTTP_201_CREATED)

        return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['get'], detail=True, url_path="comments")
    def get_comments(self, request, pk):
        l = self.get_object()
        return Response(NhanXetSerializer(l.nhanxet_set.order_by("-id").all(), many=True,
                                          context={"request": self.request}).data, status=status.HTTP_200_OK)

    @action(methods=['post'], detail=True, url_path='like')
    def take_action(self, request, pk):
        try:
            action_type = int(request.data['type'])
        except Union[IndexError, ValueError]:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            action = Action.objects.create(type=action_type,
                                           nguoitao=request.user,
                                           sanpham=self.get_object())

            return Response(ActionSerializer(action).data,
                            status=status.HTTP_200_OK)

    # @action(methods=['post'], detail=True, url_path='del-action')
    # def delete_action(self, request, pk):
    #     try:
    #         action_type = int(request.data['type'])
    #     except Union[IndexError, ValueError]:
    #         return Response(status=status.HTTP_400_BAD_REQUEST)
    #     else:
    #         action = Action.objects.create(type=action_type,
    #                                        nguoitao=request.user,
    #                                        sanpham=self.get_object())
    #
    #         return Response(ActionSerializer(action).data,
    #                         status=status.HTTP_200_OK)

    @action(methods=['post'], detail=True, url_path='rating')
    def rate(self, request, pk):
        try:
            danhgia = int(request.data['danhgia'])
        except Union[IndexError, ValueError]:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            rate = Danhgia.objects.update_or_create(nguoitao=request.user,
                                                    sanpham=self.get_object(),
                                                    defaults={"danhgia" : danhgia})

            return Response(RatingSerializer(rate).data,
                            status=status.HTTP_200_OK)

    @action(methods=['get'], detail=True, url_path='views')
    def inc_view(self, request, pk):
        v, created = SanPhamView.objects.get_or_create(sanpham=self.get_object())
        v.views = F('views') + 1
        v.save()

        v.refresh_from_db()

        return Response(SanPhamViewSerializer(v).data, status=status.HTTP_200_OK)


class ActionViewSet(viewsets.ViewSet, generics.DestroyAPIView, generics.UpdateAPIView):
    serializer_class = ActionSerializer
    queryset = Action.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        if request.user == self.get_object().nguoitao:
            return super().destroy(request, *args, **kwargs)

        return Response(status=status.HTTP_403_FORBIDDEN)

    def partial_update(self, request, *args, **kwargs):
        if request.user == self.get_object().nguoitao:
            return super().partial_update(request, *args, **kwargs)

        return Response(status=status.HTTP_403_FORBIDDEN)


class NhanXetViewSet(viewsets.ViewSet, generics.DestroyAPIView, generics.UpdateAPIView):
    serializer_class = NhanXetSerializer
    queryset = Nhanxet.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        if request.user == self.get_object().nguoinhanxet:
            return super().destroy(request, *args, **kwargs)

        return Response(status=status.HTTP_403_FORBIDDEN)

    def partial_update(self, request, *args, **kwargs):
        if request.user == self.get_object().nguoinhanxet:
            return super().partial_update(request, *args, **kwargs)

        return Response(status=status.HTTP_403_FORBIDDEN)


class RatingViewSet(viewsets.ViewSet, generics.DestroyAPIView, generics.UpdateAPIView):
    serializer_class = RatingSerializer
    queryset = Danhgia.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        if request.user == self.get_object().nguoitao:
            return super().destroy(request, *args, **kwargs)

        return Response(status=status.HTTP_403_FORBIDDEN)

    def partial_update(self, request, *args, **kwargs):
        if request.user == self.get_object().nguoitao:
            return super().partial_update(request, *args, **kwargs)

        return Response(status=status.HTTP_403_FORBIDDEN)


class NhaCungCapViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    serializer_class = NhaCungCapSerializer
    pagination_class = BasePagination
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        nhacungcap = NhaCungCap.objects.filter(active=True)

        ten = self.request.query_params.get('ten')
        if ten is not None:
            nhacungcap = nhacungcap.filter(tenncc__icontains=ten)

        id = self.request.query_params.get('id')
        if id is not None:
            nhacungcap = nhacungcap.filter(id__icontains=id)

        return nhacungcap


class KhongGianViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = KhongGian.objects.all()
    serializer_class = KhongGianSerializers

    @action(methods=['get'], detail=True, url_path='sanpham')
    def get_sanpham(self, request, pk):
        sanpham = KhongGian.objects.get(pk=pk).sanpham.filter(active=True)

        ten = request.query_params.get('ten')
        if ten is not None:
            sanpham = sanpham.filter(tensp__icontains=ten)

        loai_id = self.request.query_params.get('loaihang')
        if loai_id is not None:
            sanpham = sanpham.filter(loaihang_id=loai_id)

        shipping = self.request.query_params.get('shipping')
        if shipping is not None:
            sanpham = sanpham.filter(shipping=shipping)

        return Response(SanPhamSerializer(sanpham, many=True, context={"request": request}).data,
                        status=status.HTTP_200_OK)


class UserViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer
    parser_classes = [MultiPartParser, ]

    def get_permissions(self):
        if self.action == 'get_current_user':
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(methods=['get'], detail=False, url_path="current-user")
    def get_current_user(self, request):
        return Response(self.serializer_class(request.user, context={"request": request}).data,
                        status=status.HTTP_200_OK)


class DonHangViewSet(viewsets.ViewSet, generics.CreateAPIView):
    serializer_class = DonHangSerializers
    parser_classes = [MultiPartParser, ]

    def create(self, request, *args, **kwargs):
        makhachhang = request()

    @action(methods=['post'], detail=True, url_path="add-donhang")
    def add_donhang(self, request):
        try:
            dongiaban = int(request.data['dongiaban'])
            khuyenmai = int(request.data['khuyenmai'])
        except Union[IndexError, ValueError]:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            donhang = DonHang.objects.update_or_create(makhachhang=request.user,
                                                    defaults={"dongiaban" : dongiaban, "khuyenmai":khuyenmai,})

            return Response(DonHangSerializers(donhang).data,
                            status=status.HTTP_200_OK)

    @action(methods=['get'], detail=True, url_path="donhang")
    def get_donhang(self, request, pk):
        pass


class AuthInfo(APIView):
    def get(self, request):
        return Response(settings.OAUTH2_INFO, status=status.HTTP_200_OK)