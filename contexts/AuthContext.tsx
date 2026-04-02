import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import api from "@/lib/api";

interface User {
  id: string;
  email: string;
  full_name?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Verify token and get user details
          const { data } = await api.get("/auth/me");
          setUser({
            id: data._id,
            email: data.email,
            full_name: data.full_name,
            role: data.role
          });
        } catch (err) {
          console.error("Auth check failed", err);
          localStorage.removeItem("token");
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      await api.post("/auth/register", { email, password, fullName });
      // Auto login after register? Or just return success.
      // Usually better to ask user to login or auto-login.
      // For now, let's just return success and let the UI handle it (it likely redirects to login).
      return { error: null };
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Registration failed";
      return { error: { message: errorMessage } };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      setUser({
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.full_name,
        role: data.user.role
      });
      return { error: null };
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Login failed";
      return { error: { message: errorMessage } };
    }
  };

  const signOut = async () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

