import type { NextFunction, Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { type AppUser } from "../repositories/user.repository";
import { UserService } from "../services/user.service";

export interface AuthenticatedRequest extends Request {
  currentUser?: AppUser;
}

const users = new UserService();

export async function requireCurrentUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }
    req.currentUser = await users.getOrSyncClerkUser(userId);
    next();
  } catch (error) {
    next(error);
  }
}
