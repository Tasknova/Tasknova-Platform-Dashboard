import bcryptjs from "bcryptjs";
import { supabase } from "./supabase";

interface SignupParams {
  companyName: string;
  industry: string;
  timezone: string;
  adminEmail: string;
  adminPassword: string;
  adminName: string;
  adminPhone: string;
  adminDOB: string;
  companySize?: string;
  website?: string;
  contactPerson?: string;
  companyEmail?: string;
  additionalInfo?: string;
  emailProvider?: string;
  calendarService?: string;
}

interface LoginParams {
  email: string;
  password: string;
  orgId?: string; // Optional for backward compatibility
}

// Map database roles to application dashboard routes.
export function getAppRole(role: string): "rep" | "manager" | "admin" {
  if (role === "ae" || role === "team_member" || role === "rep") return "rep";
  if (role === "manager") return "manager";
  return "admin";
}

// Hash password with bcrypt
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
}

// Helper function for SHA256
async function sha256Simple(message: string): Promise<string> {
  const data = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// Compare password with hash (handles both bcryptjs and simple formats)
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // If it's our simple format, verify it
  if (hash.startsWith("$simple$")) {
    const parts = hash.split("$");
    if (parts.length === 4) {
      const salt = parts[2];
      const storedHash = parts[3];
      
      // Rehash the password with the stored salt
      const combined = salt + password;
      const computedHash = await sha256Simple(combined);
      return computedHash === storedHash;
    }
  }
  
  // Otherwise use bcryptjs for normal format
  return bcryptjs.compare(password, hash);
}

