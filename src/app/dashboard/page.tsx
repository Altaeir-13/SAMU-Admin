'use client';

import { useEffect, useState } from 'react';
import { StatCard } from '@/components/StatCard';
import { DashboardBarChart, DashboardPieChart } from '@/components/Charts';
import { DataTable } from '@/components/DataTable';
import { Shift, Vehicle, InventoryItem } from '@/types';

export default function DashboardPage() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [shiftsRes, vehiclesRes, inventoryRes] = await Promise.all([
          fetch('/api/shifts'),
          fetch('/api/fleet'),
          fetch('/api/inventory'),
        ]);

        const shiftsData = await shiftsRes.json();
        const vehiclesData = await vehiclesRes.json();
        const inventoryData = await inventoryRes.json();

        if (shiftsData.success) setShifts(shiftsData.data);
        if (vehiclesData.success) setVehicles(vehiclesData.data);
        if (inventoryData.success) setInventory(inventoryData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate statistics
  const activeShifts = shifts.filter((s) => s.status === 'active').length;
  const availableVehicles = vehicles.filter((v) => v.status === 'available').length;
  const lowStockItems = inventory.filter((i) => i.quantity < i.minQuantity).length;
  const totalEmployees = new Set(shifts.map((s) => s.employeeName)).size;

  // Prepare chart data
  const shiftsByRole = [
    { name: 'Médicos', value: shifts.filter((s) => s.role === 'Médico').length },
    { name: 'Enfermeiros', value: shifts.filter((s) => s.role === 'Enfermeiro').length },
    { name: 'Técnicos', value: shifts.filter((s) => s.role === 'Técnico').length },
    { name: 'Condutores', value: shifts.filter((s) => s.role === 'Condutor').length },
  ];

  const vehiclesByStatus = [
    { name: 'Disponível', value: vehicles.filter((v) => v.status === 'available').length },
    { name: 'Em uso', value: vehicles.filter((v) => v.status === 'in_use').length },
    { name: 'Manutenção', value: vehicles.filter((v) => v.status === 'maintenance').length },
    { name: 'Inativo', value: vehicles.filter((v) => v.status === 'inactive').length },
  ];

  const inventoryByCategory = [
    { name: 'Medicamentos', value: inventory.filter((i) => i.category === 'Medicamento').length },
    { name: 'Equipamentos', value: inventory.filter((i) => i.category === 'Equipamento').length },
    { name: 'Materiais', value: inventory.filter((i) => i.category === 'Material').length },
    { name: 'Insumos', value: inventory.filter((i) => i.category === 'Insumo').length },
  ];

  // Recent shifts for table
  const recentShifts = shifts.slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">Visão geral do sistema SAMU</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Escalas Ativas"
          value={activeShifts}
          icon="📅"
          color="red"
        />
        <StatCard
          title="Veículos Disponíveis"
          value={availableVehicles}
          icon="🚑"
          color="green"
        />
        <StatCard
          title="Itens em Baixa"
          value={lowStockItems}
          icon="⚠️"
          color="yellow"
        />
        <StatCard
          title="Profissionais"
          value={totalEmployees}
          icon="👥"
          color="blue"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardBarChart
          title="Escalas por Função"
          data={shiftsByRole}
          color="#ef4444"
        />
        <DashboardPieChart
          title="Status da Frota"
          data={vehiclesByStatus}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardPieChart
          title="Estoque por Categoria"
          data={inventoryByCategory}
        />
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Alertas de Estoque</h3>
          {lowStockItems === 0 ? (
            <p className="text-green-600 flex items-center gap-2">
              <span>✅</span> Todos os itens estão com estoque adequado
            </p>
          ) : (
            <ul className="space-y-3">
              {inventory
                .filter((i) => i.quantity < i.minQuantity)
                .map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.quantity} {item.unit} (mín: {item.minQuantity})
                      </p>
                    </div>
                    <span className="text-yellow-600 font-semibold">⚠️ Baixo</span>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>

      {/* Recent Shifts Table */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Escalas Recentes</h2>
        <DataTable
          data={recentShifts}
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
        />
      </div>
    </div>
  );
}
