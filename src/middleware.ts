import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  beforeAuth: (req) => {
    return {
      publicRoutes: ["/", "/api/webhook"],
    };
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
