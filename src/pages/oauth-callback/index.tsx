import { Navigate } from "react-router-dom";

// Google OAuth is handled by Convex Auth at /api/auth/callback/google.
// This route is no longer used but kept to avoid broken links.
export function GoogleOAuthCallbackPage() {
  return <Navigate to="/" replace />;
}
