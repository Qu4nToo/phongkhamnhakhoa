import { FileText, User, Calendar, Pill, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

export function MedicalRecords() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const storedUserInfo = sessionStorage.getItem("user_info");
        if (storedUserInfo) {
          const user = JSON.parse(storedUserInfo);
          
          // Lấy phiếu khám theo khách hàng ID
          const response = await axios.get(`http://localhost:5000/api/phieu-kham/getByKhachHangID/${user.MaKhachHang}`);
          setRecords(response.data);
          console.log("Phiếu khám đã lấy:", response.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy phiếu khám:", error);
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setRecords([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border rounded-lg p-6">
          <p className="text-gray-600 mb-1">Tổng phiếu khám</p>
          <p className="text-gray-900">{records.length}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-700 mb-1">Lần khám gần nhất</p>
          <p className="text-blue-900">
            {records.length > 0 ? new Date(records[0].NgayKham).toLocaleDateString('vi-VN') : 'Chưa có'}
          </p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <p className="text-green-700 mb-1">Phiếu khám</p>
          <p className="text-green-900">{records.length} lần</p>
        </div>
      </div>

      {/* Danh sách phiếu khám */}
      <div className="space-y-4">
        {records.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Chưa có phiếu khám nào</div>
        ) : (
          records.map((record) => {
            const date = new Date(record.NgayKham);
            const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
            
            return (
            <div
              key={record.MaPhieuKham}
              className="bg-white rounded-lg shadow-sm border overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-50 to-white p-6 border-b">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 rounded-lg p-3">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-gray-900">Phiếu khám #{record.MaPhieuKham}</h3>
                      <p className="text-gray-600 mt-1">Ngày khám: {formattedDate}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full border border-green-200">
                    {record.TrangThai}
                  </span>
                </div>
              </div>

              {/* Nội dung */}
              <div className="p-6 space-y-6">
                {/* Thông tin bác sĩ */}
                <div className="flex items-center space-x-3 pb-4 border-b">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-gray-600">Bác sĩ điều trị</p>
                    <p className="text-gray-900">{record.TenBacSi || 'Chưa cập nhật'}</p>
                  </div>
                </div>

                {/* Chẩn đoán và điều trị */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-gray-900 mb-2">Chẩn đoán</h4>
                    <p className="text-gray-700 bg-gray-50 rounded-lg p-3">
                      {record.ChuanDoan || 'Chưa có chẩn đoán'}
                    </p>
                  </div>
                </div>

                {/* Ghi chú */}
                {record.GhiChu && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="text-yellow-900 mb-1">Ghi chú & Lưu ý</h4>
                        <p className="text-yellow-800">{record.GhiChu}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })
        )}
      </div>
    </div>
  );
}
