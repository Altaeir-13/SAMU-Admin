'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { Vehicle } from '@/types';

type VehicleType = 'USB' | 'USA' | 'Motolância';
type VehicleStatus = 'available' | 'in_use' | 'maintenance' | 'inactive';

interface FormData {
  plate: string;
  model: string;
  type: VehicleType;
  status: VehicleStatus;
  lastMaintenance: string;
  mileage: number;
}

export default function FleetPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState<FormData>({
    plate: '',
    model: '',
    type: 'USB',
    status: 'available',
    lastMaintenance: '',
    mileage: 0,
  });

  const fetchVehicles = async () => {
    try {
      const res = await fetch('/api/fleet');
      const data = await res.json();
      if (data.success) {
        setVehicles(data.data);
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingVehicle ? `/api/fleet/${editingVehicle.id}` : '/api/fleet';
      const method = editingVehicle ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        fetchVehicles();
        closeModal();
      } else {
        alert(data.error || 'Erro ao salvar veículo');
      }
    } catch (error) {
      console.error('Error saving vehicle:', error);
      alert('Erro ao salvar veículo');
    }
  };

  const handleDelete = async (vehicle: Vehicle) => {
    if (!confirm('Deseja realmente excluir este veículo?')) return;

    try {
      const res = await fetch(`/api/fleet/${vehicle.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchVehicles();
      } else {
        alert(data.error || 'Erro ao excluir veículo');
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      alert('Erro ao excluir veículo');
    }
  };

  const openModal = (vehicle?: Vehicle) => {
    if (vehicle) {
      setEditingVehicle(vehicle);
      setFormData({
        plate: vehicle.plate,
        model: vehicle.model,
        type: vehicle.type,
        status: vehicle.status,
        lastMaintenance: vehicle.lastMaintenance || '',
        mileage: vehicle.mileage,
      });
    } else {
      setEditingVehicle(null);
      setFormData({
        plate: '',
        model: '',
        type: 'USB',
        status: 'available',
        lastMaintenance: '',
        mileage: 0,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingVehicle(null);
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
          <h1 className="text-3xl font-bold text-gray-800">Frotas</h1>
          <p className="text-gray-600 mt-1">Gerenciamento de veículos da frota</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          + Novo Veículo
        </button>
      </div>

      <DataTable
        data={vehicles}
        columns={[
          { key: 'plate', header: 'Placa' },
          { key: 'model', header: 'Modelo' },
          {
            key: 'type',
            header: 'Tipo',
            render: (v) => {
              const typeLabels: Record<string, string> = {
                USB: 'USB (Básica)',
                USA: 'USA (Avançada)',
                Motolância: 'Motolância',
              };
              return typeLabels[v.type] || v.type;
            },
          },
          {
            key: 'status',
            header: 'Status',
            render: (v) => {
              const statusMap: Record<string, { label: string; class: string }> = {
                available: { label: 'Disponível', class: 'bg-green-100 text-green-800' },
                in_use: { label: 'Em uso', class: 'bg-blue-100 text-blue-800' },
                maintenance: { label: 'Manutenção', class: 'bg-yellow-100 text-yellow-800' },
                inactive: { label: 'Inativo', class: 'bg-gray-100 text-gray-800' },
              };
              const status = statusMap[v.status] || { label: v.status, class: '' };
              return (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.class}`}>
                  {status.label}
                </span>
              );
            },
          },
          {
            key: 'mileage',
            header: 'Quilometragem',
            render: (v) => `${v.mileage.toLocaleString()} km`,
          },
          { key: 'lastMaintenance', header: 'Última Manutenção' },
        ]}
        onEdit={openModal}
        onDelete={handleDelete}
      />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              {editingVehicle ? 'Editar Veículo' : 'Novo Veículo'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Placa</label>
                <input
                  type="text"
                  value={formData.plate}
                  onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as VehicleType })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
                >
                  <option value="USB">USB (Básica)</option>
                  <option value="USA">USA (Avançada)</option>
                  <option value="Motolância">Motolância</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as VehicleStatus })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
                >
                  <option value="available">Disponível</option>
                  <option value="in_use">Em uso</option>
                  <option value="maintenance">Manutenção</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quilometragem
                </label>
                <input
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Última Manutenção
                </label>
                <input
                  type="date"
                  value={formData.lastMaintenance}
                  onChange={(e) => setFormData({ ...formData, lastMaintenance: e.target.value })}
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
