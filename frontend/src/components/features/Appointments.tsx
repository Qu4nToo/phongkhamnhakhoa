import { Calendar, Clock, User, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

export function Appointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const storedUserInfo = sessionStorage.getItem("user_info");
        if (storedUserInfo) {
          const user = JSON.parse(storedUserInfo);
          const response = await axios.get(`http://localhost:5000/api/lich-hen/getByKhachHangID/${user.MaKhachHang}`);
          
          setAppointments(response.data);
          console.log("Lịch hẹn đã lấy:", response.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy lịch hẹn:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Đã xác nhận':
        return {
          label: 'Đã xác nhận',
          icon: CheckCircle,
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200'
        };
      case 'Hoàn thành':
        return {
          label: 'Hoàn thành',
          icon: CheckCircle,
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200'
        };
      case 'Đã hủy':
        return {
          label: 'Đã hủy',
          icon: XCircle,
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-200'
        };
      case 'Không đến':
        return {
          label: 'Không đến',
          icon: XCircle,
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200'
        };
      case 'Đang khám':
        return {
          label: 'Đang khám',
          icon: Clock,
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-800',
          borderColor: 'border-purple-200'
        };
      default:
        return {
          label: 'Chờ xác nhận',
          icon: AlertCircle,
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200'
        };
    }
  };

  const upcomingAppointments = appointments.filter(
    (apt) => apt.TinhTrang === 'Đã xác nhận'
  );
  const completedAppointments = appointments.filter(
    (apt) => apt.TinhTrang === 'Hoàn thành'
  );

  if (loading) {
    return <div className="text-center py-8">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-700 mb-1">Lịch sắp tới</p>
          <p className="text-blue-900">{upcomingAppointments.length}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <p className="text-green-700 mb-1">Đã hoàn thành</p>
          <p className="text-green-900">{completedAppointments.length}</p>
        </div>
        <div className="bg-white border rounded-lg p-6">
          <p className="text-gray-600 mb-1">Tổng lịch hẹn</p>
          <p className="text-gray-900">{appointments.length}</p>
        </div>
      </div>

      {/* Lịch hẹn sắp tới */}
      {upcomingAppointments.length > 0 && (
        <div>
          <h2 className="text-gray-900 mb-4">Lịch hẹn sắp tới</h2>
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => {
              const statusConfig = getStatusConfig(appointment.TinhTrang);
              const StatusIcon = statusConfig.icon;
              const date = new Date(appointment.NgayHen);
              const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;

              return (
                <div
                  key={appointment.MaLichHen}
                  className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="bg-gradient-to-r from-blue-50 to-white p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="bg-blue-100 rounded-lg p-3">
                          <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-gray-900">{appointment.TenDichVu}</h3>
                          <p className="text-gray-600 mt-1">Mã: {appointment.MaLichHen}</p>
                        </div>
                      </div>
                      <span
                        className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor}`}
                      >
                        <StatusIcon className="w-4 h-4" />
                        <span>{statusConfig.label}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-gray-600">Ngày khám</p>
                          <p className="text-gray-900">{formattedDate}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-gray-600">Giờ khám</p>
                          <p className="text-gray-900">{appointment.GioHen}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-gray-600">Bác sĩ</p>
                          <p className="text-gray-900">{appointment.TenBacSi || 'Chưa phân công'}</p>
                        </div>
                      </div>
                    </div>

                    {appointment.GhiChu && (
                      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-yellow-800">{appointment.GhiChu}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Lịch sử khám */}
      <div>
        <h2 className="text-gray-900 mb-4">Lịch hẹn của tôi</h2>
        <div className="space-y-3">
          {appointments
            .filter((apt) => apt.TinhTrang !== 'Đã xác nhận')
            .map((appointment) => {
              const statusConfig = getStatusConfig(appointment.TinhTrang);
              const StatusIcon = statusConfig.icon;
              const date = new Date(appointment.NgayHen);
              const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;

              return (
                <div
                  key={appointment.MaLichHen}
                  className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="text-gray-900">{appointment.TenDichVu}</h4>
                          <span
                            className={`flex items-center space-x-1 px-2 py-0.5 rounded-full border text-sm ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            <span>{statusConfig.label}</span>
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 mt-1 text-gray-600">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formattedDate}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{appointment.GioHen}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{appointment.TenBacSi || 'Chưa phân công'}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {appointment.GhiChu && (
                    <div className="mt-3 ml-16 text-gray-600 bg-gray-50 rounded p-2">
                      {appointment.GhiChu}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
