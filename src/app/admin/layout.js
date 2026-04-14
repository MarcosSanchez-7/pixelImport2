import AdminShell from "@/components/admin/AdminShell";

export const metadata = {
  title: "Admin Panel | PIXELL IMPORT",
};

export default function AdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}
