import { clerkClient } from "@clerk/express";
import { type AppUser, UserRepository } from "../repositories/user.repository";

const CACHE_TTL_MS = 5 * 60 * 1000;
const profileCache = new Map<string, { user: AppUser; expiresAt: number }>();

export class UserService {
  constructor(private readonly users = new UserRepository()) {}

  async getOrSyncClerkUser(clerkUserId: string): Promise<AppUser> {
    const cached = profileCache.get(clerkUserId);
    if (cached && cached.expiresAt > Date.now()) return cached.user;

    const clerkUser = await clerkClient.users.getUser(clerkUserId);
    const primaryEmail = clerkUser.emailAddresses.find((email) => email.id === clerkUser.primaryEmailAddressId)?.emailAddress
      ?? clerkUser.emailAddresses[0]?.emailAddress;
    if (!primaryEmail) throw new Error("Clerk user is missing an email address");

    const user = await this.users.upsert({
      clerkUserId,
      email: primaryEmail.toLowerCase(),
      name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null,
      avatarUrl: clerkUser.imageUrl || null,
    });
    profileCache.set(clerkUserId, { user, expiresAt: Date.now() + CACHE_TTL_MS });
    return user;
  }
}
