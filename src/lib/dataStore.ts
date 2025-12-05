import { Shift, Vehicle, InventoryItem } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// In-memory data store
// In production, this would be replaced with a proper database

class DataStore {
  private shifts: Map<string, Shift> = new Map();
  private vehicles: Map<string, Vehicle> = new Map();
  private inventory: Map<string, InventoryItem> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed shifts
    const sampleShifts: Shift[] = [
      {
        id: '1',
        employeeName: 'Dr. Carlos Silva',
        role: 'Médico',
        date: '2024-12-04',
        startTime: '07:00',
        endTime: '19:00',
        vehicleId: '1',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        employeeName: 'Enf. Maria Santos',
        role: 'Enfermeiro',
        date: '2024-12-04',
        startTime: '07:00',
        endTime: '19:00',
        vehicleId: '1',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        employeeName: 'Téc. João Oliveira',
        role: 'Técnico',
        date: '2024-12-04',
        startTime: '19:00',
        endTime: '07:00',
        vehicleId: '2',
        status: 'scheduled',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '4',
        employeeName: 'Pedro Costa',
        role: 'Condutor',
        date: '2024-12-04',
        startTime: '07:00',
        endTime: '19:00',
        vehicleId: '1',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '5',
        employeeName: 'Dr. Ana Ferreira',
        role: 'Médico',
        date: '2024-12-05',
        startTime: '07:00',
        endTime: '19:00',
        status: 'scheduled',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    sampleShifts.forEach((shift) => this.shifts.set(shift.id, shift));

    // Seed vehicles
    const sampleVehicles: Vehicle[] = [
      {
        id: '1',
        plate: 'SAMU-001',
        model: 'Mercedes Sprinter',
        type: 'USA',
        status: 'in_use',
        lastMaintenance: '2024-11-15',
        mileage: 45230,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        plate: 'SAMU-002',
        model: 'Fiat Ducato',
        type: 'USB',
        status: 'available',
        lastMaintenance: '2024-11-20',
        mileage: 32150,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        plate: 'SAMU-003',
        model: 'Honda CG 160',
        type: 'Motolância',
        status: 'available',
        lastMaintenance: '2024-11-25',
        mileage: 15420,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '4',
        plate: 'SAMU-004',
        model: 'Mercedes Sprinter',
        type: 'USA',
        status: 'maintenance',
        lastMaintenance: '2024-12-01',
        mileage: 67890,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '5',
        plate: 'SAMU-005',
        model: 'Fiat Ducato',
        type: 'USB',
        status: 'inactive',
        lastMaintenance: '2024-10-01',
        mileage: 98500,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    sampleVehicles.forEach((vehicle) => this.vehicles.set(vehicle.id, vehicle));

    // Seed inventory
    const sampleInventory: InventoryItem[] = [
      {
        id: '1',
        name: 'Adrenalina 1mg/ml',
        category: 'Medicamento',
        quantity: 50,
        minQuantity: 20,
        unit: 'ampolas',
        expirationDate: '2025-06-15',
        location: 'Almoxarifado Central',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Desfibrilador DEA',
        category: 'Equipamento',
        quantity: 8,
        minQuantity: 5,
        unit: 'unidades',
        location: 'Sala de Equipamentos',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Luvas Estéreis M',
        category: 'Material',
        quantity: 15,
        minQuantity: 50,
        unit: 'caixas',
        expirationDate: '2025-12-01',
        location: 'Almoxarifado Central',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '4',
        name: 'Soro Fisiológico 500ml',
        category: 'Insumo',
        quantity: 200,
        minQuantity: 100,
        unit: 'frascos',
        expirationDate: '2025-08-20',
        location: 'Almoxarifado Central',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '5',
        name: 'Atropina 0.5mg/ml',
        category: 'Medicamento',
        quantity: 30,
        minQuantity: 25,
        unit: 'ampolas',
        expirationDate: '2025-04-10',
        location: 'Almoxarifado Central',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '6',
        name: 'Monitor Cardíaco',
        category: 'Equipamento',
        quantity: 6,
        minQuantity: 4,
        unit: 'unidades',
        location: 'Sala de Equipamentos',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    sampleInventory.forEach((item) => this.inventory.set(item.id, item));
  }

  // Shifts CRUD
  getShifts(): Shift[] {
    return Array.from(this.shifts.values());
  }

  getShift(id: string): Shift | undefined {
    return this.shifts.get(id);
  }

  createShift(shift: Omit<Shift, 'id' | 'createdAt' | 'updatedAt'>): Shift {
    const id = uuidv4();
    const newShift: Shift = {
      ...shift,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.shifts.set(id, newShift);
    return newShift;
  }

  updateShift(id: string, updates: Partial<Shift>): Shift | undefined {
    const existing = this.shifts.get(id);
    if (!existing) return undefined;

    const updated: Shift = {
      ...existing,
      ...updates,
      id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };
    this.shifts.set(id, updated);
    return updated;
  }

  deleteShift(id: string): boolean {
    return this.shifts.delete(id);
  }

  // Vehicles CRUD
  getVehicles(): Vehicle[] {
    return Array.from(this.vehicles.values());
  }

  getVehicle(id: string): Vehicle | undefined {
    return this.vehicles.get(id);
  }

  createVehicle(vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Vehicle {
    const id = uuidv4();
    const newVehicle: Vehicle = {
      ...vehicle,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.vehicles.set(id, newVehicle);
    return newVehicle;
  }

  updateVehicle(id: string, updates: Partial<Vehicle>): Vehicle | undefined {
    const existing = this.vehicles.get(id);
    if (!existing) return undefined;

    const updated: Vehicle = {
      ...existing,
      ...updates,
      id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };
    this.vehicles.set(id, updated);
    return updated;
  }

  deleteVehicle(id: string): boolean {
    return this.vehicles.delete(id);
  }

  // Inventory CRUD
  getInventory(): InventoryItem[] {
    return Array.from(this.inventory.values());
  }

  getInventoryItem(id: string): InventoryItem | undefined {
    return this.inventory.get(id);
  }

  createInventoryItem(item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>): InventoryItem {
    const id = uuidv4();
    const newItem: InventoryItem = {
      ...item,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.inventory.set(id, newItem);
    return newItem;
  }

  updateInventoryItem(id: string, updates: Partial<InventoryItem>): InventoryItem | undefined {
    const existing = this.inventory.get(id);
    if (!existing) return undefined;

    const updated: InventoryItem = {
      ...existing,
      ...updates,
      id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };
    this.inventory.set(id, updated);
    return updated;
  }

  deleteInventoryItem(id: string): boolean {
    return this.inventory.delete(id);
  }
}

// Export singleton instance
export const dataStore = new DataStore();
