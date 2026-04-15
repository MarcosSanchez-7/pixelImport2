"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

const CategoriesContext = createContext(null);

// Build nested tree from flat array
function buildTree(flat, parentId = null) {
  return flat
    .filter((c) => c.parent_id === parentId)
    .sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name))
    .map((c) => ({ ...c, children: buildTree(flat, c.id) }));
}

// Flatten tree with depth info for indented selects
function flattenTree(nodes, depth = 0, result = []) {
  for (const node of nodes) {
    result.push({ ...node, depth });
    flattenTree(node.children, depth + 1, result);
  }
  return result;
}

export function CategoriesProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [initialized, setInitialized] = useState(false);

  const fetchCategories = useCallback(async () => {
    if (!supabase) { setInitialized(true); return; }
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error("Error loading categories:", err.message);
    } finally {
      setInitialized(true);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const addCategory = useCallback(async ({ name, parent_id = null, sort_order = 0 }) => {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from("categories")
      .insert([{ name, parent_id, sort_order }])
      .select()
      .single();
    if (error) { console.error("Error adding category:", error); return null; }
    setCategories((prev) => [...prev, data]);
    return data;
  }, []);

  const updateCategory = useCallback(async (id, updates) => {
    if (!supabase) return;
    const { error } = await supabase
      .from("categories")
      .update(updates)
      .eq("id", id);
    if (error) { console.error("Error updating category:", error); return; }
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  }, []);

  const deleteCategory = useCallback(async (id) => {
    if (!supabase) return;
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);
    if (error) { console.error("Error deleting category:", error); return; }
    // Also remove children (cascade handled by DB, update local state)
    setCategories((prev) => prev.filter((c) => c.id !== id && c.parent_id !== id));
  }, []);

  // Derived data
  const tree = buildTree(categories);
  const flatList = flattenTree(tree); // [{...category, depth, children}]

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        tree,
        flatList,
        initialized,
        addCategory,
        updateCategory,
        deleteCategory,
        refetch: fetchCategories,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const ctx = useContext(CategoriesContext);
  if (!ctx) throw new Error("useCategories must be used inside <CategoriesProvider>");
  return ctx;
}
