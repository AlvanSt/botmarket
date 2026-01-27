import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock db functions
vi.mock("./db", () => ({
  getTeamsByUser: vi.fn().mockResolvedValue([]),
  getTeamById: vi.fn().mockResolvedValue({ id: 1, name: "Test Team", slug: "test-team", ownerId: 1 }),
  getTeamMembers: vi.fn().mockResolvedValue([{ userId: 1, role: "owner" }]),
  createTeam: vi.fn().mockResolvedValue(1),
  addTeamMember: vi.fn().mockResolvedValue(1),
  addTeamActivity: vi.fn().mockResolvedValue(undefined),
  getAffiliateByUserId: vi.fn().mockResolvedValue(null),
  createAffiliate: vi.fn().mockResolvedValue(1),
  getSubscriptionByUserId: vi.fn().mockResolvedValue(null),
  getUserById: vi.fn().mockResolvedValue({ id: 1, subscriptionTier: "team" }),
  getCustomProjectsByUser: vi.fn().mockResolvedValue([]),
  getOpenCustomProjects: vi.fn().mockResolvedValue([]),
  getCustomProjectById: vi.fn().mockResolvedValue({ id: 1, requesterId: 1, status: "open" }),
  createCustomProject: vi.fn().mockResolvedValue(1),
  getBidsByProject: vi.fn().mockResolvedValue([]),
}));

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(overrides: Partial<AuthenticatedUser> = {}): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    subscriptionTier: "team",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    ...overrides,
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("teams router", () => {
  it("lists user teams", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.teams.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("creates a new team", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.teams.create({
      name: "My Test Team",
      description: "A test team",
    });
    
    expect(result).toHaveProperty("teamId");
    expect(result).toHaveProperty("slug");
  });

  it("gets team by id", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.teams.getById({ id: 1 });
    expect(result).toHaveProperty("team");
    expect(result).toHaveProperty("members");
  });
});

describe("affiliates router", () => {
  it("returns null for non-affiliate user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.affiliates.getMyAffiliate();
    expect(result).toBeNull();
  });

  it("allows user to join affiliate program", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.affiliates.join();
    expect(result).toHaveProperty("affiliateId");
    expect(result).toHaveProperty("referralCode");
    expect(result.referralCode.length).toBe(8);
  });
});

describe("subscriptions router", () => {
  it("returns null for user without subscription", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.subscriptions.getCurrent();
    expect(result).toBeNull();
  });
});

describe("customProjects router", () => {
  it("lists user custom projects", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.customProjects.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("lists open custom projects", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.customProjects.getOpen();
    expect(Array.isArray(result)).toBe(true);
  });

  it("creates a custom project for team plan user", async () => {
    const ctx = createAuthContext({ subscriptionTier: "team" });
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.customProjects.create({
      title: "Build me a custom AI model",
      description: "I need a custom image classification model for my e-commerce store that can identify product categories.",
      category: "ai_model",
      budgetMin: 1000,
      budgetMax: 5000,
    });
    
    expect(result).toHaveProperty("projectId");
  });
});
