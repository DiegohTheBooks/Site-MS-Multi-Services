import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Check, AlertCircle, Eye, EyeOff, Star } from 'lucide-react';
import { Product, Category } from '../../types';
import { api } from '../../services/api';

interface AdminProductsProps {
  products: Product[];
  categories: Category[];
  onRefresh: () => void;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({
  products,
  categories,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Form fields
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [promoPrice, setPromoPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [minStockAlert, setMinStockAlert] = useState('3');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [active, setActive] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [specsText, setSpecsText] = useState('');

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const openNewModal = () => {
    setEditingProduct(null);
    setName('');
    setSku(`MS-PROD-${Math.floor(100 + Math.random() * 900)}`);
    setCategoryId(categories[0]?.id || '');
    setPrice('');
    setPromoPrice('');
    setStock('10');
    setMinStockAlert('3');
    setDescription('');
    setImageUrl('/src/assets/images/ms_hero_tech_banner_1791603825951.jpg');
    setActive(true);
    setFeatured(false);
    setSpecsText('Garantia: 12 meses MS Multi Services\nOrigem: Homologado');
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setSku(p.sku);
    setCategoryId(p.categoryId);
    setPrice(p.price.toString());
    setPromoPrice(p.promoPrice ? p.promoPrice.toString() : '');
    setStock(p.stock.toString());
    setMinStockAlert(p.minStockAlert.toString());
    setDescription(p.description);
    setImageUrl(p.images[0] || '');
    setActive(p.active);
    setFeatured(p.featured);

    const specsFormatted = p.specifications 
      ? Object.entries(p.specifications).map(([k, v]) => `${k}: ${v}`).join('\n')
      : '';
    setSpecsText(specsFormatted);

    setErrorMsg(null);
    setSuccessMsg(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);

    try {
      // Parse specs
      const specifications: Record<string, string> = {};
      specsText.split('\n').forEach(line => {
        const parts = line.split(':');
        if (parts.length >= 2) {
          specifications[parts[0].trim()] = parts.slice(1).join(':').trim();
        }
      });

      const payload = {
        name,
        sku,
        categoryId,
        price: parseFloat(price),
        promoPrice: promoPrice ? parseFloat(promoPrice) : null,
        stock: parseInt(stock),
        minStockAlert: parseInt(minStockAlert),
        description,
        images: [imageUrl],
        specifications,
        active,
        featured
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct.id, payload);
        setSuccessMsg('Produto atualizado com sucesso!');
      } else {
        await api.createProduct(payload);
        setSuccessMsg('Produto criado com sucesso!');
      }

      setTimeout(() => {
        setIsModalOpen(false);
        onRefresh();
      }, 700);
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao salvar produto.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Deseja realmente excluir ou desativar o produto "${name}"?`)) return;

    try {
      const res = await api.deleteProduct(id);
      alert(res.message);
      onRefresh();
    } catch (err: any) {
      alert(`Erro: ${err.message}`);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'all' || p.categoryId === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      
      {/* Top action strip */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome ou SKU..."
              className="w-full bg-[#161616] border border-neutral-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#D8AE35]"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#161616] border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-300 focus:outline-none focus:border-[#D8AE35]"
          >
            <option value="all">Todas as Categorias</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <button
          onClick={openNewModal}
          className="px-4 py-2 bg-[#D8AE35] hover:bg-[#e4be4a] text-black font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Produto</span>
        </button>
      </div>

      {/* Table */}
      <div className="border border-neutral-800 rounded-xl bg-[#141414] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#181818] text-neutral-400 uppercase text-[11px] font-semibold border-b border-neutral-800">
              <tr>
                <th className="p-3.5">Produto</th>
                <th className="p-3.5">SKU</th>
                <th className="p-3.5">Categoria</th>
                <th className="p-3.5">Preço Venda</th>
                <th className="p-3.5">Estoque</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80">
              {filteredProducts.map((p) => {
                const cat = categories.find(c => c.id === p.categoryId);
                return (
                  <tr key={p.id} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="p-3.5 flex items-center gap-3">
                      <img 
                        src={p.images[0]} 
                        alt="" 
                        className="w-10 h-10 object-cover rounded-md border border-neutral-800 shrink-0" 
                      />
                      <div className="min-w-0">
                        <span className="font-semibold text-white block truncate max-w-xs">{p.name}</span>
                        {p.featured && (
                          <span className="text-[10px] text-[#D8AE35] font-bold flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" /> Destaque
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5 font-mono text-neutral-300">{p.sku}</td>
                    <td className="p-3.5 text-neutral-400">{cat?.name || 'Geral'}</td>
                    <td className="p-3.5">
                      <div className="font-mono font-bold text-white">
                        R$ {(p.promoPrice || p.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                      {p.promoPrice && (
                        <div className="text-[10px] text-neutral-500 line-through font-mono">
                          R$ {p.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                        p.stock === 0
                          ? 'bg-red-950 text-red-400 border border-red-800'
                          : p.stock <= p.minStockAlert
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-neutral-800 text-neutral-200'
                      }`}>
                        {p.stock} un.
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        p.active ? 'text-emerald-400 bg-emerald-950/40' : 'text-neutral-500 bg-neutral-900'
                      }`}>
                        {p.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1.5">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-[#D8AE35] hover:text-black text-neutral-300 transition-colors cursor-pointer"
                        title="Editar produto"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-[#ED1027] hover:text-white text-neutral-300 transition-colors cursor-pointer"
                        title="Excluir ou arquivar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
          <div className="relative w-full max-w-2xl bg-[#141414] border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-5 my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-base font-bold text-white">
                {editingProduct ? 'Editar Produto' : 'Cadastrar Novo Produto'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white text-sm cursor-pointer"
              >
                Cancelar
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-neutral-300 font-medium mb-1">Nome do Produto *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Fone Bluetooth MS Pro"
                    className="w-full bg-[#181818] border border-neutral-700 rounded-lg p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Código / SKU *</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="MS-XXX-001"
                    className="w-full bg-[#181818] border border-neutral-700 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Categoria *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-[#181818] border border-neutral-700 rounded-lg p-2.5 text-white"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Preço Normal (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-[#181818] border border-neutral-700 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Preço Promocional (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={promoPrice}
                    onChange={(e) => setPromoPrice(e.target.value)}
                    placeholder="Opcional"
                    className="w-full bg-[#181818] border border-neutral-700 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Estoque Inicial / Atual</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full bg-[#181818] border border-neutral-700 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Alerta de Estoque Mínimo</label>
                  <input
                    type="number"
                    required
                    value={minStockAlert}
                    onChange={(e) => setMinStockAlert(e.target.value)}
                    className="w-full bg-[#181818] border border-neutral-700 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">URL da Fotografia / Imagem Principal</label>
                <input
                  type="text"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="/src/assets/images/... ou https://..."
                  className="w-full bg-[#181818] border border-neutral-700 rounded-lg p-2.5 text-white font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">Descrição Comercial</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva detalhes, garantia, funcionalidades..."
                  className="w-full bg-[#181818] border border-neutral-700 rounded-lg p-2.5 text-white leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">Especificações Técnicas (uma por linha - Formato: Chave: Valor)</label>
                <textarea
                  rows={3}
                  value={specsText}
                  onChange={(e) => setSpecsText(e.target.value)}
                  placeholder={"Conexão: Bluetooth 5.3\nAutonomia: 40 horas\nGarantia: 12 meses"}
                  className="w-full bg-[#181818] border border-neutral-700 rounded-lg p-2.5 text-white font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="accent-[#D8AE35] w-4 h-4"
                  />
                  <span>Produto Ativo para Venda</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="accent-[#D8AE35] w-4 h-4"
                  />
                  <span>Exibir em Destaque na Página Inicial</span>
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
                  disabled={saving}
                  className="px-5 py-2 bg-[#D8AE35] hover:bg-[#e4be4a] text-black font-bold rounded-lg cursor-pointer transition-colors"
                >
                  {saving ? 'Gravando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
