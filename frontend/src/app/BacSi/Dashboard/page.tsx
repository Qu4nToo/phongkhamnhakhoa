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
} from "recharts";
import {
  CalendarDays,
  ClipboardList,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function DoctorDashboard() {
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [stats, setStats] = useState({
    lichHenHomNay: 0,
    lichHenTuanNay: 0,
    soLuotKhamThang: 0,
    tongSoLuotKham: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [appointmentsByStatus, setAppointmentsByStatus] = useState([]);

  useEffect(() => {
    const userInfo = sessionStorage.getItem("user_info");
    
    if (userInfo) {
      const user = JSON.parse(userInfo);
      const maBacSi = user.MaBacSi; 
      
      setDoctorId(maBacSi);
      
      axios
        .get(`http://localhost:5000/api/bac-si/stats/${maBacSi}`)
        .then((res) => setStats(res.data))
        .catch((err) => console.error("Lỗi khi tải thống kê:", err));

      axios
        .get(`http://localhost:5000/api/bac-si/appointments/chart/${maBacSi}`)
        .then((res) => setChartData(res.data))
        .catch((err) => console.error("Lỗi khi tải biểu đồ:", err));

      axios
        .get(`http://localhost:5000/api/bac-si/appointments/today/${maBacSi}`)
        .then((res) => setTodayAppointments(res.data))
        .catch((err) => console.error("Lỗi khi tải lịch hẹn hôm nay:", err));

      axios
        .get(`http://localhost:5000/api/bac-si/appointments/upcoming/${maBacSi}`)
        .then((res) => setUpcomingAppointments(res.data))
        .catch((err) => console.error("Lỗi khi tải lịch hẹn sắp tới:", err));

      axios
        .get(`http://localhost:5000/api/bac-si/appointments/status/${maBacSi}`)
        .then((res) => setAppointmentsByStatus(res.data))
        .catch((err) => console.error("Lỗi khi tải thống kê trạng thái:", err));
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Chờ xác nhận": return "text-yellow-600 bg-yellow-50";
      case "Đã xác nhận": return "text-blue-600 bg-blue-50";
      case "Đang khám": return "text-green-600 bg-green-50";
      case "Hoàn thành": return "text-gray-600 bg-gray-50";
      case "Đã hủy": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <>
      <title>Bác Sĩ - Dashboard</title>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Dashboard Bác Sĩ</h1>

        {/* --- Thống kê tổng quan --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Lịch hẹn hôm nay</CardTitle>
              <CalendarDays className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.lichHenHomNay}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Lịch hẹn tuần này</CardTitle>
              <Clock className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.lichHenTuanNay}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Lượt khám tháng này</CardTitle>
              <ClipboardList className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.soLuotKhamThang}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tổng lượt khám</CardTitle>
              <CheckCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.tongSoLuotKham}</div>
            </CardContent>
          </Card>
        </div>


        <Tabs defaultValue="today" className=" w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-md mb-4">
            <TabsTrigger value="today">Hôm nay</TabsTrigger>
            <TabsTrigger value="upcoming">Sắp tới</TabsTrigger>
            <TabsTrigger value="stats">Thống kê</TabsTrigger>
          </TabsList>


          <TabsContent value="today">
            <Card>
              <CardHeader>
                <CardTitle>Lịch hẹn hôm nay ({todayAppointments.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="p-3 text-left font-semibold">Giờ</th>
                        <th className="p-3 text-left font-semibold">Khách hàng</th>
                        <th className="p-3 text-left font-semibold">SĐT</th>
                        <th className="p-3 text-left font-semibold">Dịch vụ</th>
                        <th className="p-3 text-left font-semibold">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {todayAppointments.length > 0 ? (
                        todayAppointments.map((appointment: any) => (
                          <tr key={appointment.MaLichHen} className="border-b hover:bg-gray-50 transition-colors">
                            <td className="p-3 font-bold text-blue-600">{appointment.GioHen}</td>
                            <td className="p-3 font-medium">{appointment.TenKhachHang}</td>
                            <td className="p-3">{appointment.SoDienThoai}</td>
                            <td className="p-3">{appointment.TenDichVu || "Khám tổng quát"}</td>
                            <td className="p-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.TinhTrang)}`}>
                                {appointment.TinhTrang}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="p-3 text-gray-500 text-center" colSpan={5}>
                            Không có lịch hẹn nào hôm nay
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upcoming">
            <Card>
              <CardHeader>
                <CardTitle>Lịch hẹn 7 ngày tới</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="p-2 text-left">Ngày</th>
                        <th className="p-2 text-left">Giờ</th>
                        <th className="p-2 text-left">Khách hàng</th>
                        <th className="p-2 text-left">SĐT</th>
                        <th className="p-2 text-left">Dịch vụ</th>
                        <th className="p-2 text-left">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {upcomingAppointments.length > 0 ? (
                        upcomingAppointments.map((appointment: any) => (
                          <tr key={appointment.MaLichHen} className="border-b hover:bg-gray-50">
                            <td className="p-2">{new Date(appointment.NgayHen).toLocaleDateString("vi-VN")}</td>
                            <td className="p-2 font-semibold">{appointment.GioHen}</td>
                            <td className="p-2">{appointment.TenKhachHang}</td>
                            <td className="p-2">{appointment.SoDienThoai}</td>
                            <td className="p-2">{appointment.TenDichVu || "Khám tổng quát"}</td>
                            <td className="p-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(appointment.TinhTrang)}`}>
                                {appointment.TinhTrang}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="p-2 text-gray-500 text-center" colSpan={6}>
                            Không có lịch hẹn sắp tới
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
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
                        label
                      >
                        {appointmentsByStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
