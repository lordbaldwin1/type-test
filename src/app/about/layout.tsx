import Navbar from "~/components/navbar";
import Footer from "~/components/footer"; 

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="font-mono flex h-screen flex-col overflow-hidden">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}

