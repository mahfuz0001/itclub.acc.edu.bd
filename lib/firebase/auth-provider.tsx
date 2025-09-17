"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import {
  type User,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./config";
import { 
  getSafeErrorMessage, 
  logError, 
  withErrorHandling, 
  retryOperation 
} from "@/lib/utils/error-handler";
import { validateEmail } from "@/lib/utils/validation";

interface AdminUser extends User {
  role: "admin" | "panel" | "root" | "member";
  assignedYear?: string;
}

interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signIn: async () => {},
  signOut: async () => {},
  clearError: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!mounted) return;

        if (firebaseUser) {
          // Retry user data fetching with error handling
          const userData = await retryOperation(
            async () => {
              const userDoc = await getDoc(doc(db, "adminUsers", firebaseUser.uid));
              return userDoc.data();
            },
            3,
            1000,
            "Fetching user data"
          );

          if (mounted) {
            setUser({
              ...firebaseUser,
              role: userData?.role || "admin",
              assignedYear: userData?.assignedYear,
            } as AdminUser);
            setError(null);
          }
        } else {
          if (mounted) {
            setUser(null);
          }
        }
      } catch (error) {
        logError(error, "Auth state change");
        if (mounted) {
          setError(getSafeErrorMessage(error));
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);

      // Validate inputs
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        throw new Error("Please enter a valid email address.");
      }

      if (!password || password.length < 6) {
        throw new Error("Password must be at least 6 characters long.");
      }

      // Attempt sign in with retry mechanism
      await retryOperation(
        async () => {
          await signInWithEmailAndPassword(auth, emailValidation.sanitized, password);
        },
        2,
        1000,
        "User sign in"
      );
    } catch (error) {
      const errorMessage = getSafeErrorMessage(error);
      setError(errorMessage);
      logError(error, "User sign in", { email: email.substring(0, 3) + "***" });
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      setLoading(true);

      await retryOperation(
        async () => {
          await firebaseSignOut(auth);
        },
        2,
        1000,
        "User sign out"
      );
    } catch (error) {
      const errorMessage = getSafeErrorMessage(error);
      setError(errorMessage);
      logError(error, "User sign out");
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      signIn, 
      signOut, 
      clearError 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
