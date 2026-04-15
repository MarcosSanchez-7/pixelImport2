import AdminShell from "@/components/admin/AdminShell";
import CategoriesManager from "@/components/admin/CategoriesManager";

export const metadata = { title: "Categories — Admin" };

export default function CategoriesPage() {
  return (
    <AdminShell>
      <CategoriesManager />
    </AdminShell>
  );
}
