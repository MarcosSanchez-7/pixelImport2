import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin Panel | PIXELL IMPORT",
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-zinc-900 flex">
      <AdminSidebar />
      <div className="flex-1 ml-60 min-h-screen flex flex-col">{children}</div>
    </div>
  );
}
