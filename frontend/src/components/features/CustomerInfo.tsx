'use client';
import { Mail, Phone, MapPin, Calendar, User, CreditCard, Edit, Lock, Camera, X, Save, Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { toast } from 'sonner';

export function CustomerInfo() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [editForm, setEditForm] = useState({
    HoTen: '',
    SoDienThoai: '',
    Email: '',
    NgaySinh: '',
    DiaChi: ''
  });
  
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  
  // Password visibility states
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const storedUserInfo = sessionStorage.getItem("user_info");
    if (storedUserInfo) {
      const user = JSON.parse(storedUserInfo);
      if (user.ngaySinh) {
        user.ngaySinh = user.ngaySinh.split("T")[0];
      }
      setUserInfo(user);
      setEditForm({
        HoTen: user.hoTen || '',
        SoDienThoai: user.sdt || '',
        Email: user.email || '',
        NgaySinh: user.ngaySinh || '',
        DiaChi: user.diaChi || ''
      });
      
      // Set avatar preview if exists
      if (user.anhDaiDien) {
        setAvatarPreview(user.anhDaiDien);
      }
    }
  }, []);

  const handleEditSubmit = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('access_token');
      const response = await axios.put(
        `http://localhost:5000/api/khach-hang/update/${userInfo.MaKhachHang}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update sessionStorage with new info
      const updatedUser = { 
        ...userInfo, 
        hoTen: editForm.HoTen, 
        sdt: editForm.SoDienThoai, 
        email: editForm.Email, 
        ngaySinh: editForm.NgaySinh, 
        diaChi: editForm.DiaChi 
      };
      sessionStorage.setItem('user_info', JSON.stringify(updatedUser));
      setUserInfo(updatedUser);
      
      toast.success('Cập nhật thông tin thành công!');
      setEditDialogOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Cập nhật thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!passwordForm.oldPassword) {
      toast.error('Vui lòng nhập mật khẩu cũ!');
      return;
    }

    if (!passwordForm.newPassword) {
      toast.error('Vui lòng nhập mật khẩu mới!');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Mật khẩu mới không khớp!');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    setLoading(true);
    try {
      const token = sessionStorage.getItem('access_token');
      await axios.put(
        `http://localhost:5000/api/khach-hang/change-password/${userInfo.MaKhachHang}`,
        {
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('Đổi mật khẩu thành công!');
      setPasswordDialogOpen(false);
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Đổi mật khẩu thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarSubmit = async () => {
    if (!avatarFile) {
      toast.error('Vui lòng chọn ảnh!');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      
      const token = sessionStorage.getItem('access_token');
      const response = await axios.put(
        `http://localhost:5000/api/khach-hang/update-avatar/${userInfo.MaKhachHang}`,
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          } 
        }
      );
      
      toast.success('Cập nhật avatar thành công!');
      setAvatarDialogOpen(false);
      setAvatarFile(null);
      setAvatarPreview('');
      
      // Reload to show new avatar
      window.location.reload();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Cập nhật avatar thất bại!');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="space-y-4">
      {/* Card chính */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 sm:p-6 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-50 rounded-full flex items-center justify-center overflow-hidden border-2 border-blue-200">
                  {userInfo?.anhDaiDien ? (
                    <img 
                      src={`${userInfo.anhDaiDien}?t=${Date.now()}`} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <User className={`w-8 h-8 sm:w-10 sm:h-10 text-blue-600 ${userInfo?.anhDaiDien ? 'hidden' : ''}`} />
                </div>
                <button
                  onClick={() => setAvatarDialogOpen(true)}
                  className="absolute -bottom-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg"
                >
                  <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900 truncate">{userInfo?.hoTen}</h2>
                <p className="text-sm text-slate-500">Khách hàng</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                onClick={() => setEditDialogOpen(true)}
                variant="outline"
                size="sm"
                className="gap-1 sm:gap-2 flex-1 sm:flex-initial"
              >
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">Sửa thông tin</span>
                <span className="sm:hidden">Sửa</span>
              </Button>
              <Button
                onClick={() => setPasswordDialogOpen(true)}
                variant="outline"
                size="sm"
                className="gap-1 sm:gap-2 flex-1 sm:flex-initial"
              >
                <Lock className="w-4 h-4" />
                <span className="hidden sm:inline">Đổi mật khẩu</span>
                <span className="sm:hidden">Mật khẩu</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Thông tin cơ bản */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xs sm:text-sm font-semibold text-slate-900 uppercase tracking-wide">Thông tin cơ bản</h3>
            <div className="space-y-3">
              <div className="flex items-start py-2">
                <Calendar className="w-5 h-5 text-slate-400 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-slate-500 mb-1">Ngày sinh</p>
                  <p className="text-sm font-medium text-slate-900">{userInfo?.ngaySinh || 'Chưa cập nhật'}</p>
                </div>
              </div>
              
              <div className="flex items-start py-2">
                <MapPin className="w-5 h-5 text-slate-400 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-slate-500 mb-1">Địa chỉ</p>
                  <p className="text-sm font-medium text-slate-900">{userInfo?.diaChi || 'Chưa cập nhật'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Thông tin liên hệ */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xs sm:text-sm font-semibold text-slate-900 uppercase tracking-wide">Thông tin liên hệ</h3>
            <div className="space-y-3">
              <div className="flex items-start py-2">
                <Phone className="w-5 h-5 text-slate-400 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-slate-500 mb-1">Số điện thoại</p>
                  <p className="text-sm font-medium text-slate-900">{userInfo?.sdt || 'Chưa cập nhật'}</p>
                </div>
              </div>

              <div className="flex items-start py-2">
                <Mail className="w-5 h-5 text-slate-400 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-slate-500 mb-1">Email</p>
                  <p className="text-sm font-medium text-slate-900">{userInfo?.email || 'Chưa cập nhật'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Info Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] mx-4 max-w-[calc(100%-2rem)]">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Chỉnh sửa thông tin</DialogTitle>
            <DialogDescription className="text-sm">Cập nhật thông tin cá nhân của bạn</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 sm:space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="hoTen">Họ và tên</Label>
              <Input
                id="hoTen"
                value={editForm.HoTen}
                onChange={(e) => setEditForm({...editForm, HoTen: e.target.value})}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sdt">Số điện thoại</Label>
              <Input
                id="sdt"
                value={editForm.SoDienThoai}
                onChange={(e) => setEditForm({...editForm, SoDienThoai: e.target.value})}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editForm.Email}
                onChange={(e) => setEditForm({...editForm, Email: e.target.value})}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ngaySinh">Ngày sinh</Label>
              <Input
                id="ngaySinh"
                type="date"
                value={editForm.NgaySinh}
                onChange={(e) => setEditForm({...editForm, NgaySinh: e.target.value})}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="diaChi">Địa chỉ</Label>
              <Input
                id="diaChi"
                value={editForm.DiaChi}
                onChange={(e) => setEditForm({...editForm, DiaChi: e.target.value})}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-2">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)} className="w-full sm:w-auto">
              Hủy
            </Button>
            <Button onClick={handleEditSubmit} disabled={loading} className="w-full sm:w-auto">
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[400px] mx-4 max-w-[calc(100%-2rem)]">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Đổi mật khẩu</DialogTitle>
            <DialogDescription className="text-sm">Nhập mật khẩu cũ và mật khẩu mới</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 sm:space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="oldPassword">Mật khẩu cũ</Label>
              <div className="relative">
                <Input
                  id="oldPassword"
                  type={showOldPassword ? "text" : "password"}
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Mật khẩu mới</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-2">
            <Button variant="outline" onClick={() => setPasswordDialogOpen(false)} className="w-full sm:w-auto">
              Hủy
            </Button>
            <Button onClick={handlePasswordSubmit} disabled={loading} className="w-full sm:w-auto">
              <Lock className="w-4 h-4 mr-2" />
              {loading ? 'Đang đổi...' : 'Đổi mật khẩu'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Avatar Dialog */}
      <Dialog open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
        <DialogContent className="sm:max-w-[400px] mx-4 max-w-[calc(100%-2rem)]">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Cập nhật ảnh đại diện</DialogTitle>
            <DialogDescription className="text-sm">Chọn ảnh mới cho tài khoản của bạn</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 sm:space-y-4 py-4">
            <div className="flex justify-center">
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
                {avatarPreview ? (
                  <img src={`${avatarPreview}?t=${Date.now()}`} alt="Preview" className="w-full h-full object-cover" />
                ) : userInfo?.anhDaiDien ? (
                  <img src={`${userInfo.anhDaiDien}?t=${Date.now()}`} alt="Current Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-gray-400" />
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatar">Chọn ảnh</Label>
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-2">
            <Button variant="outline" onClick={() => setAvatarDialogOpen(false)} className="w-full sm:w-auto">
              Hủy
            </Button>
            <Button onClick={handleAvatarSubmit} disabled={loading || !avatarFile} className="w-full sm:w-auto">
              <Camera className="w-4 h-4 mr-2" />
              {loading ? 'Đang tải...' : 'Cập nhật'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