// Custom signup without Supabase Auth
export async function customSignup(params: SignupParams) {
  try {
    const { 
      companyName, 
      industry, 
      timezone, 
      adminEmail, 
      adminPassword, 
      adminName, 
      adminPhone, 
      adminDOB,
      companySize,
      website,
      contactPerson,
      companyEmail,
      additionalInfo,
      emailProvider,
      calendarService
    } = params;

    // 1. Create organization
    const { data: orgData, error: orgError } = await supabase
      .from("orgs")
      .insert({
        name: companyName,
        industry,
        timezone,
        company_size: companySize || null,
        website: website || null,
        contact_person: contactPerson || null,
        company_email: companyEmail || null,
        additional_info: additionalInfo || null,
        email_provider: emailProvider || null,
        calendar_service: calendarService || null,
      })
      .select("org_id")
      .single();

    if (orgError) throw new Error(`Organization creation failed: ${orgError.message}`);
    if (!orgData) throw new Error("Failed to create organization");

    // 2. Hash the password
    const passwordHash = await hashPassword(adminPassword);

    // 3. Create admin user with password hash
    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert({
        email: adminEmail,
        full_name: adminName,
        role: "admin",
        org_id: orgData.org_id,
        is_active: true,
        password_hash: passwordHash,
        phone_number: adminPhone || null,
        date_of_birth: adminDOB || null,
      })
      .select("user_id")
      .single();

    if (userError) throw new Error(`User creation failed: ${userError.message}`);
    if (!userData) throw new Error("Failed to create user");

    return {
      success: true,
      orgId: orgData.org_id,
      userId: userData.user_id,
      email: adminEmail,
      fullName: adminName,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Signup failed";
    return {
      success: false,
      error: message,
    };
  }
}

// Custom login without Supabase Auth
export async function customLogin(params: LoginParams) {
  try {
    const { email, password } = params;

    // 1. Find user in database by email (one account per email)
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("user_id, email, password_hash, role, is_active, full_name, org_id")
      .eq("email", email)
      .single();

    if (userError || !userData) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    if (!userData.is_active) {
      return {
        success: false,
        error: "User account is inactive",
      };
    }

    if (!userData.password_hash) {
      return {
        success: false,
        error: "No password set for this account",
      };
    }

    // 2. Verify password
    const isValidPassword = await verifyPassword(password, userData.password_hash);

    if (!isValidPassword) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    // 3. Return success with user data (include orgId)
    return {
      success: true,
      userId: userData.user_id,
      email: userData.email,
      fullName: userData.full_name || email.split("@")[0],
      role: userData.role,
      orgId: userData.org_id,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    return {
      success: false,
      error: message,
    };
  }
}

// Team Member Management Functions

export interface TeamMember {
  user_id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  date_of_birth?: string;
  role: string;
  invitation_status: string;
  invited_at?: string;
  accepted_at?: string;
  created_at: string;
}

export interface CreateTeamMemberParams {
  email: string;
  full_name: string;
  phone_number?: string;
  date_of_birth?: string;
  role: "manager" | "team_member";
  password?: string;
}

// Generate temporary password
export function generateTemporaryPassword(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// Create team member
export async function createTeamMember(
  params: CreateTeamMemberParams,
  orgId: string
) {
  try {
    const { email, full_name, phone_number, date_of_birth, role, password } = params;

    // Check if email already exists in this org
    const { data: existingUser } = await supabase
      .from("users")
      .select("user_id, email")
      .eq("email", email)
      .eq("org_id", orgId)
      .single();

    if (existingUser) {
      return {
        success: false,
        error: "User with this email already exists in the organization",
      };
    }

    // Hash password
    const tempPassword = password || generateTemporaryPassword();
    const passwordHash = await hashPassword(tempPassword);

    // Create user
    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert({
        email,
        full_name,
        phone_number: phone_number || null,
        date_of_birth: date_of_birth || null,
        role,
        org_id: orgId,
        password_hash: passwordHash,
        is_active: true,
        invitation_status: "REQUEST_SENT",
        invited_at: new Date().toISOString(),
      })
      .select("user_id, email, full_name, role")
      .single();

    if (userError || !userData) {
      throw new Error(userError?.message || "Failed to create user");
    }

    return {
      success: true,
      data: {
        ...userData,
        temporaryPassword: tempPassword,
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create team member";
    return {
      success: false,
      error: message,
    };
  }
}

// Get team members
export async function getTeamMembers(orgId: string) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select(
        "user_id, email, full_name, phone_number, date_of_birth, role, invitation_status, invited_at, accepted_at, created_at"
      )
      .eq("org_id", orgId)
      .neq("role", "admin")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return {
      success: true,
      data: data as TeamMember[],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch team members";
    return {
      success: false,
      error: message,
      data: [],
    };
  }
}

// Send invitation email
export async function sendTeamInvite(
  userId: string,
  email: string,
  fullName: string,
  role: string,
  orgId: string,
  adminName: string,
  orgName: string,
  senderEmail: string,
  temporaryPassword: string,
  loginUrl: string
) {
  try {
    const { data, error } = await supabase.functions.invoke("send-team-invite", {
      body: {
        userId,
        email,
        fullName,
        role,
        orgId,
        adminName,
        orgName,
        senderEmail,
        temporaryPassword,
        loginUrl,
      },
    });

    if (error) throw error;

    return {
      success: true,
      message: "Invitation sent successfully",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send invitation";
    return {
      success: false,
      error: message,
    };
  }
}

// Resend invitation email
export async function resendTeamInvite(
  userId: string,
  email: string,
  fullName: string,
  role: string,
  orgId: string,
  adminName: string,
  orgName: string,
  senderEmail: string,
  loginUrl: string
) {
  try {
    // Generate new temporary password
    const temporaryPassword = generateTemporaryPassword();
    const passwordHash = await hashPassword(temporaryPassword);

    // Update user's password
    const { error: updateError } = await supabase
      .from("users")
      .update({ password_hash: passwordHash })
      .eq("user_id", userId);

    if (updateError) throw updateError;

    // Send invitation
    return await sendTeamInvite(
      userId,
      email,
      fullName,
      role,
      orgId,
      adminName,
      orgName,
      senderEmail,
      temporaryPassword,
      loginUrl
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to resend invitation";
    return {
      success: false,
      error: message,
    };
  }
}

// Bulk create team members from CSV
export async function bulkCreateTeamMembers(
  members: CreateTeamMemberParams[],
  orgId: string
) {
  try {
    const results = [];

    for (const member of members) {
      const result = await createTeamMember(member, orgId);
      results.push({
        email: member.email,
        success: result.success,
        error: result.error,
        data: result.data,
      });
    }

    return {
      success: true,
      data: results,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to bulk create team members";
    return {
      success: false,
      error: message,
    };
  }
}

// Accept invitation
export async function acceptInvitation(userId: string) {
  try {
    const { error } = await supabase
      .from("users")
      .update({
        invitation_status: "REQUEST_ACCEPTED",
        accepted_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (error) throw error;

    return {
      success: true,
      message: "Invitation accepted",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to accept invitation";
    return {
      success: false,
      error: message,
    };
  }
}
