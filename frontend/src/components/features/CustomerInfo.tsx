import { Mail, Phone, MapPin, Calendar, User, CreditCard } from 'lucide-react';
import { useEffect, useState } from 'react';

export function CustomerInfo() {
  const customer = {
    id: 'KH001',
    name: 'Nguyễn Văn An',
    dateOfBirth: '15/03/1990',
    gender: 'Nam',
    phone: '0901234567',
    email: 'nguyenvanan@email.com',
    address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
    idCard: '079090001234',
    registrationDate: '10/01/2023',
    notes: 'Dị ứng với thuốc tê Lidocaine'
  };
  const [userInfo, setUserInfo] = useState<any>(null);
  useEffect(() => {
    const storedUserInfo = sessionStorage.getItem("user_info");
    if (storedUserInfo) {
      const user = JSON.parse(storedUserInfo);
      if (user.NgaySinh) {
        user.NgaySinh = user.NgaySinh.split("T")[0];
      }
      setUserInfo(user);
    }
  }, []);


  return (
    <div className="space-y-4">
      {/* Card chính */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{userInfo?.hoTen}</h2>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Thông tin cơ bản */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Thông tin cơ bản</h3>
            <div className="space-y-3">
              <div className="flex items-start py-2">
                <Calendar className="w-5 h-5 text-slate-400 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-slate-500 mb-1">Ngày sinh</p>
                  <p className="text-sm font-medium text-slate-900">{userInfo?.ngaySinh}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Thông tin liên hệ */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Thông tin liên hệ</h3>

            <div className="space-y-3">
              <div className="flex items-start py-2">
                <Phone className="w-5 h-5 text-slate-400 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-slate-500 mb-1">Số điện thoại</p>
                  <p className="text-sm font-medium text-slate-900">{userInfo?.sdt || customer.phone}</p>
                </div>
              </div>

              <div className="flex items-start py-2">
                <Mail className="w-5 h-5 text-slate-400 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-slate-500 mb-1">Email</p>
                  <p className="text-sm font-medium text-slate-900">{userInfo?.email || customer.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
