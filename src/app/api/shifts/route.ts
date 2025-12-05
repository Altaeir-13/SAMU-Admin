import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dataStore } from '@/lib/dataStore';
import { ApiResponse, Shift } from '@/types';

// GET /api/shifts - Get all shifts
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
    const date = searchParams.get('date');
    const role = searchParams.get('role');

    let shifts = dataStore.getShifts();

    // Apply filters
    if (status) {
      shifts = shifts.filter((s) => s.status === status);
    }
    if (date) {
      shifts = shifts.filter((s) => s.date === date);
    }
    if (role) {
      shifts = shifts.filter((s) => s.role === role);
    }

    return NextResponse.json<ApiResponse<Shift[]>>({
      success: true,
      data: shifts,
    });
  } catch (error) {
    console.error('Error fetching shifts:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST /api/shifts - Create a new shift
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
    const requiredFields = ['employeeName', 'role', 'date', 'startTime', 'endTime', 'status'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: `Campo obrigatório: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate role
    const validRoles = ['Médico', 'Enfermeiro', 'Técnico', 'Condutor'];
    if (!validRoles.includes(body.role)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Função inválida' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['scheduled', 'active', 'completed', 'cancelled'];
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Status inválido' },
        { status: 400 }
      );
    }

    const newShift = dataStore.createShift({
      employeeName: body.employeeName,
      role: body.role,
      date: body.date,
      startTime: body.startTime,
      endTime: body.endTime,
      vehicleId: body.vehicleId,
      status: body.status,
    });

    return NextResponse.json<ApiResponse<Shift>>(
      { success: true, data: newShift, message: 'Escala criada com sucesso' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating shift:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
