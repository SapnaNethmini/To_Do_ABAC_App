'use client';

import { useTodos, useDeleteTodo } from '@/hooks/useTodos';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TodoForm } from './TodoForm';
import { useSession } from '@/lib/auth-client';
import { createPermissionChecker } from '@/lib/permissions';
import { Trash2, Edit } from 'lucide-react';

export function TodoList() {
  const { data: todos, isLoading, error } = useTodos();
  const { data: session } = useSession();
  const deleteMutation = useDeleteTodo();

  if (!session) return null;

  const permissions = createPermissionChecker({
    id: session.user.id,
    role: (session.user as any).role || 'user',
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this todo?')) return;
    
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading todos...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Error loading todos: {error.message}
      </div>
    );
  }

  if (!todos || todos.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-gray-500 mb-4">No todos yet</p>
          {permissions.canCreate() && <TodoForm />}
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'secondary';
      case 'in_progress':
        return 'default';
      case 'completed':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Draft';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>My Todos</CardTitle>
          {permissions.canCreate() && <TodoForm />}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {todos.map((todo) => {
              const canUpdate = permissions.canUpdate(todo);
              const canDelete = permissions.canDelete(todo);

              return (
                <TableRow key={todo.id}>
                  <TableCell className="font-medium">{todo.title}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {todo.description || '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(todo.status)}>
                      {getStatusLabel(todo.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {todo.userId === session.user.id ? 'You' : 'Other user'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {canUpdate && (
                        <TodoForm
                          todo={todo}
                          trigger={
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          }
                        />
                      )}
                      {canDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(todo.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      )}
                      {!canUpdate && !canDelete && (
                        <span className="text-xs text-gray-400">No actions</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}