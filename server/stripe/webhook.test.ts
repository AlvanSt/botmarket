import { describe, expect, it, vi, beforeEach } from "vitest";
import { Request, Response } from "express";

// Mock the Stripe module
vi.mock("stripe", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      webhooks: {
        constructEvent: vi.fn().mockImplementation((body, sig, secret) => {
          if (sig === "valid_signature") {
            return {
              id: "evt_test_123",
              type: "checkout.session.completed",
              data: {
                object: {
                  id: "cs_test_123",
                  metadata: {
                    user_id: "1",
                    listing_id: "1",
                    purchase_id: "1",
                  },
                },
              },
            };
          }
          throw new Error("Invalid signature");
        }),
      },
    })),
  };
});

// Import after mocking
import { handleStripeWebhook } from "./webhook";

function createMockRequest(options: {
  body?: any;
  signature?: string;
}): Partial<Request> {
  return {
    body: options.body || Buffer.from("{}"),
    headers: {
      "stripe-signature": options.signature || "",
    },
  };
}

interface MockResponseResult {
  res: Partial<Response>;
  getStatusCode: () => number | null;
  getJsonBody: () => any;
}

function createMockResponse(): MockResponseResult {
  let statusCode: number | null = null;
  let jsonBody: any = null;

  const res: Partial<Response> = {
    status: vi.fn().mockImplementation(function(this: any, code: number) {
      statusCode = code;
      return this;
    }),
    json: vi.fn().mockImplementation(function(this: any, body: any) {
      jsonBody = body;
      return this;
    }),
  };

  // Bind methods to res object
  res.status = res.status!.bind(res);
  res.json = res.json!.bind(res);

  return {
    res,
    getStatusCode: () => statusCode,
    getJsonBody: () => jsonBody,
  };
}

describe("Stripe Webhook Handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 with verified:false when signature is missing", async () => {
    const req = createMockRequest({ body: Buffer.from("{}") });
    const { res, getStatusCode, getJsonBody } = createMockResponse();

    await handleStripeWebhook(req as Request, res as Response);

    expect(getStatusCode()).toBe(200);
    expect(getJsonBody()).toEqual({ verified: false, error: "Missing signature" });
  });

  it("returns 200 with verified:true for test events", async () => {
    const req = createMockRequest({
      body: Buffer.from("{}"),
      signature: "valid_signature",
    });
    const { res, getStatusCode, getJsonBody } = createMockResponse();

    await handleStripeWebhook(req as Request, res as Response);

    expect(getStatusCode()).toBe(200);
    expect(getJsonBody()).toHaveProperty("verified", true);
  });

  it("always returns HTTP 200 even on signature verification errors", async () => {
    const req = createMockRequest({
      body: Buffer.from("{}"),
      signature: "invalid_signature",
    });
    const { res, getStatusCode, getJsonBody } = createMockResponse();

    await handleStripeWebhook(req as Request, res as Response);

    expect(getStatusCode()).toBe(200);
    expect(getJsonBody()).toHaveProperty("verified", false);
  });
});
