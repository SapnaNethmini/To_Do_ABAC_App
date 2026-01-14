import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Get connection string 
const connectionString = process.env.DATABASE_URL!;

// Create postgres client 
const client = postgres(connectionString, { 
  prepare: false, 
  max: 1, 
});


export const db = drizzle(client, { schema });

export { schema };
