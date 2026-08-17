import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/builder(.*)",
  "/studio(.*)",
  "/analyzer(.*)",
  "/tracker(.*)",
  "/settings(.*)",
  "/user-profile(.*)",
  "/coach(.*)",
  "/cover-letter(.*)",
  "/linkedin(.*)",
  "/github(.*)",
  "/career-roadmap(.*)",
  "/interview-prep(.*)",
  "/review(.*)",
]);

// Clerk's keyless development mode creates its keys on the first page render.
// Calling auth.protect() before that bootstrap has completed throws an opaque
// "Missing publishableKey" runtime error. Production always has this variable.
const hasConfiguredClerkKey = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
const hasSecretKey = Boolean(process.env.CLERK_SECRET_KEY);

console.log("[clerk-middleware] publishable key configured:", hasConfiguredClerkKey);
console.log("[clerk-middleware] secret key configured:", hasSecretKey);

export default clerkMiddleware(async (auth, request) => {
  if (hasConfiguredClerkKey && isProtectedRoute(request)) await auth.protect();
});

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api|trpc)(.*)"],
};
