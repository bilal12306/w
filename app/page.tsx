import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClientSections from "@/components/ClientSections";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-void noise">
      <Navbar />
      <ClientSections />
      <Footer />
    </main>
  );
}
