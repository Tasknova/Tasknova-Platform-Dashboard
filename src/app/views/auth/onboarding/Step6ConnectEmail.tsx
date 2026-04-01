import { useState } from "react";
import { Card } from "../../../components/ui/card";
import { CheckCircle2, Circle } from "lucide-react";

interface Step6Props {
  data: any;
  onUpdate: (data: any) => void;
}

export default function OnboardingStep6({ data, onUpdate }: Step6Props) {
  const emailProviders = [
    { id: "gmail", name: "Gmail", icon: "📧", description: "Google Workspace email" },
    { id: "outlook", name: "Outlook", icon: "📨", description: "Microsoft 365 email" },
    { id: "zoho", name: "Zoho Mail", icon: "🟠", description: "Zoho workspace email" },
    { id: "custom", name: "Custom Domain", icon: "🔐", description: "Your own email server" },
    { id: "other", name: "Other", icon: "❓", description: "Other email provider" }
  ];

  const selectedEmail = data.emailProvider || null;
  const selectedEmailData = emailProviders.find(p => p.id === selectedEmail);
  const otherEmails = emailProviders.filter(p => p.id !== selectedEmail);

  return (
    <Card className="bg-white border border-gray-200 p-8 rounded-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Connect Email Service</h1>
        <p className="text-gray-600">Enable email integration for your team</p>
      </div>

      <div className="space-y-6">
        {/* Selected Email Provider - Highlighted */}
        {selectedEmailData && (
          <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-600 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <span className="text-5xl">{selectedEmailData.icon}</span>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedEmailData.name}</h3>
                  <p className="text-sm text-gray-600">{selectedEmailData.description}</p>
                  <p className="text-sm font-medium text-blue-600 mt-1">
                    Status: {data.emailConnected ? "✅ Connected" : "⏳ Ready to connect"}
                  </p>
                </div>
              </div>
              <CheckCircle2 size={32} className="text-blue-600" />
            </div>

            {!data.emailConnected && (
              <button
                onClick={() => onUpdate({ ...data, emailConnected: true })}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors text-lg"
              >
                🔗 Connect {selectedEmailData.name}
              </button>
            )}

            {data.emailConnected && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                <p className="text-sm font-medium text-green-700">✅ {selectedEmailData.name} connected successfully!</p>
              </div>
            )}

            <p className="text-xs text-gray-600 mt-3 text-center">
              You'll be redirected to {selectedEmailData.name} to authorize the connection
            </p>
          </div>
        )}

        {/* Other Email Providers - Less Highlighted */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-700">Or choose a different email service:</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {otherEmails.map((provider) => (
              <button
                key={provider.id}
                onClick={() => onUpdate({ ...data, emailProvider: provider.id, emailConnected: false })}
                className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300 transition-all text-left"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-3xl">{provider.icon}</span>
                  <Circle size={18} className="text-gray-300" />
                </div>
                <h3 className="font-medium text-sm text-gray-900">{provider.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{provider.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">With email integration you get:</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <span className="text-green-600 font-bold">✓</span>
              Email sync and search
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600 font-bold">✓</span>
              Meeting scheduling
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600 font-bold">✓</span>
              Calendar sync for calls
            </li>
          </ul>
        </div>

        {/* Info Card */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            💡 Email integration is optional. You can always connect it later in settings.
          </p>
        </div>
      </div>
    </Card>
  );
}
