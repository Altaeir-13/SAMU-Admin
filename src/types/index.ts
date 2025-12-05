export interface Shift {
  id: string;
  employeeName: string;
  role: 'Médico' | 'Enfermeiro' | 'Técnico' | 'Condutor';
  date: string;
  startTime: string;
  endTime: string;
  vehicleId?: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  type: 'USB' | 'USA' | 'Motolância';
  status: 'available' | 'in_use' | 'maintenance' | 'inactive';
  lastMaintenance?: string;
  mileage: number;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Medicamento' | 'Equipamento' | 'Material' | 'Insumo';
  quantity: number;
  minQuantity: number;
  unit: string;
  expirationDate?: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
