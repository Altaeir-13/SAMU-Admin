import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dataStore } from '@/lib/dataStore';
import { ApiResponse, Vehicle } from '@/types';

// GET /api/fleet - Get all vehicles
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    let vehicles = dataStore.getVehicles();

    // Apply filters
    if (status) {
      vehicles = vehicles.filter((v) => v.status === status);
    }
    if (type) {
      vehicles = vehicles.filter((v) => v.type === type);
    }

    return NextResponse.json<ApiResponse<Vehicle[]>>({
      success: true,
      data: vehicles,
    });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST /api/fleet - Create a new vehicle
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = ['plate', 'model', 'type', 'status', 'mileage'];
    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: `Campo obrigatório: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate type
    const validTypes = ['USB', 'USA', 'Motolância'];
    if (!validTypes.includes(body.type)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Tipo de veículo inválido' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['available', 'in_use', 'maintenance', 'inactive'];
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Status inválido' },
        { status: 400 }
      );
    }

    const newVehicle = dataStore.createVehicle({
      plate: body.plate,
      model: body.model,
      type: body.type,
      status: body.status,
      lastMaintenance: body.lastMaintenance,
      mileage: body.mileage,
    });

    return NextResponse.json<ApiResponse<Vehicle>>(
      { success: true, data: newVehicle, message: 'Veículo cadastrado com sucesso' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating vehicle:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
