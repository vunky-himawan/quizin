import { Request, Response } from "express";
import { db } from "../database";
import { users } from "../database/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../types/User";

dotenv.config();

/**
 * @function Login
 * @description Fungsi untuk login pengguna.
 * @param {Request} req - Permintaan HTTP yang berisi data login pengguna (username dan password).
 * @param {Response} res - Respons HTTP.
 * @returns {Promise<Response>} - Mengembalikan respons berupa token.
 */
const Login = async (req: Request, res: Response) => {
  try {
    const user: User[] = await db
      .select()
      .from(users)
      .where(eq(users.username, req.body.username));

    if (!user.length) {
      return res.status(400).json({
        error: "user_not_found",
        message: "User not found",
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

/**
 * @function RefreshToken
 * @description Fungsi untuk mendapatkan token refresh.
 * @param {Request} req - Permintaan HTTP yang berisi token refresh.
 * @param {Response} res - Respons HTTP.
 * @returns {Promise<Response>} - Mengembalikan respons berupa token.
 */
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

/**
 * @function Logout
 * @description Fungsi untuk logout pengguna.
 * @param {Request} req - Permintaan HTTP yang berisi token refresh.
 * @param {Response} res - Respons HTTP.
 * @returns {Promise<Response>} - Mengembalikan respons berupa status 200.
 */
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

/**
 * @function Register
 * @description Fungsi untuk mendaftarkan pengguna baru.
 * @param {Request} req - Permintaan HTTP yang berisi data pengguna baru (username dan password).
 * @param {Response} res - Respons HTTP.
 * @returns {Promise<Response>} - Mengembalikan respons berupa status 200.
 */
const Register = async (req: Request, res: Response) => {
  try {
    const user: User[] = await db
      .select()
      .from(users)
      .where(eq(users.username, req.body.username));

    if (user.length) {
      return res.status(400).json({
        error: "user_already_exist",
        message: "Username already exist",
      });
    }

    const hashedPassword: string = await bcrypt.hash(req.body.password, 10);

    await db
      .insert(users)
      .values({ username: req.body.username, password: hashedPassword });

    res.status(200).json({
      message: "User registered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: "server_error",
      message: "Internal Server Error",
    });
  }
};

/**
 * @function AuthController
 * @description Mengikuti semua fungsi dari controller auth.
 * @returns {Object} - Mengembalikan semua fungsi dari controller auth.
 */
export const AuthController = {
  Login,
  Register,
  RefreshToken,
  Logout,
};
