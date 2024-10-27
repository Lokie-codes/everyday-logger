// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/auth/error", // Error page for auth issues
    newUser: "/register" // For first-time users
  },
  callbacks: {
    authorized: ({ req, token }) => {
      // Add custom authorization logic if needed
      return !!token
    }
  }
});

export const config = {
  matcher: [
    "/",
    "/api/tasks/:path*",
  ],
};