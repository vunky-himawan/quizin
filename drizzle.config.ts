import { defineConfig } from "drizzle-kit";

if (!process.env.DB_URL) {
  throw new Error("DB URL is missing");
}
export default defineConfig({
  schema: "./src/api/database/schema.ts",
  out: "./src/api/database/migrations",
  dbCredentials: {
    url: process.env.DB_URL,
  },
  dialect: "mysql",
});
