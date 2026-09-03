import express, { type Request, type Response } from "express";
import { usersTable } from "../db/schema/auth.schema.ts";
import asyncHandler from "../helpers/handler.ts";
import { db } from "../db/database.ts";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config.ts";
import { getUserByGuid } from "../services/user.service.ts";

export const registerHandler = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const hashing = 10;
  if (!username || !email || !password) {
    res.status(400).json({ message: "All fields are required." });
    return;
  }

  const isAlreadyregistered = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (isAlreadyregistered?.length > 0) {
    res.status(409).json({ message: "Email already registered." });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, hashing);

  const [newuser] = await db
    .insert(usersTable)
    .values({ username, email, password: hashedPassword })
    .returning();

  const accessToken = jwt.sign({ id: newuser?.guid }, config.JWT_SECERT_KEY, {
    expiresIn: "15min",
  });

  const refreshToken = jwt.sign({ id: newuser?.guid }, config.JWT_SECERT_KEY, {
    expiresIn: "1d",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 1 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    message: "User registered successfully.",
    data: { username: newuser?.username, email: newuser?.email },
    token: accessToken,
  });
});

export const tokenHandler = asyncHandler(async (req, res) => {
  let token = req.headers.authorization?.split(" ")[1] ?? "";

  if (!token) {
    res.status(500).json({ message: "No Token found" });
    return;
  }

  const decoded = jwt.verify(token, config.JWT_SECERT_KEY);

  if (typeof decoded === "string" || typeof decoded.id !== "string") {
    res.status(401).json({ message: "Invalid token." });
    return;
  }

  const user = await getUserByGuid(decoded.id);
  console.log(user);

  res.status(200).json({
    message: "user fetched successfully",
    user: {
      username: user?.username,
      email: user?.email,
    },
  });
});

export const refreshTokenHandler = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(401).json({
      message: "Refresh token not found",
    });
  }

  const decoded = jwt.verify(refreshToken, config.JWT_SECERT_KEY);

  if (typeof decoded === "string" || typeof decoded.id !== "string") {
    res.status(401).json({ message: "Invalid token." });
    return;
  }

  const accessToken = jwt.sign({ id: decoded.id }, config.JWT_SECERT_KEY, {
    expiresIn: "15m",
  });

  const newRefreshToken = jwt.sign({ id: decoded.id }, config.JWT_SECERT_KEY, {
    expiresIn: "1d",
  });

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 1 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "Access token refreshed successfully",
    accessToken,
  });
});
