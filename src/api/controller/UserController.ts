import { Request, Response } from "express";
import { db } from "../database";
import { users } from "../database/schema";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await db.select().from(users);
    return res.status(200).json({ length: allUsers.length, data: allUsers });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "server_error", message: "Internal Server Error" });
  }
};

export const UserController = {
  getAllUsers,
};
