import Footer from "~/components/footer";
import Navbar from "~/components/navbar";


export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono flex min-h-screen h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
