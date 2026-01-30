'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { InventoryItem } from '@/types';

type InventoryCategory = 'Medicamento' | 'Equipamento' | 'Material' | 'Insumo';

interface FormData {
  name: string;
  category: InventoryCategory;
  quantity: number;
  minQuantity: number;
  unit: string;
  expirationDate: string;
  location: string;
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    category: 'Medicamento',
    quantity: 0,
    minQuantity: 0,
    unit: '',
    expirationDate: '',
    location: '',
  });

  const fetchInventory = async () => {
    try {
      const res = await fetch('/api/inventory');
      const data = await res.json();
      if (data.success) {
        setInventory(data.data);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingItem ? `/api/inventory/${editingItem.id}` : '/api/inventory';
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        fetchInventory();
        closeModal();
      } else {
        alert(data.error || 'Erro ao salvar item');
      }
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Erro ao salvar item');
    }
  };

  const handleDelete = async (item: InventoryItem) => {
    if (!confirm('Deseja realmente excluir este item?')) return;

    try {
      const res = await fetch(`/api/inventory/${item.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchInventory();
      } else {
        alert(data.error || 'Erro ao excluir item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Erro ao excluir item');
    }
  };

  const openModal = (item?: InventoryItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        minQuantity: item.minQuantity,
        unit: item.unit,
        expirationDate: item.expirationDate || '',
        location: item.location,
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        category: 'Medicamento',
        quantity: 0,
        minQuantity: 0,
        unit: '',
        expirationDate: '',
        location: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Estoque</h1>
          <p className="text-gray-600 mt-1">Gerenciamento de estoque e inventário</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          + Novo Item
        </button>
      </div>

      {/* Low stock warning */}
      {inventory.filter((i) => i.quantity < i.minQuantity).length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-yellow-800">
            <span className="text-xl">⚠️</span>
            <span className="font-medium">
              {inventory.filter((i) => i.quantity < i.minQuantity).length} item(s) com estoque abaixo do mínimo
            </span>
          </div>
        </div>
      )}

      <DataTable
        data={inventory}
        columns={[
          { key: 'name', header: 'Nome' },
          {
            key: 'category',
            header: 'Categoria',
            render: (item) => {
              const categoryColors: Record<string, string> = {
                Medicamento: 'bg-purple-100 text-purple-800',
                Equipamento: 'bg-blue-100 text-blue-800',
                Material: 'bg-green-100 text-green-800',
                Insumo: 'bg-orange-100 text-orange-800',
              };
              return (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[item.category]}`}>
                  {item.category}
                </span>
              );
            },
          },
          {
            key: 'quantity',
            header: 'Quantidade',
            render: (item) => {
              const isLow = item.quantity < item.minQuantity;
              return (
                <span className={isLow ? 'text-red-600 font-semibold' : ''}>
                  {item.quantity} {item.unit}
                  {isLow && ' ⚠️'}
                </span>
              );
            },
          },
          {
            key: 'minQuantity',
            header: 'Mín.',
            render: (item) => `${item.minQuantity} ${item.unit}`,
          },
          { key: 'location', header: 'Localização' },
          { key: 'expirationDate', header: 'Validade' },
        ]}
        onEdit={openModal}
        onDelete={handleDelete}
      />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              {editingItem ? 'Editar Item' : 'Novo Item'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as InventoryCategory })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
                >
                  <option value="Medicamento">Medicamento</option>
                  <option value="Equipamento">Equipamento</option>
                  <option value="Material">Material</option>
                  <option value="Insumo">Insumo</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qtd. Mínima</label>
                  <input
                    type="number"
                    value={formData.minQuantity}
                    onChange={(e) => setFormData({ ...formData, minQuantity: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
                    min="0"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unidade</label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
                  placeholder="Ex: unidades, caixas, ampolas"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Localização</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
                  placeholder="Ex: Almoxarifado Central"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Validade (opcional)
                </label>
                <input
                  type="date"
                  value={formData.expirationDate}
                  onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
