// DISABLED - OAuth not available in local version
// Using local JWT authentication instead

import type { Express, Request, Response } from "express";

// Placeholder routes that redirect to local login
export function registerOAuthRoutes(app: Express) {
  // OAuth callback - redirect to local login
  app.get("/api/oauth/callback", (_req: Request, res: Response) => {
    res.redirect("/login");
  });
  
  console.log("[OAuth] Disabled - using local JWT authentication");
}
