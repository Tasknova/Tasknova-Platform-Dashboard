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
  orgId: string;
  email: string;
  password: string;
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
    const { orgId, email, password } = params;

    // 1. Find user in database
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("user_id, email, password_hash, role, is_active, full_name")
      .eq("org_id", orgId)
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

    // 3. Return success with user data
    return {
      success: true,
      userId: userData.user_id,
      email: userData.email,
      fullName: userData.full_name || email.split("@")[0],
      role: userData.role,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    return {
      success: false,
      error: message,
    };
  }
}
