
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { todos } from '@/lib/db/schema';
import { createPermissionChecker } from '@/lib/permissions';
import { eq } from 'drizzle-orm';

/**
 * PATCH /api/todos/[id]
 * Update a todo
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = session.user;
    
    const { id: todoId } = await params;

    // Get existing todo
    const [existingTodo] = await db
      .select()
      .from(todos)
      .where(eq(todos.id, todoId));

    if (!existingTodo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    // ABAC update check
    const permissions = createPermissionChecker({
      id: user.id,
      role: user.role as any,
    });

    if (!permissions.canUpdate(existingTodo)) {
      return NextResponse.json(
        { error: 'Forbidden: Cannot update this todo' },
        { status: 403 }
      );
    }

    // Update todo
    const body = await request.json();
    const { title, description, status } = body;

    const updatedTodo = {
      ...existingTodo,
      title: title !== undefined ? title : existingTodo.title,
      description: description !== undefined ? description : existingTodo.description,
      status: status !== undefined ? status : existingTodo.status,
      updatedAt: new Date().toISOString(), // String date
    };

    await db
      .update(todos)
      .set(updatedTodo)
      .where(eq(todos.id, todoId));

    return NextResponse.json({ todo: updatedTodo });
  } catch (error) {
    console.error('Error updating todo:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/todos/[id]
 * Delete a todo 
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = session.user;
    
    const { id: todoId } = await params;

    // Get existing todo
    const [existingTodo] = await db
      .select()
      .from(todos)
      .where(eq(todos.id, todoId));

    if (!existingTodo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    // ABAC delete check
    const permissions = createPermissionChecker({
      id: user.id,
      role: user.role as any,
    });

    if (!permissions.canDelete(existingTodo)) {
      return NextResponse.json(
        { error: 'Forbidden: Cannot delete this todo (check status and ownership)' },
        { status: 403 }
      );
    }

    // Delete todo
    await db.delete(todos).where(eq(todos.id, todoId));

    return NextResponse.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}