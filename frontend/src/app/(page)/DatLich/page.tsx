import Navbar from "@/components/features/navigation";
import {TitleProvider} from "@/components/features/TitleContext";
import BookingForm from "@/components/features/booking";
import Footer from "@/components/features/footer";
export default function Home() {
  return (
    <main>
      <TitleProvider>
        <Navbar />
        <BookingForm />
        <Footer />
      </TitleProvider>
    </main>
  );
}
