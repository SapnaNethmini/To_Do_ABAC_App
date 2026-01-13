// import { betterAuth } from "better-auth";
// import { drizzleAdapter } from "better-auth/adapters/drizzle";
// import { db } from "./db";

// export const auth = betterAuth({
//   database: drizzleAdapter(db, {
//     provider: "mysql",
//   }),
//   emailAndPassword: {
//     enabled: true,
//     requireEmailVerification: false, 
//   },
  
//   session: {
//     expiresIn: 60 * 60 * 24 * 7, // 7 days
//     updateAge: 60 * 60 * 24, // Update session every 24 hours
//   },
  
//   user: {
//     additionalFields: {
//       role: {
//         type: "string",
//         defaultValue: "user",
//         required: false,
//       }
//     }
//   }
// });

// export type Session = typeof auth.$Infer.Session;


import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // Changed from "mysql" to "pg"
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        required: false,
      }
    }
  }
});

export type Session = typeof auth.$Infer.Session;