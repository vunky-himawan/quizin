import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

/**
 * @function verifyToken
 * @description Middleware untuk memverifikasi token.
 * @param {Request} req - Permintaan HTTP.
 * @param {Response} res - Respons HTTP.
 * @param {NextFunction} next - Fungsi untuk melanjutkan ke proses selanjutnya.
 * @returns {Promise<Response>} - Mengembalikan respons berupa token.
 */
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: "unauthorized",
      message: "Unauthorized",
    });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN as string, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        error: "forbidden",
        message: "Forbidden",
      });
    }
    next();
  });
};
