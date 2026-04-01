import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { ArrowLeft, ChevronRight, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { customSignup } from "../../../lib/auth";

export function SignupOrganization() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"details" | "admin">("details");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Organization details
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  const [crmPortal, setCrmPortal] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [emailProvider, setEmailProvider] = useState("");
  const [calendarService, setCalendarService] = useState("");
  
  // Admin details
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPhone, setAdminPhone] = useState("");
  const [adminDOB, setAdminDOB] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Validation helpers
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhone = (phone: string) => {
    const regex = /^[\d\s\-\+\(\)]{10,}$/;
    return regex.test(phone.replace(/\s/g, ""));
  };

  const validateDOB = (dob: string) => {
    if (!dob) return false;
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    
    let actualAge = age;
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      actualAge--;
    }
    
    return actualAge >= 18 && birthDate < today;
  };

  const passwordStrength = useMemo(() => {
    if (!adminPassword) return { score: 0, label: "" };
    let score = 0;
    if (adminPassword.length >= 8) score++;
    if (/[a-z]/.test(adminPassword) && /[A-Z]/.test(adminPassword)) score++;
    if (/\d/.test(adminPassword)) score++;
    if (/[^a-zA-Z\d]/.test(adminPassword)) score++;
    return {
      score,
      label: score <= 1 ? "Weak" : score === 2 ? "Fair" : score === 3 ? "Good" : "Strong",
      color: score <= 1 ? "text-red-500" : score === 2 ? "text-yellow-500" : score === 3 ? "text-blue-500" : "text-green-500",
    };
  }, [adminPassword]);

  const handleOrgSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || companyName.length < 2) {
      setError("Company name must be at least 2 characters");
      return;
    }
    if (!industry.trim()) {
      setError("Please select an industry");
      return;
    }
    if (!crmPortal.trim()) {
      setError("Please select a CRM portal");
      return;
    }
    if (!companyEmail.trim() || !validateEmail(companyEmail)) {
      setError("Please enter a valid company email");
      return;
    }
    if (!contactPerson.trim()) {
      setError("Please enter a contact person name");
      return;
    }
    setError("");
    setStep("admin");
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!adminName.trim() || adminName.length < 2) {
      setError("Full name must be at least 2 characters");
      return;
    }

    if (!validateEmail(adminEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!validatePhone(adminPhone)) {
      setError("Please enter a valid phone number (at least 10 digits)");
      return;
    }

    if (!validateDOB(adminDOB)) {
      setError("You must be at least 18 years old");
      return;
    }

    if (!adminPassword || adminPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (adminPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (passwordStrength.score < 2) {
      setError("Password must be stronger (mix of uppercase, lowercase, numbers, and symbols)");
      return;
    }

    setLoading(true);

    try {
      const result = await customSignup({
        companyName,
        industry,
        timezone,
        adminName,
        adminEmail,
        adminPassword,
        adminPhone,
        adminDOB,
        companySize,
        website,
        contactPerson,
        companyEmail,
        additionalInfo,
        emailProvider,
        calendarService,
      });

      if (!result.success) {
        setError(result.error || "Signup failed");
        setLoading(false);
        return;
      }

      // Auto-login and redirect to onboarding flow
      localStorage.setItem("userRole", "admin");
      localStorage.setItem("userEmail", adminEmail);
      localStorage.setItem("userName", adminName);
      localStorage.setItem("userId", result.userId);
      localStorage.setItem("userOrganization", result.orgId);
      localStorage.setItem("organizationName", companyName);
      localStorage.setItem("onboardingStep", "welcome");
      
      // Save company details for onboarding
      localStorage.setItem("onboardingData", JSON.stringify({
        company: {
          name: companyName,
          industry: industry,
          size: companySize,
          location: "",
          emailProvider: emailProvider,
          calendarService: calendarService,
        },
        admin: { name: adminName, email: adminEmail, phone: adminPhone, password: "" },
        managers: [],
        employees: [],
        crm: crmPortal,
        email: emailProvider,
        calendar: calendarService,
      }));

      navigate("/onboarding");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const industries = [
    "Technology/SaaS",
    "Finance/Banking",
    "Healthcare/Pharma",
    "Retail/E-Commerce",
    "Manufacturing",
    "Education",
    "Real Estate",
    "Consulting",
    "Insurance",
    "Telecommunications",
    "Media/Entertainment",
    "Logistics/Supply Chain",
    "Energy/Utilities",
    "Government",
    "Non-Profit",
    "Hospitality",
    "Legal Services",
    "Accounting/Bookkeeping",
    "Other",
  ];

  const crmPortals = [
    "Salesforce",
    "HubSpot",
    "Microsoft Dynamics",
    "Zoho CRM",
    "Pipedrive",
    "Freshsales",
    "Insightly",
    "Tableau CRM",
    "Agile CRM",
    "Copper",
    "Vtiger",
    "No CRM (Planning to implement)",
    "Other",
  ];

  const sizes = ["1-10", "11-50", "51-200", "201-500", "500+"];

  const emailProviders = ["Gmail", "Outlook", "Zoho Mail", "Custom Domain", "Other"];
  const calendarServices = ["Google Calendar", "Outlook Calendar", "Calendly", "Other"];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl py-8">
        <Card className="bg-white border border-gray-200 p-8 shadow-lg rounded-2xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-8">
              <img 
                src="/assets/tasknova-logo.png" 
                alt="Logo" 
                className="h-20 w-auto"
              />
            </div>
            <p className="text-gray-600 text-sm mb-6 max-w-sm mx-auto">Set up your organization and get started with AI-powered revenue intelligence</p>
            
            {/* Progress Indicator */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all ${
                step === "details" ? "bg-blue-600 text-white" : "bg-green-100 text-green-700 border border-green-300"
              }`}>
                {step === "admin" ? <CheckCircle2 size={20} /> : "1"}
              </div>
              <div className={`h-1 w-12 transition-all ${
                step === "admin" ? "bg-blue-600" : "bg-gray-300"
              }`}></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all ${
                step === "admin" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600 border border-gray-300"
              }`}>
                2
              </div>
            </div>
            <p className="text-gray-600 text-xs mt-3 font-medium">
              {step === "details" ? "Company Details" : "Admin Account Setup"}
            </p>
          </div>

          {/* Back Button */}
          <button
            onClick={() => (step === "details" ? navigate("/") : setStep("details"))}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-all hover:gap-3"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">{step === "details" ? "Back to home" : "Back to company details"}</span>
          </button>

          {/* Step 1: Company Details */}
          {step === "details" && (
            <form onSubmit={handleOrgSubmit} className="space-y-4 animate-fadeIn">
              {/* Company Name - Full Width */}
              <div className="group">
                <Label htmlFor="companyName" className="text-sm font-semibold text-gray-900 mb-2 block">
                  Company Name <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="companyName"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Acme Corporation"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                  required
                />
              </div>

              {/* Industry & Company Size - 2 Column */}
              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <Label htmlFor="industry" className="text-sm font-semibold text-gray-900 mb-2 block">
                    Industry <span className="text-red-600">*</span>
                  </Label>
                  <select
                    id="industry"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none"
                    required
                  >
                    <option value="">Select industry</option>
                    {industries.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                  ))}
                </select>
              </div>

                <div className="group">
                  <Label htmlFor="companySize" className="text-sm font-semibold text-gray-900 mb-2 block">
                    Company Size
                  </Label>
                  <select
                    id="companySize"
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none"
                  >
                    <option value="">Select size</option>
                    {sizes.map((size) => (
                      <option key={size} value={size}>
                        {size} employees
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Timezone & CRM Portal - 2 Column */}
              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <Label htmlFor="timezone" className="text-sm font-semibold text-gray-900 mb-2 block">
                    Timezone
                  </Label>
                  <select
                    id="timezone"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none"
                  >
                    <option value="UTC">UTC</option>
                    <option value="EST">EST (UTC-5)</option>
                    <option value="CST">CST (UTC-6)</option>
                    <option value="MST">MST (UTC-7)</option>
                    <option value="PST">PST (UTC-8)</option>
                    <option value="IST">IST (UTC+5:30)</option>
                    <option value="SGT">SGT (UTC+8)</option>
                  </select>
                </div>

                <div className="group">
                  <Label htmlFor="crmPortal" className="text-sm font-semibold text-gray-900 mb-2 block">
                    CRM Portal <span className="text-red-600">*</span>
                  </Label>
                  <select
                    id="crmPortal"
                    value={crmPortal}
                    onChange={(e) => setCrmPortal(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none"
                    required
                  >
                    <option value="">Select CRM</option>
                    {crmPortals.map((crm) => (
                      <option key={crm} value={crm}>
                        {crm}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Email Provider & Calendar Service - 2 Column */}
              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <Label htmlFor="emailProvider" className="text-sm font-semibold text-gray-900 mb-2 block">
                    Email Service
                  </Label>
                  <select
                    id="emailProvider"
                    value={emailProvider}
                    onChange={(e) => setEmailProvider(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none"
                  >
                    <option value="">Select email service</option>
                    {emailProviders.map((provider) => (
                      <option key={provider} value={provider}>
                        {provider}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="group">
                  <Label htmlFor="calendarService" className="text-sm font-semibold text-gray-900 mb-2 block">
                    Calendar & Meetings
                  </Label>
                  <select
                    id="calendarService"
                    value={calendarService}
                    onChange={(e) => setCalendarService(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none"
                  >
                    <option value="">Select calendar</option>
                    {calendarServices.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Company Email & Contact Person - 2 Column */}
              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <Label htmlFor="companyEmail" className="text-sm font-semibold text-gray-900 mb-2 block">
                    Company Email <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    placeholder="contact@company.com"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                    required
                  />
                </div>

                <div className="group">
                  <Label htmlFor="contactPerson" className="text-sm font-semibold text-gray-900 mb-2 block">
                    Contact Person <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="contactPerson"
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Website - Full Width */}
              <div className="group">
                <Label htmlFor="website" className="text-sm font-semibold text-gray-900 mb-2 block">
                  Company Website
                </Label>
                <Input
                  id="website"
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://www.company.com"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              {/* Additional Info - Full Width */}
              <div className="group">
                <Label htmlFor="additionalInfo" className="text-sm font-semibold text-gray-900 mb-2 block">
                  Additional Information
                </Label>
                <textarea
                  id="additionalInfo"
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="Key details about your business..."
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                  rows={3}
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-slideDown">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-red-700 font-medium">{error}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0 h-11 font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
              >
                Continue to Admin Account
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          )}

          {/* Step 2: Admin Account */}
          {step === "admin" && (
            <form onSubmit={handleAdminSubmit} className="space-y-4 animate-fadeIn">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-gray-900 font-medium">
                  Organization: <span className="text-blue-700 font-bold">{companyName}</span>
                </p>
                <p className="text-xs text-gray-600 mt-1">These credentials will be your admin account</p>
              </div>

              <div className="group">
                <Label htmlFor="adminName" className="text-sm font-semibold text-gray-900 mb-2 block">
                  Full Name <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="adminName"
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <Label htmlFor="adminPhone" className="text-sm font-semibold text-gray-900 mb-2 block">
                    Phone <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="adminPhone"
                    type="tel"
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                    required
                  />
                </div>

                <div className="group">
                  <Label htmlFor="adminDOB" className="text-sm font-semibold text-gray-900 mb-2 block">
                    Date of Birth <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="adminDOB"
                    type="date"
                    value={adminDOB}
                    onChange={(e) => setAdminDOB(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    min="1920-01-01"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer hover:border-gray-400"
                    required
                  />
                </div>
              </div>

              <div className="group">
                <Label htmlFor="adminEmail" className="text-sm font-semibold text-gray-900 mb-2 block">
                  Email Address <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@company.com"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                  required
                />
              </div>

              <div className="group">
                <Label htmlFor="adminPassword" className="text-sm font-semibold text-gray-900 mb-2 flex items-center justify-between">
                  Password <span className="text-red-600">*</span>
                  {adminPassword && (
                    <span className={`text-xs font-semibold ${passwordStrength.color}`}>
                      {passwordStrength.label}
                    </span>
                  )}
                </Label>
                <div className="relative">
                  <Input
                    id="adminPassword"
                    type={showPassword ? "text" : "password"}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm pr-10 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {adminPassword && (
                  <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${
                      passwordStrength.score <= 1 ? "w-1/4 bg-red-500" : 
                      passwordStrength.score === 2 ? "w-1/2 bg-yellow-500" : 
                      passwordStrength.score === 3 ? "w-3/4 bg-blue-500" : 
                      "w-full bg-green-500"
                    }`}></div>
                  </div>
                )}
              </div>

              <div className="group">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-900 mb-2 flex items-center justify-between">
                  Confirm Password <span className="text-red-600">*</span>
                  {confirmPassword && adminPassword === confirmPassword && (
                    <span className="text-xs font-semibold text-green-700 flex items-center gap-1">
                      <CheckCircle2 size={14} /> Match
                    </span>
                  )}
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm pr-10 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-slideDown">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-red-700 font-medium">{error}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white border-0 h-11 font-semibold transition-all shadow-md hover:shadow-lg disabled:shadow-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Creating organization...
                  </>
                ) : (
                  <>
                    Create Organization
                    <ChevronRight size={18} />
                  </>
                )}
              </Button>
            </form>
          )}

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-gray-500 border-t border-gray-700 pt-6">
            <p>
              Already have an account?{" "}
              <button onClick={() => navigate("/login")} className="text-blue-400 hover:text-blue-300">
                Sign In
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
