import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dataStore } from '@/lib/dataStore';
import { ApiResponse, Vehicle } from '@/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/fleet/[id] - Get a specific vehicle
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const vehicle = dataStore.getVehicle(id);

    if (!vehicle) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Veículo não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<Vehicle>>({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT /api/fleet/[id] - Update a vehicle
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Validate type if provided
    if (body.type) {
      const validTypes = ['USB', 'USA', 'Motocicleta'];
      if (!validTypes.includes(body.type)) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: 'Tipo de veículo inválido' },
          { status: 400 }
        );
      }
    }

    // Validate status if provided
    if (body.status) {
      const validStatuses = ['available', 'in_use', 'maintenance', 'inactive'];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: 'Status inválido' },
          { status: 400 }
        );
      }
    }

    const updatedVehicle = dataStore.updateVehicle(id, body);

    if (!updatedVehicle) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Veículo não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<Vehicle>>({
      success: true,
      data: updatedVehicle,
      message: 'Veículo atualizado com sucesso',
    });
  } catch (error) {
    console.error('Error updating vehicle:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE /api/fleet/[id] - Delete a vehicle
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const deleted = dataStore.deleteVehicle(id);

    if (!deleted) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Veículo não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<null>>({
      success: true,
      message: 'Veículo excluído com sucesso',
    });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
