// src/lib/permissions.ts
import { Todo, User } from './db/schema';

// User roles
export type Role = 'user' | 'manager' | 'admin';

// Todo statuses
export type Status = 'draft' | 'in_progress' | 'completed';

/**
 * ABAC Permission Checker
 * Attributes: user.role, todo.userId, todo.status
 */
export class PermissionChecker {
  constructor(private user: Pick<User, 'id' | 'role'>) {}

  /**
   * Can the user VIEW this todo?
   * - User: Only their own todos
   * - Manager: All todos
   * - Admin: All todos
   */
  canView(todo: Pick<Todo, 'userId'>): boolean {
    const role = this.user.role as Role;
    
    switch (role) {
      case 'user':
        return todo.userId === this.user.id;
      case 'manager':
      case 'admin':
        return true;
      default:
        return false;
    }
  }

  /**
   * Can the user CREATE todos?
   * - User: Yes
   * - Manager: No
   * - Admin: No
   */
  canCreate(): boolean {
    return this.user.role === 'user';
  }

  /**
   * Can the user UPDATE this todo?
   * - User: Only their own todos
   * - Manager: No
   * - Admin: No
   */
  canUpdate(todo: Pick<Todo, 'userId'>): boolean {
    return this.user.role === 'user' && todo.userId === this.user.id;
  }

  /**
   * Can the user DELETE this todo?
   * - User: Only their own todos in DRAFT status
   * - Manager: No
   * - Admin: Any todo, any status
   */
  canDelete(todo: Pick<Todo, 'userId' | 'status'>): boolean {
    const role = this.user.role as Role;
    
    switch (role) {
      case 'user':
        return todo.userId === this.user.id && todo.status === 'draft';
      case 'admin':
        return true;
      case 'manager':
        return false;
      default:
        return false;
    }
  }

  /**
   * Get list query filter based on role
   * - User: Only their todos (WHERE userId = ?)
   * - Manager/Admin: All todos (no filter)
   */
  getListFilter(): { userId?: string } {
    if (this.user.role === 'user') {
      return { userId: this.user.id };
    }
    return {}; 
  }
}

export function createPermissionChecker(user: Pick<User, 'id' | 'role'>) {
  return new PermissionChecker(user);
}