'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { Shift } from '@/types';

type ShiftRole = 'Médico' | 'Enfermeiro' | 'Técnico' | 'Condutor';
type ShiftStatus = 'scheduled' | 'active' | 'completed' | 'cancelled';

interface FormData {
  employeeName: string;
  role: ShiftRole;
  date: string;
  startTime: string;
  endTime: string;
  vehicleId: string;
  status: ShiftStatus;
}

export default function ShiftsPage() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [formData, setFormData] = useState<FormData>({
    employeeName: '',
    role: 'Médico',
    date: '',
    startTime: '',
    endTime: '',
    vehicleId: '',
    status: 'scheduled',
  });

  const fetchShifts = async () => {
    try {
      const res = await fetch('/api/shifts');
      const data = await res.json();
      if (data.success) {
        setShifts(data.data);
      }
    } catch (error) {
      console.error('Error fetching shifts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingShift ? `/api/shifts/${editingShift.id}` : '/api/shifts';
      const method = editingShift ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        fetchShifts();
        closeModal();
      } else {
        alert(data.error || 'Erro ao salvar escala');
      }
    } catch (error) {
      console.error('Error saving shift:', error);
      alert('Erro ao salvar escala');
    }
  };

  const handleDelete = async (shift: Shift) => {
    if (!confirm('Deseja realmente excluir esta escala?')) return;

    try {
      const res = await fetch(`/api/shifts/${shift.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchShifts();
      } else {
        alert(data.error || 'Erro ao excluir escala');
      }
    } catch (error) {
      console.error('Error deleting shift:', error);
      alert('Erro ao excluir escala');
    }
  };

  const openModal = (shift?: Shift) => {
    if (shift) {
      setEditingShift(shift);
      setFormData({
        employeeName: shift.employeeName,
        role: shift.role,
        date: shift.date,
        startTime: shift.startTime,
        endTime: shift.endTime,
        vehicleId: shift.vehicleId || '',
        status: shift.status,
      });
    } else {
      setEditingShift(null);
      setFormData({
        employeeName: '',
        role: 'Médico',
        date: '',
        startTime: '',
        endTime: '',
        vehicleId: '',
        status: 'scheduled',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingShift(null);
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
          <h1 className="text-3xl font-bold text-gray-800">Escalas</h1>
          <p className="text-gray-600 mt-1">Gerenciamento de escalas de profissionais</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          + Nova Escala
        </button>
      </div>

      <DataTable
        data={shifts}
        columns={[
          { key: 'employeeName', header: 'Profissional' },
          { key: 'role', header: 'Função' },
          { key: 'date', header: 'Data' },
          {
            key: 'time',
            header: 'Horário',
            render: (shift) => `${shift.startTime} - ${shift.endTime}`,
          },
          {
            key: 'status',
            header: 'Status',
            render: (shift) => {
              const statusMap: Record<string, { label: string; class: string }> = {
                scheduled: { label: 'Agendada', class: 'bg-blue-100 text-blue-800' },
                active: { label: 'Ativa', class: 'bg-green-100 text-green-800' },
                completed: { label: 'Concluída', class: 'bg-gray-100 text-gray-800' },
                cancelled: { label: 'Cancelada', class: 'bg-red-100 text-red-800' },
              };
              const status = statusMap[shift.status] || { label: shift.status, class: '' };
              return (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.class}`}>
                  {status.label}
                </span>
              );
            },
          },
        ]}
        onEdit={openModal}
        onDelete={handleDelete}
      />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              {editingShift ? 'Editar Escala' : 'Nova Escala'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profissional
                </label>
                <input
                  type="text"
                  value={formData.employeeName}
                  onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Função</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as ShiftRole })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
                >
                  <option value="Médico">Médico</option>
                  <option value="Enfermeiro">Enfermeiro</option>
                  <option value="Técnico">Técnico</option>
                  <option value="Condutor">Condutor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Início</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fim</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as ShiftStatus })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
                >
                  <option value="scheduled">Agendada</option>
                  <option value="active">Ativa</option>
                  <option value="completed">Concluída</option>
                  <option value="cancelled">Cancelada</option>
                </select>
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
