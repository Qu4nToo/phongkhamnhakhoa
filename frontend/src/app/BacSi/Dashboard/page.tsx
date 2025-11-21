"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  CalendarDays,
  Stethoscope,
  ClipboardList,
} from "lucide-react";

export default function AdminHome() {
  const [stats, setStats] = useState({
    doctors: 0,
    customers: 0,
    appointments: 0,
    services: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);

  useEffect(() => {
    // Lấy thống kê tổng quan
    axios
      .get("http://localhost:5000/api/admin/stats")
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Lỗi khi tải thống kê:", err));

    // Lấy dữ liệu biểu đồ (7 ngày gần nhất)
    axios
      .get("http://localhost:5000/api/admin/appointments/chart")
      .then((res) => setChartData(res.data))
      .catch((err) => console.error("Lỗi khi tải biểu đồ:", err));

    // Lấy 5 lịch hẹn gần nhất
    axios
      .get("http://localhost:5000/api/admin/appointments/recent")
      .then((res) => setRecentAppointments(res.data))
      .catch((err) => console.error("Lỗi khi tải lịch hẹn gần đây:", err));
  }, []);

  return (
    <>
      <title>Bác Sĩ - Nha khoa Hoàng Quân</title>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Trang Quản Trị</h1>

      {/* --- Thống kê tổng quan --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg">Bác sĩ</CardTitle>
            <Stethoscope className="text-blue-500" />
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {stats.doctors}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg">Khách hàng</CardTitle>
            <Users className="text-green-500" />
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {stats.customers}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg">Lịch hẹn</CardTitle>
            <CalendarDays className="text-purple-500" />
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {stats.appointments}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg">Dịch vụ</CardTitle>
            <ClipboardList className="text-orange-500" />
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {stats.services}
          </CardContent>
        </Card>
      </div>

      {/* --- Biểu đồ lịch hẹn --- */}
      <Card>
        <CardHeader>
          <CardTitle>Biểu đồ lịch hẹn theo ngày</CardTitle>
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

      {/* --- Danh sách lịch hẹn mới --- */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch hẹn gần nhất</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
      </div>
    </>
  );
}
