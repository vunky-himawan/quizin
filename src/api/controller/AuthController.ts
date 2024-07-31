import { Request, Response } from "express";
import { db } from "../database";
import { users } from "../database/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../types/User";

dotenv.config();

const Login = async (req: Request, res: Response) => {
  try {
    const user: User[] = await db
      .select()
      .from(users)
      .where(eq(users.username, req.body.username));

    if (!user.length) {
      return res.status(400).json({
        error: "user_not_found",
        message: "User not found"
      });
    }

    const match: boolean = await bcrypt.compare(
      req.body.password,
      user[0].password
    );

    if (!match) {
      return res.status(400).json({
        error: "password_not_match",
        message: "Wrong password",
      });
    }

    const username: string = user[0].username;
    const userId: number = user[0].id;
    const accessToken: string = jwt.sign(
      { username, userId },
      process.env.ACCESS_TOKEN as string,
      { expiresIn: "15m" }
    );
    const refreshToken: string = jwt.sign(
      { username, userId },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    await db.update(users).set({ refreshToken }).where(eq(users.id, userId));

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (error) {
    return res.status(500).json({
      error: "server_error",
      message: "Internal Server Error",
    });
  }
};

const RefreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken: string = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        error: "unauthorized",
        message: "Unauthorized",
      });
    }

    const user: User[] = await db
      .select()
      .from(users)
      .where(eq(users.refreshToken, refreshToken));

    if (!user[0]) {
      return res.status(403).json({
        error: "forbidden",
        message: "Forbidden",
      });
    }

    jwt.verify(
      refreshToken,
      process.env.JWT_SECRET as string,
      (err: any, decoded: any) => {
        if (err) {
          return res.status(403).json({
            error: "forbidden",
            message: "Forbidden",
          });
        }

        const accessToken: string = jwt.sign(
          { username: user[0].username, userId: user[0].id },
          process.env.ACCESS_TOKEN as string,
          { expiresIn: "15m" }
        );

        res.json({ accessToken });
      }
    );
  } catch (error) {
    return res.status(500).json({
      error: "server_error",
      message: "Internal Server Error",
    });
  }
};

const Logout = async (req: Request, res: Response) => {
  try {
    const refreshToken: string = req.cookies.refreshToken;

    if (!refreshToken) {
      res.sendStatus(204);
    }

    const user: User[] = await db
      .select()
      .from(users)
      .where(eq(users.refreshToken, refreshToken));

    if (!user[0]) {
      res.sendStatus(204);
    }

    await db
      .update(users)
      .set({ refreshToken: null })
      .where(eq(users.id, user[0].id));

    res.clearCookie("refreshToken");

    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).json({
      error: "server_error",
      message: "Internal Server Error",
    });
  }
};

export const AuthController = {
  Login,
  RefreshToken,
  Logout,
};
