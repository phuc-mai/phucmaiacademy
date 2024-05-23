import { authMiddleware } from "@clerk/nextjs/server";

export default authMiddleware({
  publicRoutes: ["/", "/api/:path*", "/api/courses", "/api/courses/categories"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};