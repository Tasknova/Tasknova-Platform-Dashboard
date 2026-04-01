import { useState } from "react";
import { Card } from "../../../components/ui/card";
import { CheckCircle2, Circle } from "lucide-react";

interface Step7Props {
  data: any;
  onUpdate: (data: any) => void;
}

export default function OnboardingStep7({ data, onUpdate }: Step7Props) {
  const calendarServices = [
    { id: "google", name: "Google Calendar", icon: "📅", description: "Google Workspace calendar" },
    { id: "outlook", name: "Outlook Calendar", icon: "📆", description: "Microsoft 365 calendar" },
    { id: "calendly", name: "Calendly", icon: "🔗", description: "Scheduling assistant" },
    { id: "other", name: "Other", icon: "❓", description: "Other calendar service" }
  ];

  const selectedCalendar = data.calendarService || null;
  const selectedCalendarData = calendarServices.find(s => s.id === selectedCalendar);
  const otherCalendars = calendarServices.filter(s => s.id !== selectedCalendar);

  return (
    <Card className="bg-white border border-gray-200 p-8 rounded-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Connect Calendar Service</h1>
        <p className="text-gray-600">Sync calendars for automatic meeting and call scheduling</p>
      </div>

      <div className="space-y-6">
        {/* Selected Calendar - Highlighted */}
        {selectedCalendarData && (
          <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-600 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <span className="text-5xl">{selectedCalendarData.icon}</span>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedCalendarData.name}</h3>
                  <p className="text-sm text-gray-600">{selectedCalendarData.description}</p>
                  <p className="text-sm font-medium text-blue-600 mt-1">
                    Status: {data.calendarConnected ? "✅ Connected" : "⏳ Ready to connect"}
                  </p>
                </div>
              </div>
              <CheckCircle2 size={32} className="text-blue-600" />
            </div>

            {!data.calendarConnected && (
              <button
                onClick={() => onUpdate({ ...data, calendarConnected: true })}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors text-lg"
              >
                🔗 Connect {selectedCalendarData.name}
              </button>
            )}

            {data.calendarConnected && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                <p className="text-sm font-medium text-green-700">✅ {selectedCalendarData.name} connected successfully!</p>
              </div>
            )}

            <p className="text-xs text-gray-600 mt-3 text-center">
              You'll be redirected to {selectedCalendarData.name} to authorize the connection
            </p>
          </div>
        )}

        {/* Other Calendar Services - Less Highlighted */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-700">Or choose a different calendar service:</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {otherCalendars.map((service) => (
              <button
                key={service.id}
                onClick={() => onUpdate({ ...data, calendarService: service.id, calendarConnected: false })}
                className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300 transition-all text-left"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-3xl">{service.icon}</span>
                  <Circle size={18} className="text-gray-300" />
                </div>
                <h3 className="font-medium text-sm text-gray-900">{service.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{service.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">With calendar integration you get:</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <span className="text-green-600 font-bold">✓</span>
              Automatic meeting detection
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600 font-bold">✓</span>
              Call recording scheduling
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600 font-bold">✓</span>
              Availability sync for team
            </li>
          </ul>
        </div>

        {/* Completion Info */}
        <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
          <h4 className="text-sm font-semibold text-green-900 mb-2">🎉 Almost there!</h4>
          <p className="text-sm text-green-800">
            Click "Complete Setup" below to finish onboarding. You can configure more integrations anytime in your workspace settings.
          </p>
        </div>

        {/* Info Card */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            💡 Calendar integration is optional. You can skip this and add it later in settings.
          </p>
        </div>
      </div>
    </Card>
  );
}
