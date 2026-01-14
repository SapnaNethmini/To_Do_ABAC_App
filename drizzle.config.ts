import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const config: Config = {
  schema: "./lib/db/schema.ts", 
  out: "./drizzle",                
  dialect: "postgresql",
   dbCredentials: {
       url: process.env.DATABASE_URL!,
    },
//  dbCredentials: {
//     host: process.env.DB_HOST || "",       
//     user: process.env.DB_USER || "",
//     password: process.env.DB_PASSWORD || "",
//     database: process.env.DB_NAME || "",
//     url: process.env.DATABASE_URL!,        
//   },
};

export default config;


