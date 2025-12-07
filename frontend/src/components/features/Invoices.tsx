import { Receipt, Download, CheckCircle, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

export function Invoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [invoiceDetails, setInvoiceDetails] = useState<{[key: string]: any[]}>({});

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const storedUserInfo = sessionStorage.getItem("user_info");
        if (storedUserInfo) {
          const user = JSON.parse(storedUserInfo);
          
          const response = await axios.get(`http://localhost:5000/api/hoa-don/getByKhachHangID/${user.MaKhachHang}`);
          setInvoices(response.data);
          console.log("Hóa đơn đã lấy:", response.data);

          // Lấy chi tiết dịch vụ cho từng hóa đơn
          const details: {[key: string]: any[]} = {};
          for (const invoice of response.data) {
            if (invoice.MaPhieuKham) {
              try {
                const detailRes = await axios.get(`http://localhost:5000/api/chi-tiet-phieu-kham/getByPhieuKhamID/${invoice.MaPhieuKham}`);
                details[invoice.MaHoaDon] = detailRes.data;
              } catch (err) {
                console.error(`Không lấy được chi tiết cho phiếu khám ${invoice.MaPhieuKham}:`, err);
                details[invoice.MaHoaDon] = [];
              }
            }
          }
          setInvoiceDetails(details);
        }
      } catch (error) {
        console.error("Lỗi khi lấy hóa đơn:", error);
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setInvoices([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusConfig = (status: string) => {
    if (status === 'paid') {
      return {
        label: 'Đã thanh toán',
        icon: CheckCircle,
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        borderColor: 'border-green-200'
      };
    }
    return {
      label: 'Chờ thanh toán',
      icon: Clock,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-200'
    };
  };

  const totalPaid = invoices
    .filter(inv => inv.TrangThai === 'Đã thanh toán')
    .reduce((sum, inv) => sum + inv.TongTien, 0);
  
  const totalPending = invoices
    .filter(inv => inv.TrangThai === 'Chưa thanh toán')
    .reduce((sum, inv) => sum + inv.TongTien, 0);

  if (loading) {
    return <div className="text-center py-8">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-gray-600 mb-1">Tổng hóa đơn</p>
          <p className="text-gray-900">{invoices.length}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <p className="text-green-700 mb-1">Đã thanh toán</p>
          <p className="text-green-900">{formatCurrency(totalPaid)}</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-700 mb-1">Chờ thanh toán</p>
          <p className="text-yellow-900">{formatCurrency(totalPending)}</p>
        </div>
      </div>

      /* Danh sách hóa đơn */
      <div className="space-y-4">
        {invoices.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Chưa có hóa đơn nào</div>
        ) : (
          invoices.map((invoice) => {
            const statusConfig = getStatusConfig(invoice.TrangThai === 'Đã thanh toán' ? 'paid' : 'pending');
            const StatusIcon = statusConfig.icon;
            const date = new Date(invoice.NgayLap);
            const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
          
          return (
            <div
              key={invoice.MaHoaDon}
              className="bg-white rounded-lg shadow-sm border overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-50 to-white p-6 border-b">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 rounded-lg p-3">
                      <Receipt className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-gray-900">Hóa đơn #{invoice.MaHoaDon}</h3>
                      <p className="text-gray-600 mt-1">Ngày: {formattedDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span
                      className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor}`}
                    >
                      <StatusIcon className="w-4 h-4" />
                      <span>{statusConfig.label}</span>
                    </span>
                    <button
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Tải xuống"
                    >
                      <Download className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Chi tiết dịch vụ */}
              <div className="p-6">
                {invoiceDetails[invoice.MaHoaDon] && invoiceDetails[invoice.MaHoaDon].length > 0 ? (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="text-left py-3 px-4 text-gray-700">
                              Dịch vụ
                            </th>
                            <th className="text-center py-3 px-4 text-gray-700">
                              SL
                            </th>
                            <th className="text-right py-3 px-4 text-gray-700">
                              Đơn giá
                            </th>
                            <th className="text-right py-3 px-4 text-gray-700">
                              Thành tiền
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoiceDetails[invoice.MaHoaDon].map((detail: any, index: number) => (
                            <tr key={index} className="border-b last:border-0">
                              <td className="py-3 px-4 text-gray-900">
                                {detail.TenDichVu}
                              </td>
                              <td className="text-center py-3 px-4 text-gray-700">
                                {detail.SoLuong}
                              </td>
                              <td className="text-right py-3 px-4 text-gray-700">
                                {formatCurrency(detail.DonGia)}
                              </td>
                              <td className="text-right py-3 px-4 text-gray-900">
                                {formatCurrency(detail.DonGia * detail.SoLuong)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Tổng cộng */}
                    <div className="mt-6 border-t pt-4 space-y-2">
                      <div className="flex justify-between text-gray-900 pt-2 border-t">
                        <span className="font-semibold">Tổng cộng:</span>
                        <span className="font-bold text-lg">{formatCurrency(invoice.TongTien)}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Không có chi tiết dịch vụ
                  </div>
                )}

                {/* Thông tin thanh toán */}
                {invoice.TrangThai === 'Đã thanh toán' && (
                  <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-green-900 font-medium">
                          Đã thanh toán
                        </p>
                        <p className="text-green-700 mt-1 text-sm">
                          Phương thức: {invoice.PhuongThuc || 'Chưa cập nhật'}
                        </p>
                      </div>
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                )}

                {invoice.TrangThai === 'Chưa thanh toán' && (
                  <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-900">
                      Vui lòng thanh toán tại quầy sau khi hoàn thành khám
                    </p>
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
