import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged, signInWithPopup, signInWithRedirect, getRedirectResult, signOut, GoogleAuthProvider } from "firebase/auth";

interface AuthState {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  authError: string | null;
}

const defaultAuth: AuthState = {
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  logout: async () => {},
  authError: null,
};

const AuthContext = createContext<AuthState>(defaultAuth);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authModule, setAuthModule] = useState<{ auth: any; googleProvider: GoogleAuthProvider } | null>(null);

  useEffect(() => {
    import("@/lib/firebase")
      .then(async (mod) => {
        setAuthModule({ auth: mod.auth, googleProvider: mod.googleProvider });

        // Check for redirect result first
        try {
          const result = await getRedirectResult(mod.auth);
          if (result?.user) {
            setUser(result.user);
          }
        } catch (err: any) {
          console.warn("Redirect result error:", err);
        }

        const unsubscribe = onAuthStateChanged(mod.auth, (u) => {
          setUser(u);
          setLoading(false);
        });
        return unsubscribe;
      })
      .catch((err) => {
        console.warn("Firebase init failed:", err);
        setLoading(false);
      });
  }, []);

  const signInWithGoogle = async () => {
    if (!authModule) return;
    setAuthError(null);
    try {
      // Try popup first
      await signInWithPopup(authModule.auth, authModule.googleProvider);
    } catch (err: any) {
      console.warn("Popup sign-in failed, trying redirect:", err.code);
      if (err.code === "auth/unauthorized-domain" || err.code === "auth/popup-blocked" || err.code === "auth/popup-closed-by-user") {
        setAuthError(
          err.code === "auth/unauthorized-domain"
            ? "This domain is not authorized in Firebase. Please add it to Firebase Console → Authentication → Settings → Authorized domains."
            : err.message
        );
        // Try redirect as fallback
        try {
          await signInWithRedirect(authModule.auth, authModule.googleProvider);
        } catch (redirectErr: any) {
          setAuthError(redirectErr.message);
        }
      } else {
        setAuthError(err.message);
      }
    }
  };

  const logout = async () => {
    if (authModule) {
      await signOut(authModule.auth);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout, authError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
