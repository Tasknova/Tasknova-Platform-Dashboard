import { useState } from "react";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Building2, MapPin } from "lucide-react";

interface Step1Props {
  data: any;
  onUpdate: (data: any) => void;
}

export default function OnboardingStep1({ data, onUpdate }: Step1Props) {
  const industries = [
    "Technology/SaaS", "Finance/Banking", "Healthcare/Pharma", "Retail/E-Commerce",
    "Manufacturing", "Education", "Real Estate", "Consulting", "Insurance",
    "Telecommunications", "Media/Entertainment", "Logistics/Supply Chain",
    "Energy/Utilities", "Government", "Non-Profit", "Hospitality", "Legal Services",
    "Accounting/Bookkeeping", "Other"
  ];

  const emailProviders = ["Gmail", "Outlook", "Zoho Mail", "Custom Domain", "Other"];
  const calendarServices = ["Google Calendar", "Outlook Calendar", "Calendly", "Other"];
  const sizes = ["1-10", "11-50", "51-200", "201-500", "500+"];
  const locations = ["USA", "Canada", "UK", "Europe", "Asia", "Australia", "Other"];

  return (
    <Card className="bg-white border border-gray-200 p-8 rounded-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Information</h1>
        <p className="text-gray-600">Tell us about your organization</p>
      </div>

      <div className="space-y-5">
        {/* Company Name */}
        <div className="group">
          <Label htmlFor="companyName" className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Building2 size={16} className="text-blue-600" />
            Company Name <span className="text-red-600">*</span>
          </Label>
          <Input
            id="companyName"
            type="text"
            value={data.name || ""}
            onChange={(e) => onUpdate({ ...data, name: e.target.value })}
            placeholder="Acme Corporation"
            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
            required
          />
        </div>

        {/* Industry & Company Size */}
        <div className="grid grid-cols-2 gap-4">
          <div className="group">
            <Label htmlFor="industry" className="text-sm font-semibold text-gray-900 mb-2 block">
              Industry <span className="text-red-600">*</span>
            </Label>
            <select
              id="industry"
              value={data.industry || ""}
              onChange={(e) => onUpdate({ ...data, industry: e.target.value })}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              required
            >
              <option value="">Select industry</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>

          <div className="group">
            <Label htmlFor="size" className="text-sm font-semibold text-gray-900 mb-2 block">
              Company Size
            </Label>
            <select
              id="size"
              value={data.size || ""}
              onChange={(e) => onUpdate({ ...data, size: e.target.value })}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">Select size</option>
              {sizes.map((size) => (
                <option key={size} value={size}>{size} employees</option>
              ))}
            </select>
          </div>
        </div>

        {/* Location & Email Provider */}
        <div className="grid grid-cols-2 gap-4">
          <div className="group">
            <Label htmlFor="location" className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <MapPin size={16} className="text-blue-600" />
              Location
            </Label>
            <select
              id="location"
              value={data.location || ""}
              onChange={(e) => onUpdate({ ...data, location: e.target.value })}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">Select location</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div className="group">
            <Label htmlFor="emailProvider" className="text-sm font-semibold text-gray-900 mb-2 block">
              Email Service
            </Label>
            <select
              id="emailProvider"
              value={data.emailProvider || ""}
              onChange={(e) => onUpdate({ ...data, emailProvider: e.target.value })}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">Select email service</option>
              {emailProviders.map((provider) => (
                <option key={provider} value={provider}>{provider}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Calendar Service */}
        <div className="group">
          <Label htmlFor="calendarService" className="text-sm font-semibold text-gray-900 mb-2 block">
            Calendar & Meetings Service
          </Label>
          <select
            id="calendarService"
            value={data.calendarService || ""}
            onChange={(e) => onUpdate({ ...data, calendarService: e.target.value })}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">Select calendar service</option>
            {calendarServices.map((service) => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
        </div>

        {/* Info Card */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            💡 These selections will help us optimize your setup and provide relevant integrations.
          </p>
        </div>
      </div>
    </Card>
  );
}
