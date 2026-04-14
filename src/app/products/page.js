import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductsCatalog from "@/components/ProductsCatalog";

export const metadata = {
  title: "Imports",
  description: "Browse our curated selection of precision-engineered technology imports.",
};

export default function ProductsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <ProductsCatalog />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
