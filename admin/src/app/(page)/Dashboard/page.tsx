"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import {
  Users,
  CalendarDays,
  Stethoscope,
  ClipboardList,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Màu cho biểu đồ tròn - phân bổ theo trạng thái
const STATUS_COLORS: Record<string, string> = {
  'Chờ xác nhận': '#FCD34D', // Vàng
  'Đã xác nhận': '#60A5FA',  // Xanh dương
  'Đang khám': '#34D399',    // Xanh lá
  'Hoàn thành': '#10B981',   // Xanh đậm
  'Không đến': '#F97316',    // Cam
  'Đã hủy': '#EF4444',       // Đỏ
};

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308'];

export default function AdminHome() {
  const [stats, setStats] = useState({
    doctors: 0,
    customers: 0,
    appointments: 0,
    services: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [appointmentsByStatus, setAppointmentsByStatus] = useState([]);
  const [topServices, setTopServices] = useState([]);
  const [doctorStats, setDoctorStats] = useState([]);
  const [monthRevenue, setMonthRevenue] = useState({ tongDoanhThu: 0, soHoaDon: 0 });
  const [cancellationRate, setCancellationRate] = useState({ tyLeHuy: 0 });
  const [revenueChart, setRevenueChart] = useState([]);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(price);
  };

  useEffect(() => {
    // Lấy thống kê tổng quan
    axios
      .get("http://localhost:5000/api/admin/stats")
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Lỗi khi tải thống kê:", err));

    // Lấy dữ liệu biểu đồ lịch hẹn (7 ngày gần nhất)
    axios
      .get("http://localhost:5000/api/admin/appointments/chart")
      .then((res) => setChartData(res.data))
      .catch((err) => console.error("Lỗi khi tải biểu đồ:", err));

    // Lấy 5 lịch hẹn gần nhất
    axios
      .get("http://localhost:5000/api/admin/appointments/recent")
      .then((res) => setRecentAppointments(res.data))
      .catch((err) => console.error("Lỗi khi tải lịch hẹn gần đây:", err));

    // Lấy thống kê lịch hẹn theo trạng thái
    axios
      .get("http://localhost:5000/api/admin/appointments/status")
      .then((res) => setAppointmentsByStatus(res.data))
      .catch((err) => console.error("Lỗi khi tải thống kê trạng thái:", err));

    // Lấy top 5 dịch vụ
    axios
      .get("http://localhost:5000/api/admin/services/top")
      .then((res) => setTopServices(res.data))
      .catch((err) => console.error("Lỗi khi tải top dịch vụ:", err));

    // Lấy thống kê bác sĩ
    axios
      .get("http://localhost:5000/api/admin/doctors/stats")
      .then((res) => setDoctorStats(res.data))
      .catch((err) => console.error("Lỗi khi tải thống kê bác sĩ:", err));

    // Lấy doanh thu tháng hiện tại
    axios
      .get("http://localhost:5000/api/admin/revenue/current-month")
      .then((res) => setMonthRevenue(res.data))
      .catch((err) => console.error("Lỗi khi tải doanh thu tháng:", err));

    // Lấy tỷ lệ hủy lịch
    axios
      .get("http://localhost:5000/api/admin/appointments/cancellation-rate")
      .then((res) => setCancellationRate(res.data))
      .catch((err) => console.error("Lỗi khi tải tỷ lệ hủy:", err));

    // Lấy doanh thu 7 ngày gần nhất
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    axios
      .get(`http://localhost:5000/api/admin/revenue?startDate=${startDate}&endDate=${endDate}`)
      .then((res) => setRevenueChart(res.data))
      .catch((err) => console.error("Lỗi khi tải biểu đồ doanh thu:", err));
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Trang Quản Trị</h1>

      {/* --- Thống kê tổng quan --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng Bác sĩ</CardTitle>
            <Stethoscope className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.doctors}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng Khách hàng</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.customers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng Lịch hẹn</CardTitle>
            <CalendarDays className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.appointments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng Dịch vụ</CardTitle>
            <ClipboardList className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.services}</div>
          </CardContent>
        </Card>
      </div>

      {/* --- Thống kê doanh thu & tỷ lệ hủy --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu tháng này</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(monthRevenue.tongDoanhThu)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Từ {monthRevenue.soHoaDon} hóa đơn
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tỷ lệ hủy lịch (30 ngày)</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cancellationRate.tyLeHuy}%</div>
          </CardContent>
        </Card>
      </div>

      {/* --- Tabs cho các biểu đồ --- */}
      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="appointments">Lịch hẹn</TabsTrigger>
          <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
          <TabsTrigger value="services">Dịch vụ & Bác sĩ</TabsTrigger>
        </TabsList>

        {/* Tab Lịch hẹn */}
        <TabsContent value="appointments" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Lịch hẹn 7 ngày gần nhất</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ngay" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="soLuong" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Phân bổ theo trạng thái</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={appointmentsByStatus}
                      dataKey="soLuong"
                      nameKey="TinhTrang"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={(entry) => `${entry.TinhTrang}: ${entry.soLuong}`}
                    >
                      {appointmentsByStatus.map((entry: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={STATUS_COLORS[entry.TinhTrang] || COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lịch hẹn gần nhất</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2">Khách hàng</th>
                      <th className="p-2">Bác sĩ</th>
                      <th className="p-2">Ngày khám</th>
                      <th className="p-2">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAppointments.length > 0 ? (
                      recentAppointments.map((item: any) => (
                        <tr
                          key={item.MaLichHen}
                          className="border-b hover:bg-gray-50 transition-colors"
                        >
                          <td className="p-2">{item.TenKhachHang}</td>
                          <td className="p-2">{item.TenBacSi}</td>
                          <td className="p-2">
                            {new Date(item.NgayHen).toLocaleDateString("vi-VN")}
                          </td>
                          <td className="p-2">{item.TinhTrang}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="p-2 text-gray-500" colSpan={4}>
                          Không có lịch hẹn nào gần đây
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Doanh thu */}
        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Biểu đồ doanh thu 7 ngày gần nhất</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={revenueChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ngay" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatPrice(Number(value))} />
                  <Legend />
                  <Line type="monotone" dataKey="doanhThu" stroke="#10b981" strokeWidth={2} name="Doanh thu" />
                  <Line type="monotone" dataKey="soHoaDon" stroke="#6366f1" strokeWidth={2} name="Số hóa đơn" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Dịch vụ & Bác sĩ */}
        <TabsContent value="services" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top 5 Dịch vụ phổ biến</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topServices.map((service: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{service.TenDichVu}</p>
                          <p className="text-sm text-gray-600">{service.soLanSuDung} lượt sử dụng</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thống kê Bác sĩ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {doctorStats.map((doctor: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{doctor.tenBacSi}</p>
                        <p className="text-sm text-gray-600">{doctor.soLuotKham} lượt khám</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-blue-600">{formatPrice(doctor.doanhThu)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
