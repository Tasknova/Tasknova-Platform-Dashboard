import { useState } from "react";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { CheckCircle2, Circle } from "lucide-react";

interface Step5Props {
  data: any;
  onUpdate: (data: any) => void;
}

export default function OnboardingStep5({ data, onUpdate }: Step5Props) {
  const crmOptions = [
    { id: "salesforce", name: "Salesforce", icon: "☁️", description: "Leading enterprise CRM" },
    { id: "hubspot", name: "HubSpot", icon: "🟠", description: "All-in-one platform" },
    { id: "microsoft", name: "Microsoft Dynamics", icon: "💙", description: "Microsoft enterprise CRM" },
    { id: "zoho", name: "Zoho CRM", icon: "🔵", description: "Affordable & scalable" },
    { id: "pipedrive", name: "Pipedrive", icon: "🟢", description: "Sales pipeline focus" },
    { id: "freshsales", name: "Freshsales", icon: "💚", description: "AI-powered sales" },
    { id: "copper", name: "Copper", icon: "🟠", description: "CRM for G Suite" },
    { id: "insightly", name: "Insightly", icon: "🔷", description: "Visual CRM" },
    { id: "keap", name: "Keap", icon: "🔴", description: "Small business sales" },
    { id: "vtiger", name: "Vtiger", icon: "⚪", description: "Open-source CRM" },
    { id: "agile", name: "Agile CRM", icon: "💜", description: "Customer engagement" },
    { id: "capsule", name: "Capsule", icon: "🟢", description: "Simple CRM" },
    { id: "other", name: "Other", icon: "❓", description: "Custom integration" }
  ];

  const selectedCRM = data.crmPortal || null;
  const selectedCRMData = crmOptions.find(c => c.id === selectedCRM);
  const otherCRMs = crmOptions.filter(c => c.id !== selectedCRM);

  return (
    <Card className="bg-white border border-gray-200 p-8 rounded-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Connect Your CRM</h1>
        <p className="text-gray-600">Link your sales CRM to sync data and manage pipelines</p>
      </div>

      <div className="space-y-6">
        {/* Selected CRM - Highlighted */}
        {selectedCRMData && (
          <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-600 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <span className="text-5xl">{selectedCRMData.icon}</span>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedCRMData.name}</h3>
                  <p className="text-sm text-gray-600">{selectedCRMData.description}</p>
                  <p className="text-sm font-medium text-blue-600 mt-1">
                    Status: {data.crmConnected ? "✅ Connected" : "⏳ Ready to connect"}
                  </p>
                </div>
              </div>
              <CheckCircle2 size={32} className="text-blue-600" />
            </div>

            {!data.crmConnected && (
              <button
                onClick={() => onUpdate({ ...data, crmConnected: true })}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors text-lg"
              >
                🔗 Connect {selectedCRMData.name}
              </button>
            )}

            {data.crmConnected && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                <p className="text-sm font-medium text-green-700">✅ {selectedCRMData.name} connected successfully!</p>
              </div>
            )}

            <p className="text-xs text-gray-600 mt-3 text-center">
              You'll be redirected to {selectedCRMData.name} to authorize the connection
            </p>
          </div>
        )}

        {/* Other CRM Options - Less Highlighted */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-700">Or choose a different CRM:</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {otherCRMs.map((crm) => (
              <button
                key={crm.id}
                onClick={() => onUpdate({ ...data, crmPortal: crm.id, crmConnected: false })}
                className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300 transition-all text-left"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-3xl">{crm.icon}</span>
                  <Circle size={18} className="text-gray-300" />
                </div>
                <h3 className="font-medium text-sm text-gray-900">{crm.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{crm.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Info Card */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            💡 Connecting your CRM is optional. You can skip this step and configure it later in settings.
          </p>
        </div>
      </div>
    </Card>
  );
}
