import { pgTable, varchar, text, pgEnum, customType } from 'drizzle-orm/pg-core';

// Define enums
export const roleEnum = pgEnum('role', ['user', 'manager', 'admin']);
export const statusEnum = pgEnum('status', ['draft', 'in_progress', 'completed']);


const dateString = customType<{ data: Date | string; driverData: string }>({
  dataType() {
    return 'varchar(255)';
  },
  toDriver(value: Date | string): string {
    if (value instanceof Date) {
      return value.toISOString();
    }
    if (typeof value === 'string') {
      return value;
    }
    return new Date().toISOString();
  },
  fromDriver(value: string): string {
    return value;
  },
});


// Users table
export const user = pgTable('user', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: dateString('emailVerified'),
  image: varchar('image', { length: 255 }),
  createdAt: dateString('createdAt').notNull(),
  updatedAt: dateString('updatedAt').notNull(),
  role: roleEnum('role').notNull().default('user'),
});

// Session table 
export const session = pgTable('session', {
  id: varchar('id', { length: 255 }).primaryKey(),
  expiresAt: dateString('expiresAt').notNull(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  createdAt: dateString('createdAt').notNull(),
  updatedAt: dateString('updatedAt').notNull(),
  ipAddress: varchar('ipAddress', { length: 255 }),
  userAgent: text('userAgent'),
  userId: varchar('userId', { length: 255 }).notNull().references(() => user.id, { onDelete: 'cascade' }),
});

// Account table
export const account = pgTable('account', {
  id: varchar('id', { length: 255 }).primaryKey(),
  accountId: varchar('accountId', { length: 255 }).notNull(),
  providerId: varchar('providerId', { length: 255 }).notNull(),
  userId: varchar('userId', { length: 255 }).notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: dateString('accessTokenExpiresAt'),
  refreshTokenExpiresAt: dateString('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: dateString('createdAt').notNull(),
  updatedAt: dateString('updatedAt').notNull(),
});

// Verification table 
export const verification = pgTable('verification', {
  id: varchar('id', { length: 255 }).primaryKey(),
  identifier: varchar('identifier', { length: 255 }).notNull(),
  value: varchar('value', { length: 255 }).notNull(),
  expiresAt: dateString('expiresAt').notNull(),
  createdAt: dateString('createdAt'),
  updatedAt: dateString('updatedAt'),
});


// Todos table
export const todos = pgTable('todos', {
  id: varchar('id', { length: 255 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  status: statusEnum('status').notNull().default('draft'),
  userId: varchar('userId', { length: 255 }).notNull(),
  createdAt: dateString('createdAt').notNull(),
  updatedAt: dateString('updatedAt').notNull(),
});


export type User = typeof user.$inferSelect;
export type Todo = typeof todos.$inferSelect;
export type InsertTodo = typeof todos.$inferInsert;