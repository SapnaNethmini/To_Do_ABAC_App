import { pgTable, varchar, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';

// Define enums 
export const roleEnum = pgEnum('role', ['user', 'manager', 'admin']);
export const statusEnum = pgEnum('status', ['draft', 'in_progress', 'completed']);

// Users table 
export const users = pgTable('user', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: varchar('image', { length: 255 }),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
  // Custom field for roles
  role: roleEnum('role').notNull().default('user'),
});

// Todos table
export const todos = pgTable('todos', {
  id: varchar('id', { length: 255 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  status: statusEnum('status').notNull().default('draft'),
  userId: varchar('userId', { length: 255 }).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type Todo = typeof todos.$inferSelect;
export type InsertTodo = typeof todos.$inferInsert;