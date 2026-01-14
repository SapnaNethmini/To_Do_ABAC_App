'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCreateTodo, useUpdateTodo } from '@/hooks/useTodos';
import { Todo } from '@/lib/db/schema';

interface TodoFormProps {
  todo?: Todo;
  trigger?: React.ReactNode;
}

export function TodoForm({ todo, trigger }: TodoFormProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(todo?.title || '');
  const [description, setDescription] = useState(todo?.description || '');
  const [status, setStatus] = useState<'draft' | 'in_progress' | 'completed'>(
    todo?.status || 'draft'
  );

  const createMutation = useCreateTodo();
  const updateMutation = useUpdateTodo();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (todo) {
        // Update existing todo
        await updateMutation.mutateAsync({
          id: todo.id,
          title,
          description,
          status,
        });
      } else {
        // Create new todo
        await createMutation.mutateAsync({
          title,
          description,
          status,
        });
      }
      setOpen(false);
      // Reset form
      if (!todo) {
        setTitle('');
        setDescription('');
        setStatus('draft');
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Create Todo</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{todo ? 'Edit Todo' : 'Create New Todo'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(v: any) => setStatus(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {createMutation.isPending || updateMutation.isPending
                ? 'Saving...'
                : todo
                ? 'Update'
                : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}