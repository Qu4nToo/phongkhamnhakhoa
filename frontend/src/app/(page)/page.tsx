import { TitleProvider } from "@/components/features/TitleContext";
import Footer from "@/components/features/footer";
import { Header } from "@/components/features/hearder";
import { Hero } from "@/components/features/hero";
import { About } from "@/components/features/about";
import { Services } from "@/components/features/service";
import { Contact } from "@/components/features/contact";
export default function Home() {
  return (
    <main>
      <TitleProvider>
        <Header />
        <Hero />
        <Services />
        <About />
        <Contact />
      </TitleProvider>
      <Footer />
    </main>
  );
}
