import { Header } from "@/components/features/header";
import { TitleProvider } from "@/components/features/TitleContext";

import Footer from "@/components/features/footer";
import BookingForm from "@/components/features/booking";
export default function Home() {
  return (
    <main>
      <TitleProvider>
        <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Breadcrumb */}
            <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
              <a href="/" className="hover:text-blue-600">Trang chủ</a>
              <span>{'>'}</span>
              <span className="text-gray-900">Đặt Lịch</span>
            </div>
          <div className="container mx-auto px-2 py-6">
            <div className="max-w-5xl mx-auto">
              <BookingForm />
            </div>
          </div>
        </div>
        <Footer />
      </TitleProvider>
    </main>
  );
}
