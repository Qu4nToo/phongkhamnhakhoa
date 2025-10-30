import Image from "next/image";
import Navbar from "@/components/features/navigation";
import {TitleProvider} from "@/components/features/TitleContext";
import Footer from "@/components/features/footer";
export default function Home() {
  return (
    <main>
      <TitleProvider>
        <Navbar />
      </TitleProvider>
      <Footer />
    </main>
  );
}
