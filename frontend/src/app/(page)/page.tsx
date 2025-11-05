import Image from "next/image";
import Navbar from "@/components/features/navigation";
import { TitleProvider } from "@/components/features/TitleContext";
import Footer from "@/components/features/footer";
import BannerCard from "@/components/features/banner";
export default function Home() {
  return (
    <main>
      <TitleProvider>
        <Navbar />
        <BannerCard />
      </TitleProvider>
      <Footer />
    </main>
  );
}
