import express, { type Request, type Response } from "express";
import { usersTable } from "../db/schema/auth.schema.ts";
import asyncHandler from "../helpers/handler.ts";
import { db } from "../db/database.ts";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config.ts";

const authHandler = asyncHandler(async (req, res) => {
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

  const newuser = await db
    .insert(usersTable)
    .values({ username, email, password: hashedPassword })
    .returning({
      username: usersTable.username,
      email: usersTable.email,
      createdat: usersTable.created_at,
    });

  const token = jwt.sign({ email }, config.JWT_SECERT_KEY, { expiresIn: "1h" });

  res.status(201).json({
    message: "User registered successfully.",
    user: { data: newuser, token: token },
  });
});

export default authHandler;
