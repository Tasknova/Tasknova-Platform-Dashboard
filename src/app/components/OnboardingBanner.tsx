import { X, Calendar, Database, Users, CreditCard, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

interface OnboardingStatus {
  trialDaysRemaining: number;
  crmConnected: boolean;
  calendarConnected: boolean;
  seatsProvisioned: boolean;
  setupProgress: number;
}

interface OnboardingBannerProps {
  status: OnboardingStatus;
  onDismiss?: () => void;
}

export function OnboardingBanner({ status, onDismiss }: OnboardingBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  if (dismissed) return null;

  const isOnboarding = status.trialDaysRemaining > 0 || !status.crmConnected || !status.calendarConnected || !status.seatsProvisioned;

  if (!isOnboarding) return null;

  const incompleteItems = [
    { label: "CRM not connected", condition: !status.crmConnected, action: "Connect CRM" },
    { label: "Calendar not connected", condition: !status.calendarConnected, action: "Connect Calendar" },
    { label: "Seats not provisioned", condition: !status.seatsProvisioned, action: "Add Team Members" },
  ].filter(item => item.condition);

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-6 flex-1">
        {/* Trial Status */}
        {status.trialDaysRemaining > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-300 animate-pulse" />
            <span className="text-sm font-medium">
              {status.trialDaysRemaining} days left in trial
            </span>
          </div>
        )}

        {/* Setup Progress */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <span className="text-sm font-medium whitespace-nowrap">Setup Progress:</span>
          <div className="flex-1 bg-white/20 rounded-full h-2 overflow-hidden">
            <div
              className="bg-white h-full transition-all duration-500 rounded-full"
              style={{ width: `${status.setupProgress}%` }}
            />
          </div>
          <span className="text-sm font-semibold whitespace-nowrap">{status.setupProgress}%</span>
        </div>

        {/* Quick Status Indicators */}
        <div className="flex items-center gap-3">
          {incompleteItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-xs text-white/90">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-300" />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-2 ml-6">
        {!status.calendarConnected && (
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs bg-white/10 border-white/30 text-white hover:bg-white/20"
          >
            <Calendar className="w-3 h-3 mr-1.5" />
            Connect Calendar
          </Button>
        )}
        {!status.crmConnected && (
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs bg-white/10 border-white/30 text-white hover:bg-white/20"
          >
            <Database className="w-3 h-3 mr-1.5" />
            Connect CRM
          </Button>
        )}
        {!status.seatsProvisioned && (
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs bg-white/10 border-white/30 text-white hover:bg-white/20"
          >
            <Users className="w-3 h-3 mr-1.5" />
            Add Team
          </Button>
        )}
        {status.trialDaysRemaining > 0 && status.trialDaysRemaining <= 7 && (
          <Button
            size="sm"
            className="h-8 text-xs bg-white text-blue-600 hover:bg-white/90 font-semibold"
          >
            <CreditCard className="w-3 h-3 mr-1.5" />
            Start Subscription
          </Button>
        )}
        <button
          onClick={handleDismiss}
          className="p-1 rounded hover:bg-white/10 transition-colors ml-2"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
