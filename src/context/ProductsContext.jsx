"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

// Whitelist of actual DB columns — strips UI-only fields (isBestSeller, etc.)
const DB_FIELDS = [
  "id", "title", "brand", "sku", "category", "category_id",
  "price", "sale_price", "stock", "badge", "description", "image", "images",
  "visible", "tags", "specs", "created_at",
];

function toDbProduct(product) {
  const db = {};
  for (const key of DB_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(product, key)) {
      db[key] = product[key];
    }
  }
  return db;
}

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [initialized, setInitialized] = useState(false);

  // Load from Supabase on mount
  useEffect(() => {
    async function fetchProducts() {
      if (!supabase) {
        console.warn("Supabase client not initialized. Skipping fetch.");
        setInitialized(true);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error("Error loading products from Supabase:", err.message);
      } finally {
        setInitialized(true);
      }
    }
    fetchProducts();
  }, []);

  const addProduct = useCallback(async (product) => {
    const newProduct = {
      ...product,
      id: product.id || `product-${Date.now()}`,
      visible: product.visible ?? true,
    };
    
    // Optimistic UI update
    setProducts((prev) => [newProduct, ...prev]);

    // DB Insert
    if (!supabase) {
      console.error("Supabase client not initialized");
      return newProduct;
    }
    const { error } = await supabase.from("products").insert([toDbProduct(newProduct)]);
    if (error) {
      console.error("Error adding product:", error.message, "| details:", error.details, "| hint:", error.hint);
      setProducts((prev) => prev.filter((p) => p.id !== newProduct.id));
      alert(`Error al guardar: ${error.message || JSON.stringify(error)}`);
    }
    return newProduct;
  }, []);

  const updateProduct = useCallback(async (id, updates) => {
    // Optimistic UI
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );

    // DB Update — strip UI-only fields and created_at
    const { created_at, ...safeUpdates } = toDbProduct(updates);
    if (!supabase) {
      console.error("Supabase client not initialized");
      return;
    }
    const { error } = await supabase.from("products").update(safeUpdates).eq("id", id);
    if (error) {
      console.error("Error updating product:", error.message, "| details:", error.details, "| hint:", error.hint);
      alert(`Error al guardar: ${error.message || JSON.stringify(error)}`);
    }
  }, []);

  const deleteProduct = useCallback(async (id) => {
    // Optimistic UI
    setProducts((prev) => prev.filter((p) => p.id !== id));

    // DB Delete
    if (!supabase) {
      console.error("Supabase client not initialized");
      return;
    }
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      console.error("Error deleting product:", error);
    }
  }, []);

  const toggleVisibility = useCallback(async (id) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    const newVisibility = !product.visible;

    // Optimistic UI
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, visible: newVisibility } : p))
    );

    // DB Update
    if (!supabase) {
      console.error("Supabase client not initialized");
      return;
    }
    const { error } = await supabase
      .from("products")
      .update({ visible: newVisibility })
      .eq("id", id);
      
    if (error) {
      console.error("Error toggling visibility:", error);
    }
  }, [products]);

  return (
    <ProductsContext.Provider
      value={{
        products,
        initialized,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleVisibility,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used inside <ProductsProvider>");
  return ctx;
}
