import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dataStore } from '@/lib/dataStore';
import { ApiResponse, InventoryItem } from '@/types';

// GET /api/inventory - Get all inventory items
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
    const category = searchParams.get('category');
    const lowStock = searchParams.get('lowStock');

    let items = dataStore.getInventory();

    // Apply filters
    if (category) {
      items = items.filter((item) => item.category === category);
    }
    if (lowStock === 'true') {
      items = items.filter((item) => item.quantity < item.minQuantity);
    }

    return NextResponse.json<ApiResponse<InventoryItem[]>>({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST /api/inventory - Create a new inventory item
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
    const requiredFields = ['name', 'category', 'quantity', 'minQuantity', 'unit', 'location'];
    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: `Campo obrigatório: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate category
    const validCategories = ['Medicamento', 'Equipamento', 'Material', 'Insumo'];
    if (!validCategories.includes(body.category)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Categoria inválida' },
        { status: 400 }
      );
    }

    // Validate numeric fields
    if (typeof body.quantity !== 'number' || body.quantity < 0) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Quantidade deve ser um número positivo' },
        { status: 400 }
      );
    }

    if (typeof body.minQuantity !== 'number' || body.minQuantity < 0) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Quantidade mínima deve ser um número positivo' },
        { status: 400 }
      );
    }

    const newItem = dataStore.createInventoryItem({
      name: body.name,
      category: body.category,
      quantity: body.quantity,
      minQuantity: body.minQuantity,
      unit: body.unit,
      expirationDate: body.expirationDate,
      location: body.location,
    });

    return NextResponse.json<ApiResponse<InventoryItem>>(
      { success: true, data: newItem, message: 'Item cadastrado com sucesso' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating inventory item:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
