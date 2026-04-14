"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [initialized, setInitialized] = useState(false);

  // Load from Supabase on mount
  useEffect(() => {
    async function fetchProducts() {
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
    const { error } = await supabase.from("products").insert([newProduct]);
    if (error) {
      console.error("Error adding product:", error);
      // Rollback on fail
      setProducts((prev) => prev.filter((p) => p.id !== newProduct.id));
      alert("Error saving to database");
    }
    return newProduct;
  }, []);

  const updateProduct = useCallback(async (id, updates) => {
    // Optimistic UI
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );

    // DB Update (remove created_at if it's there to avoid changing it)
    const { created_at, ...safeUpdates } = updates;
    const { error } = await supabase.from("products").update(safeUpdates).eq("id", id);
    if (error) {
      console.error("Error updating product:", error);
    }
  }, []);

  const deleteProduct = useCallback(async (id) => {
    // Optimistic UI
    setProducts((prev) => prev.filter((p) => p.id !== id));

    // DB Delete
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
