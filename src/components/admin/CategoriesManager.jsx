"use client";

import { useState } from "react";
import { useCategories } from "@/context/CategoriesContext";

const DEPTH_LABELS = ["Principal", "Categoría", "Sub-Categoría", "Detalle"];
const DEPTH_DOT_CLASS = ["bg-white", "bg-zinc-300", "bg-zinc-500", "bg-zinc-600"];

function CategoryNode({ node, onEdit, onDelete, onAddChild, depth = 0 }) {
  const [collapsed, setCollapsed] = useState(false);
  const hasChildren = node.children?.length > 0;

  return (
    <div>
      <div
        className="flex items-center gap-2 py-2.5 border-b border-zinc-800/60 hover:bg-zinc-800/30 transition-colors group pr-4"
        style={{ paddingLeft: `${16 + depth * 22}px` }}
      >
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className={`w-5 h-5 flex items-center justify-center text-zinc-600 hover:text-zinc-300 transition-colors shrink-0 ${!hasChildren ? "invisible" : ""}`}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
            {collapsed ? "chevron_right" : "expand_more"}
          </span>
        </button>

        {/* Depth dot */}
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${DEPTH_DOT_CLASS[Math.min(depth, 3)]}`} />

        {/* Name */}
        <span className="text-sm font-semibold text-white flex-1 truncate">{node.name}</span>

        {/* Level badge */}
        <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 shrink-0">
          {DEPTH_LABELS[Math.min(depth, 3)]}
        </span>

        {/* Actions — visible on hover */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          {depth < 3 && (
            <button
              onClick={() => onAddChild(node)}
              className="p-1.5 rounded text-zinc-500 hover:text-emerald-400 hover:bg-emerald-950 transition-all"
              title="Agregar sub-categoría"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>add</span>
            </button>
          )}
          <button
            onClick={() => onEdit(node)}
            className="p-1.5 rounded text-zinc-500 hover:text-white hover:bg-zinc-700 transition-all"
            title="Editar"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>edit</span>
          </button>
          <button
            onClick={() => onDelete(node)}
            className="p-1.5 rounded text-zinc-500 hover:text-red-400 hover:bg-red-950 transition-all"
            title="Eliminar"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>delete</span>
          </button>
        </div>
      </div>

      {/* Children */}
      {!collapsed && hasChildren && (
        <div>
          {node.children.map((child) => (
            <CategoryNode
              key={child.id}
              node={child}
              depth={depth + 1}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoriesManager() {
  const { tree, flatList, initialized, addCategory, updateCategory, deleteCategory } = useCategories();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState(null);
  const [parentNode, setParentNode] = useState(null);
  const [formName, setFormName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const openAdd = (parent = null) => {
    setEditingNode(null);
    setParentNode(parent);
    setFormName("");
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const openEdit = (node) => {
    setEditingNode(node);
    setParentNode(flatList.find((c) => c.id === node.parent_id) ?? null);
    setFormName(node.name);
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingNode(null);
    setParentNode(null);
    setFormName("");
    setErrorMsg("");
  };

  const handleSave = async () => {
    if (!formName.trim()) return;
    setIsSaving(true);
    setErrorMsg("");

    let result;
    if (editingNode) {
      await updateCategory(editingNode.id, { name: formName.trim() });
      result = true;
    } else {
      result = await addCategory({
        name: formName.trim(),
        parent_id: parentNode?.id ?? null,
        sort_order: 0,
      });
    }

    setIsSaving(false);

    if (result === null) {
      setErrorMsg("Error al guardar. Verificá que hayas ejecutado SETUP_DATABASE.sql en Supabase.");
      return;
    }
    closeModal();
  };

  const handleDelete = async (node) => {
    await deleteCategory(node.id);
    setDeleteTarget(null);
  };

  if (!initialized) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-zinc-900">

      {/* Header */}
      <div className="px-4 sm:px-8 py-5 sm:py-7 border-b border-zinc-800 flex items-center justify-between shrink-0">
        <div>
          <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold mb-1">Catálogo</p>
          <h1 className="text-white text-xl sm:text-2xl font-black tracking-tight">Categorías</h1>
        </div>
        <button
          onClick={() => openAdd(null)}
          className="flex items-center gap-2 bg-white text-black px-3 sm:px-5 py-2.5 text-xs font-black uppercase tracking-widest hover:bg-zinc-100 transition-colors active:scale-95 duration-150"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>add</span>
          <span className="hidden sm:inline">Nueva Categoría</span>
          <span className="sm:hidden">Nueva</span>
        </button>
      </div>

      {/* Legend */}
      <div className="px-4 sm:px-8 py-3 border-b border-zinc-800 flex items-center gap-4 shrink-0 flex-wrap gap-y-2">
        {DEPTH_LABELS.map((label, i) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${DEPTH_DOT_CLASS[i]}`} />
            <span className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest">{label}</span>
          </div>
        ))}
        <span className="ml-auto text-zinc-600 text-[10px] uppercase tracking-widest font-bold">
          {flatList.length} total
        </span>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto">
        {tree.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <span className="material-symbols-outlined text-zinc-700" style={{ fontSize: "48px" }}>
              account_tree
            </span>
            <p className="text-zinc-500 text-sm">Sin categorías aún</p>
            <p className="text-zinc-700 text-xs text-center max-w-xs px-4">
              Ejemplo: creá "Monitores" como principal, luego agrega "ACER", "BENQ" como sub-categorías.
            </p>
            <button
              onClick={() => openAdd(null)}
              className="text-white text-xs font-bold uppercase tracking-widest underline underline-offset-4 hover:no-underline"
            >
              Crear primera categoría
            </button>
          </div>
        ) : (
          tree.map((node) => (
            <CategoryNode
              key={node.id}
              node={node}
              depth={0}
              onEdit={openEdit}
              onDelete={(n) => setDeleteTarget(n)}
              onAddChild={(parent) => openAdd(parent)}
            />
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-700 rounded shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
              <div>
                <p className="text-zinc-500 text-[9px] uppercase tracking-widest font-bold mb-1">
                  {editingNode
                    ? "EDITANDO"
                    : parentNode
                    ? `DENTRO DE: ${parentNode.name}`
                    : "NIVEL PRINCIPAL"}
                </p>
                <h2 className="text-white text-base font-black tracking-tight">
                  {editingNode ? "Renombrar Categoría" : "Nueva Categoría"}
                </h2>
              </div>
              <button onClick={closeModal} className="p-2 rounded text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all">
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>close</span>
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Error */}
              {errorMsg && (
                <div className="bg-red-950 border border-red-800 text-red-400 px-4 py-3 rounded text-xs leading-relaxed">
                  {errorMsg}
                </div>
              )}

              {/* Parent selector */}
              {!editingNode && (
                <div>
                  <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block mb-2">
                    Categoría padre (opcional)
                  </label>
                  <select
                    value={parentNode?.id ?? ""}
                    onChange={(e) => {
                      const found = flatList.find((c) => c.id === e.target.value);
                      setParentNode(found ?? null);
                    }}
                    className="w-full bg-zinc-800 border border-zinc-700 text-white text-sm px-4 py-2.5 rounded outline-none focus:border-zinc-400 transition-colors"
                  >
                    <option value="">— Ninguna (Categoría principal) —</option>
                    {flatList
                      .filter((c) => c.depth < 3)
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {"  ".repeat(c.depth)}{c.depth > 0 ? "└ " : ""}{c.name}
                        </option>
                      ))}
                  </select>
                  <p className="text-zinc-600 text-[10px] mt-1.5">
                    {parentNode
                      ? `Se creará dentro de "${parentNode.name}"`
                      : "Se creará como categoría de nivel principal"}
                  </p>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block mb-2">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  autoFocus
                  placeholder={
                    !parentNode
                      ? "Ej: Monitores, Auriculares, Teclados..."
                      : "Ej: ACER, BENQ, 27 pulgadas, 144Hz..."
                  }
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white text-sm px-4 py-3 rounded outline-none focus:border-zinc-400 transition-colors placeholder-zinc-700"
                />
              </div>
            </div>

            <div className="px-6 py-5 border-t border-zinc-800 flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 py-3 text-xs font-black uppercase tracking-widest text-zinc-400 border border-zinc-700 rounded hover:bg-zinc-800 hover:text-white transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!formName.trim() || isSaving}
                className="flex-1 py-3 text-xs font-black uppercase tracking-widest bg-white text-black rounded hover:bg-zinc-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSaving
                  ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  : <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>{editingNode ? "save" : "add"}</span>
                }
                {editingNode ? "Guardar" : "Crear"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-700 rounded shadow-2xl p-6 space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-red-950 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-red-400" style={{ fontSize: "20px" }}>warning</span>
              </div>
              <div>
                <h2 className="text-white text-base font-black tracking-tight">
                  ¿Eliminar "{deleteTarget.name}"?
                </h2>
                <p className="text-zinc-500 text-xs mt-1 leading-relaxed">
                  También se eliminarán todas las sub-categorías. Los productos en esta categoría quedarán sin asignar.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-3 text-xs font-black uppercase tracking-widest text-zinc-400 border border-zinc-700 rounded hover:bg-zinc-800 hover:text-white transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteTarget)}
                className="flex-1 py-3 text-xs font-black uppercase tracking-widest bg-red-600 text-white rounded hover:bg-red-500 transition-all"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
