import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ChevronRight, ChevronLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import OnboardingStep1 from "./onboarding/Step1CompanyInfo";
import OnboardingStep2 from "./onboarding/Step2AdminAccount";
import OnboardingStep3 from "./onboarding/Step3AddManagers";
import OnboardingStep4 from "./onboarding/Step4AddEmployees";
import OnboardingStep5 from "./onboarding/Step5ConnectCRM";
import OnboardingStep6 from "./onboarding/Step6ConnectEmail";
import OnboardingStep7 from "./onboarding/Step7ConnectCalendar";

interface OnboardingData {
  company: {
    name: string;
    industry: string;
    size: string;
    location: string;
    emailProvider: string;
    calendarService: string;
  };
  admin: {
    name: string;
    email: string;
    phone: string;
    password: string;
  };
  managers: Array<{ id: string; name: string; email: string; phone: string; department: string }>;
  employees: Array<{ id: string; name: string; email: string; phone: string; department: string; managerId: string }>;
  crm: string;
  email: string;
  calendar: string;
}

const TOTAL_STEPS = 7;

export function Onboarding() {
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(() => {
    const step = localStorage.getItem("onboardingStep");
    return step === "welcome";
  });
  const [currentStep, setCurrentStep] = useState(3); // Start from step 3 after signup
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(() => {
    const saved = localStorage.getItem("onboardingData");
    return saved ? JSON.parse(saved) : {
      company: {
        name: localStorage.getItem("organizationName") || "",
        industry: "",
        size: "",
        location: "",
        emailProvider: "",
        calendarService: "",
      },
      admin: { name: "", email: "", phone: "", password: "" },
      managers: [],
      employees: [],
      crm: "",
      email: "",
      calendar: "",
    };
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-save progress
  useEffect(() => {
    localStorage.setItem("onboardingData", JSON.stringify(onboardingData));
  }, [onboardingData]);

  const handleWelcomeComplete = () => {
    localStorage.removeItem("onboardingStep");
    setShowWelcome(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateData = (section: keyof OnboardingData, data: any) => {
    setOnboardingData((prev) => ({
      ...prev,
      [section]: data,
    }));
    setError("");
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 3) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const completeOnboarding = async () => {
    setLoading(true);
    try {
      // Save all onboarding data
      localStorage.setItem("onboardingCompleted", "true");
      localStorage.setItem("onboardingData", JSON.stringify(onboardingData));
      localStorage.removeItem("onboardingStep");
      
      // Redirect to dashboard
      navigate("/admin");
    } catch (err) {
      setError("Failed to complete onboarding");
    } finally {
      setLoading(false);
    }
  };

  const progressPercentage = showWelcome ? 0 : ((currentStep - 2) / (TOTAL_STEPS - 2)) * 100;
  const isLastStep = currentStep === TOTAL_STEPS;

  const steps = [
    { number: 1, title: "Company Info", skippable: false },
    { number: 2, title: "Admin Account", skippable: false },
    { number: 3, title: "Add Managers", skippable: true },
    { number: 4, title: "Add Employees", skippable: true },
    { number: 5, title: "Connect CRM", skippable: true },
    { number: 6, title: "Connect Email", skippable: true },
    { number: 7, title: "Connect Calendar", skippable: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Welcome Screen */}
      {showWelcome && (
        <div className="flex items-center justify-center min-h-screen px-6">
          <div className="max-w-2xl w-full animate-fadeIn">
            <div className="text-center mb-12">
              <img 
                src="/assets/tasknova-logo.png" 
                alt="Tasknova" 
                className="h-16 w-auto mx-auto mb-8"
              />
              <h1 className="text-5xl font-bold text-gray-900 mb-4">Welcome to Tasknova</h1>
              <p className="text-xl text-gray-600 mb-8">
                Great! Your account is set up. Now let's get your team ready to go.
              </p>
            </div>

            <Card className="bg-white border border-gray-200 p-12 rounded-2xl mb-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg flex-shrink-0">
                    <CheckCircle2 size={24} className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Company Created</h3>
                    <p className="text-sm text-gray-600 mt-1">{onboardingData.company.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg flex-shrink-0">
                    <CheckCircle2 size={24} className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Admin Account Created</h3>
                    <p className="text-sm text-gray-600 mt-1">{localStorage.getItem("userName")}</p>
                  </div>
                </div>

                <div className="pt-4 mt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Next, we'll help you:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="text-blue-600 font-bold">→</span> Add your team managers
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-600 font-bold">→</span> Add sales representatives
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-600 font-bold">→</span> Connect your CRM & email
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-600 font-bold">→</span> Sync your calendar
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            <Button
              onClick={handleWelcomeComplete}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Let's Get Set Up
              <ChevronRight size={20} />
            </Button>

            <p className="text-center text-sm text-gray-500 mt-6">
              This typically takes 5-10 minutes to complete
            </p>
          </div>
        </div>
      )}

      {/* Onboarding Steps */}
      {!showWelcome && (
        <>
          {/* Header with Logo */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-4xl mx-auto px-6 py-6">
              <div className="flex items-center justify-between mb-8">
                <img 
                  src="/assets/tasknova-logo.png" 
                  alt="Tasknova" 
                  className="h-10 w-auto"
                />
                <span className="text-sm text-gray-600">Step {currentStep - 2} of {TOTAL_STEPS - 2}</span>
              </div>

              {/* Progress Bar - Only show steps 3-7 */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  {steps.slice(2).map((step) => (
                    <div key={step.number} className="flex-1">
                      <div className={`h-1 rounded-full transition-all duration-500 ${
                        step.number < currentStep ? "bg-green-500" : 
                        step.number === currentStep ? "bg-blue-600" : 
                        "bg-gray-200"
                      }`}></div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between">
                  {steps.slice(2).map((step) => (
                    <div key={step.number} className="text-xs">
                      <span className={`font-medium ${
                        step.number <= currentStep ? "text-gray-900" : "text-gray-400"
                      }`}>
                        {step.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="animate-fadeIn">
              {currentStep === 3 && (
                <OnboardingStep3 
                  data={onboardingData}
                  onUpdate={(data) => setOnboardingData(data)}
                />
              )}
              {currentStep === 4 && (
                <OnboardingStep4 
                  data={onboardingData}
                  onUpdate={(data) => setOnboardingData(data)}
                />
              )}
              {currentStep === 5 && (
                <OnboardingStep5 
                  data={onboardingData}
                  onUpdate={(data) => setOnboardingData(data)}
                />
              )}
              {currentStep === 6 && (
                <OnboardingStep6 
                  data={onboardingData}
                  onUpdate={(data) => setOnboardingData(data)}
                />
              )}
              {currentStep === 7 && (
                <OnboardingStep7 
                  data={onboardingData}
                  onUpdate={(data) => setOnboardingData(data)}
                />
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-12 flex items-center justify-between">
              <Button
                onClick={handleBack}
                variant="outline"
                className="flex items-center gap-2"
                disabled={currentStep === 3}
              >
                <ChevronLeft size={18} />
                Back
              </Button>

              {steps[currentStep - 1]?.skippable && currentStep !== 2 && (
                <Button
                  onClick={handleNext}
                  variant="ghost"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Skip for now
                </Button>
              )}

              <Button
                onClick={handleNext}
                disabled={loading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    {isLastStep ? "Finish Setup" : "Continue"}
                    <ChevronRight size={18} />
                  </>
                )}
              </Button>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
