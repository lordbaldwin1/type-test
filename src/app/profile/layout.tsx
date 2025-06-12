import Navbar from "~/components/navbar";
import Footer from "~/components/footer";
export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-auto">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
