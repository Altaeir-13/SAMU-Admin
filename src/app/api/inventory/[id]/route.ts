import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dataStore } from '@/lib/dataStore';
import { ApiResponse, InventoryItem } from '@/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/inventory/[id] - Get a specific inventory item
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
    const item = dataStore.getInventoryItem(id);

    if (!item) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Item não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<InventoryItem>>({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT /api/inventory/[id] - Update an inventory item
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

    // Validate category if provided
    if (body.category) {
      const validCategories = ['Medicamento', 'Equipamento', 'Material', 'Insumo'];
      if (!validCategories.includes(body.category)) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: 'Categoria inválida' },
          { status: 400 }
        );
      }
    }

    // Validate numeric fields if provided
    if (body.quantity !== undefined && (typeof body.quantity !== 'number' || body.quantity < 0)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Quantidade deve ser um número positivo' },
        { status: 400 }
      );
    }

    if (body.minQuantity !== undefined && (typeof body.minQuantity !== 'number' || body.minQuantity < 0)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Quantidade mínima deve ser um número positivo' },
        { status: 400 }
      );
    }

    const updatedItem = dataStore.updateInventoryItem(id, body);

    if (!updatedItem) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Item não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<InventoryItem>>({
      success: true,
      data: updatedItem,
      message: 'Item atualizado com sucesso',
    });
  } catch (error) {
    console.error('Error updating inventory item:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE /api/inventory/[id] - Delete an inventory item
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
    const deleted = dataStore.deleteInventoryItem(id);

    if (!deleted) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Item não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<null>>({
      success: true,
      message: 'Item excluído com sucesso',
    });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
