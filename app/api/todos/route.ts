// src/app/api/todos/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { todos } from '@/lib/db/schema';
import { createPermissionChecker } from '@/lib/permissions';
import { eq, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';

/**
 * GET /api/todos
 * List todos based on user role (ABAC filtering)
 */
export async function GET(request: NextRequest) {
  try {
    // Get session from Better Auth
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = session.user;
    const permissions = createPermissionChecker({
      id: user.id,
      role: user.role as any,
    });

    // Get filter based on role (ABAC!)
    const filter = permissions.getListFilter();
    
    // Query todos with filter
    const userTodos = filter.userId
      ? await db.select().from(todos).where(eq(todos.userId, filter.userId))
      : await db.select().from(todos);

    return NextResponse.json({ todos: userTodos });
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/todos
 * Create a new todo (only Users can create)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = session.user;
    const permissions = createPermissionChecker({
      id: user.id,
      role: user.role as any,
    });

    // ABAC check: Can this user create todos?
    if (!permissions.canCreate()) {
      return NextResponse.json(
        { error: 'Forbidden: Only users can create todos' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, status = 'draft' } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Create todo
    const newTodo = {
      id: nanoid(),
      title,
      description: description || '',
      status,
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(todos).values(newTodo);

    return NextResponse.json({ todo: newTodo }, { status: 201 });
  } catch (error) {
    console.error('Error creating todo:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}