import { SignJWT, jwtVerify } from "jose";
import { ENV } from "../_core/env";
import * as db from "../db";
import type { User } from "../../drizzle/schema";

const SECRET = new TextEncoder().encode(ENV.cookieSecret || "your-secret-key-change-in-production");

export type SessionPayload = {
  userId: number;
  email: string;
  name: string;
};

/**
 * Create a JWT session token
 */
export async function createSessionToken(user: User): Promise<string> {
  const token = await new SignJWT({
    userId: user.id,
    email: user.email,
    name: user.name,
  } as SessionPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("365d")
    .sign(SECRET);

  return token;
}

/**
 * Verify and decode a JWT token
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const verified = await jwtVerify(token, SECRET);
    return verified.payload as SessionPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Hash a password using simple method (in production, use bcrypt)
 * For now, using a simple hash for demo purposes
 */
export function hashPassword(password: string): string {
  // In production, use bcrypt: import bcrypt from 'bcrypt'
  // For now, using simple base64 encoding (NOT secure, demo only)
  return Buffer.from(password).toString("base64");
}

/**
 * Verify a password
 */
export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

/**
 * Register a new user
 */
export async function registerUser(
  email: string,
  password: string,
  name: string
): Promise<User> {
  // Check if user already exists
  const existingUser = await db.getUserByEmail(email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  // Create new user
  const passwordHash = hashPassword(password);
  const user = await db.createUser({
    email,
    name,
    passwordHash,
    role: "user",
  });

  return user;
}

/**
 * Login user
 */
export async function loginUser(email: string, password: string): Promise<User> {
  const user = await db.getUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }

  if (!user.passwordHash || !verifyPassword(password, user.passwordHash)) {
    throw new Error("Invalid password");
  }

  // Update last signed in
  await db.updateUserLastSignedIn(user.id);

  return user;
}
