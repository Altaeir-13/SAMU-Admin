import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dataStore } from '@/lib/dataStore';
import { ApiResponse, Shift } from '@/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/shifts/[id] - Get a specific shift
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
    const shift = dataStore.getShift(id);

    if (!shift) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Escala não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<Shift>>({
      success: true,
      data: shift,
    });
  } catch (error) {
    console.error('Error fetching shift:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT /api/shifts/[id] - Update a shift
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

    // Validate role if provided
    if (body.role) {
      const validRoles = ['Médico', 'Enfermeiro', 'Técnico', 'Condutor'];
      if (!validRoles.includes(body.role)) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: 'Função inválida' },
          { status: 400 }
        );
      }
    }

    // Validate status if provided
    if (body.status) {
      const validStatuses = ['scheduled', 'active', 'completed', 'cancelled'];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: 'Status inválido' },
          { status: 400 }
        );
      }
    }

    const updatedShift = dataStore.updateShift(id, body);

    if (!updatedShift) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Escala não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<Shift>>({
      success: true,
      data: updatedShift,
      message: 'Escala atualizada com sucesso',
    });
  } catch (error) {
    console.error('Error updating shift:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE /api/shifts/[id] - Delete a shift
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
    const deleted = dataStore.deleteShift(id);

    if (!deleted) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Escala não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<null>>({
      success: true,
      message: 'Escala excluída com sucesso',
    });
  } catch (error) {
    console.error('Error deleting shift:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
