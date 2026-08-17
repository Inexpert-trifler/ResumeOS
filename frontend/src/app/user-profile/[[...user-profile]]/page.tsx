"use client";

import { UserProfile } from "@clerk/nextjs";

export default function UserProfilePage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <UserProfile path="/user-profile" routing="path" />
    </main>
  );
}
