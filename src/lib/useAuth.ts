import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { supabase } from "./supabase";

export interface User {
  id: string;
  email: string;
  role: "rep" | "manager" | "admin";
  name?: string;
  organizationId?: string;
}

export const useAuth = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is logged in (from localStorage)
  useEffect(() => {
    const checkAuth = () => {
      const userRole = localStorage.getItem("userRole");
      const userEmail = localStorage.getItem("userEmail");
      const userName = localStorage.getItem("userName");
      const userId = localStorage.getItem("userId");

      if (userRole && userEmail && userId) {
        setUser({
          id: userId,
          email: userEmail,
          role: userRole as "rep" | "manager" | "admin",
          name: userName || userEmail.split("@")[0],
        });
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = useCallback(
    async (email: string, password: string, role: "rep" | "manager" | "admin") => {
      setLoading(true);
      setError(null);
      try {
        // In production, authenticate with Supabase
        // const { data, error: authError } = await supabase.auth.signInWithPassword({
        //   email,
        //   password,
        // });

        // if (authError) throw authError;

        // Get user details from database
        // const userDetails = await supabase
        //   .from("users")
        //   .select("*")
        //   .eq("email", email)
        //   .eq("role", role)
        //   .single();

        // if (userDetails.error) throw userDetails.error;

        const newUser: User = {
          id: `${role}-${email.split("@")[0]}`,
          email,
          role,
          name: email.split("@")[0],
        };

        setUser(newUser);
        localStorage.setItem("userRole", role);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userName", newUser.name);
        localStorage.setItem("userId", newUser.id);

        navigate(`/${role}`);
        return newUser;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Login failed";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      // Sign out from Supabase
      // await supabase.auth.signOut();

      // Clear local storage
      localStorage.removeItem("userRole");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      localStorage.removeItem("userId");

      setUser(null);
      navigate("/");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Logout failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";
  const isManager = user?.role === "manager";
  const isRep = user?.role === "rep";

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    isManager,
    isRep,
  };
};

// Protected route component
export const useRequireAuth = (requiredRole?: "rep" | "manager" | "admin") => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!auth.loading) {
      if (!auth.isAuthenticated) {
        navigate("/");
        return;
      }

      if (requiredRole && auth.user?.role !== requiredRole) {
        navigate("/");
        return;
      }

      setIsReady(true);
    }
  }, [auth.loading, auth.isAuthenticated, auth.user?.role, requiredRole, navigate]);

  return {
    ...auth,
    isReady,
  };
};
