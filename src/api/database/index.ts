import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

if (
  !process.env.DB_HOST &&
  !process.env.DB_USERNAME &&
  !process.env.DB_PASSWORD &&
  !process.env.DB_DATABASE
) {
  throw new Error("DB credentials error");
}

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

export const db = drizzle(connection);
