import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { hashPassword, verifyPassword, registerUser, loginUser } from "./local";
import * as db from "../db";

describe("Local Authentication", () => {
  const testEmail = `test-${Date.now()}@swarm.local`;
  const testPassword = "testPassword123";
  const testName = "Test User";

  it("should hash and verify passwords correctly", () => {
    const hash = hashPassword(testPassword);
    expect(hash).not.toBe(testPassword);
    expect(verifyPassword(testPassword, hash)).toBe(true);
    expect(verifyPassword("wrongPassword", hash)).toBe(false);
  });

  it("should register a new user", async () => {
    const user = await registerUser(testEmail, testPassword, testName);
    expect(user).toBeDefined();
    expect(user.email).toBe(testEmail);
    expect(user.name).toBe(testName);
    expect(user.passwordHash).toBeDefined();
    expect(user.role).toBe("user");
  });

  it("should not allow duplicate email registration", async () => {
    try {
      await registerUser(testEmail, testPassword, testName);
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("already exists");
    }
  });

  it("should login with correct credentials", async () => {
    const user = await loginUser(testEmail, testPassword);
    expect(user).toBeDefined();
    expect(user.email).toBe(testEmail);
  });

  it("should fail login with incorrect password", async () => {
    try {
      await loginUser(testEmail, "wrongPassword");
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("Invalid password");
    }
  });

  it("should fail login with non-existent email", async () => {
    try {
      await loginUser("nonexistent@swarm.local", testPassword);
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("not found");
    }
  });
});
