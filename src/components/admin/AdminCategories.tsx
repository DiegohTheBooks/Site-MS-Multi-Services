import React, { useState } from 'react';
import { Plus, Edit2, Trash2, FolderTree, AlertCircle } from 'lucide-react';
import { Category } from '../../types';
import { api } from '../../services/api';

interface AdminCategoriesProps {
  categories: Category[];
  onRefresh: () => void;
}

export const AdminCategories: React.FC<AdminCategoriesProps> = ({ categories, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const openNew = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setActive(true);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setActive(cat.active);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setSubmitting(true);
    setErrorMsg(null);

    try {
      if (editingCategory) {
        await api.updateCategory(editingCategory.id, { name, slug, description, active });
      } else {
        await api.createCategory({ name, slug, description, active });
      }
      setIsModalOpen(false);
      onRefresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao salvar categoria.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Deseja realmente remover a categoria "${catName}"?`)) return;

    try {
      const res = await api.deleteCategory(id);
      alert(res.message);
      onRefresh();
    } catch (err: any) {
      alert(`Atenção: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-[#D8AE35]" />
            Gerenciamento de Categorias ({categories.length})
          </h3>
          <p className="text-xs text-neutral-400">Organize os departamentos e seções do catálogo da loja</p>
        </div>

        <button
          onClick={openNew}
          className="px-4 py-2 bg-[#D8AE35] hover:bg-[#e4be4a] text-black font-bold text-xs rounded-lg transition-colors cursor-pointer"
        >
          Nova Categoria
        </button>
      </div>

      <div className="border border-neutral-800 rounded-xl bg-[#141414] overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#181818] text-neutral-400 uppercase text-[11px] font-semibold border-b border-neutral-800">
            <tr>
              <th className="p-3.5">Nome</th>
              <th className="p-3.5">Slug (URL)</th>
              <th className="p-3.5">Descrição</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/80">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-[#1a1a1a] transition-colors">
                <td className="p-3.5 font-bold text-white">{cat.name}</td>
                <td className="p-3.5 font-mono text-neutral-400">{cat.slug}</td>
                <td className="p-3.5 text-neutral-400 max-w-xs truncate">{cat.description || '-'}</td>
                <td className="p-3.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    cat.active ? 'text-emerald-400 bg-emerald-950/40' : 'text-neutral-500 bg-neutral-900'
                  }`}>
                    {cat.active ? 'Ativa' : 'Inativa'}
                  </span>
                </td>
                <td className="p-3.5 text-right space-x-1.5">
                  <button
                    onClick={() => openEdit(cat)}
                    className="p-1.5 rounded-lg bg-neutral-800 hover:bg-[#D8AE35] hover:text-black text-neutral-300 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-600 text-neutral-300 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#141414] border border-neutral-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">
              {editingCategory ? 'Editar Categoria' : 'Cadastrar Nova Categoria'}
            </h3>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-200 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-neutral-300 font-medium mb-1">Nome da Categoria *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingCategory) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'));
                    }
                  }}
                  placeholder="Ex: Wearables & Smartwatches"
                  className="w-full bg-[#181818] border border-neutral-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">Slug (Identificador URL)</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-[#181818] border border-neutral-700 rounded-lg p-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">Descrição</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descrição breve da categoria..."
                  className="w-full bg-[#181818] border border-neutral-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="catActive"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="accent-[#D8AE35] w-4 h-4 cursor-pointer"
                />
                <label htmlFor="catActive" className="text-neutral-300 cursor-pointer">
                  Categoria Visível no Catálogo
                </label>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#D8AE35] hover:bg-[#e4be4a] text-black font-bold rounded-lg cursor-pointer"
                >
                  {submitting ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
