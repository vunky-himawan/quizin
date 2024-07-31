import { db } from "../index";
import { users } from "../schema";
import bycript from "bcryptjs";

export const seedUsers = async () => {
  // Delete all data pengguna
  await db.delete(users);

  const data = [
    { username: "user", password: bycript.hashSync("123") },
  ];

  // Seed data pengguna
  for (const user of data) {
    await db.insert(users).values(user);
  }
};
