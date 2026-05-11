import { StrictMode, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider, useAuth } from "@clerk/react";
import { ConvexProviderWithAuth, ConvexReactClient } from "convex/react";
import "./index.css";
import App from "./App";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

function useConvexAuth() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  // fetchAccessToken must be stable across renders — a new reference each render
  // causes ConvexProviderWithAuth to re-authenticate continuously, triggering
  // infinite query re-subscriptions and flickering.
  const fetchAccessToken = useCallback(
    async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
      try {
        return await getToken({ template: "convex", skipCache: forceRefreshToken });
      } catch {
        return null;
      }
    },
    [getToken],
  );
  return {
    isLoading: !isLoaded,
    isAuthenticated: isSignedIn ?? false,
    fetchAccessToken,
  };
}

function ConvexClerkProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProviderWithAuth client={convex} useAuth={useConvexAuth}>
      {children}
    </ConvexProviderWithAuth>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string}>
      <ConvexClerkProvider>
        <App />
      </ConvexClerkProvider>
    </ClerkProvider>
  </StrictMode>
);
