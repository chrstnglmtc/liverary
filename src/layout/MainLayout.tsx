import Navbar from "../components/Navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
