import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Todo, InsertTodo } from '@/lib/db/schema';

/**
 * Fetch all todos
 */
export function useTodos() {
  return useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const res = await fetch('/api/todos');
      if (!res.ok) throw new Error('Failed to fetch todos');
      const data = await res.json();
      return data.todos as Todo[];
    },
  });
}

/**
 * Create a new todo
 */
export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (todo: Omit<InsertTodo, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create todo');
      }
      return res.json();
    },
    // After creating, refetch todos list
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}

/**
 * Update a todo
 */
export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<Todo> & { id: string }) => {
      const res = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update todo');
      }
      return res.json();
    },
    // Optimistic update for instant UI feedback
    onMutate: async (updatedTodo) => {

      await queryClient.cancelQueries({ queryKey: ['todos'] });

      const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);

      if (previousTodos) {
        queryClient.setQueryData<Todo[]>(
          ['todos'],
          previousTodos.map((todo) =>
            todo.id === updatedTodo.id ? { ...todo, ...updatedTodo } : todo
          )
        );
      }

      return { previousTodos };
    },
    onError: (err, variables, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}

/**
 * Delete a todo
 */
export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to delete todo');
      }
      return res.json();
    },
    // Optimistic delete
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);

      if (previousTodos) {
        queryClient.setQueryData<Todo[]>(
          ['todos'],
          previousTodos.filter((todo) => todo.id !== deletedId)
        );
      }

      return { previousTodos };
    },
    onError: (err, variables, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}