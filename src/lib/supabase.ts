import { createClient } from "@supabase/supabase-js";

// Supabase configuration
// These should be environment variables in production
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://your-project.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "your-anon-key";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Auth helpers
export const auth = {
  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  },

  // Sign up new user
  signUp: async (email: string, password: string, userData?: Record<string, any>) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
  },

  // Sign out
  signOut: async () => {
    return await supabase.auth.signOut();
  },

  // Get current user
  getCurrentUser: async () => {
    const { data } = await supabase.auth.getUser();
    return data?.user;
  },

  // Get user role from database
  getUserRole: async (userId: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data?.role;
  },
};

// Database query helpers
export const db = {
  // Get all users by role
  getUsersByRole: async (role: "rep" | "manager" | "admin") => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("role", role);

    if (error) throw error;
    return data;
  },

  // Get organization users
  getOrganizationUsers: async (organizationId: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("organization_id", organizationId);

    if (error) throw error;
    return data;
  },

  // Get user with role and organization
  getUserDetails: async (userId: string) => {
    const { data, error } = await supabase
      .from("users")
      .select(
        `
        id,
        email,
        role,
        organization_id,
        organizations (
          id,
          name
        )
      `
      )
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  },
};

// Subscription helpers
export const subscriptions = {
  // Subscribe to user changes
  onUserUpdate: (userId: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`user-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "users",
          filter: `id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  },

  // Subscribe to role-based data changes
  onRoleDataUpdate: (table: string, role: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`${table}-${role}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: table,
        },
        callback
      )
      .subscribe();
  },
};
