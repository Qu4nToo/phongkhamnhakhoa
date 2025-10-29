import Navbar from "@/components/features/navigation";
import { TitleProvider } from "@/components/features/TitleContext";

import Footer from "@/components/features/footer";
import BookingForm from "@/components/features/booking";
export default function Home() {
  return (
    <main>
      <TitleProvider>
        <Navbar />
          <div className="container mx-auto px-2 py-6">
            <div className="max-w-5xl mx-auto">
              <BookingForm />
            </div>
          </div>
        <Footer />
      </TitleProvider>
    </main>
  );
}
