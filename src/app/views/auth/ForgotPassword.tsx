import { useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { X, Mail, CheckCircle } from "lucide-react";
import { supabase } from "../../../lib/supabase";

interface ForgotPasswordProps {
  onClose: () => void;
}

export function ForgotPassword({ onClose }: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    setLoading(true);

    try {
      // Get Supabase URL from the client instance
      const supabaseUrl = supabase.supabaseUrl;
      
      if (!supabaseUrl) {
        throw new Error("Supabase URL not configured");
      }
      
      console.log("Calling:", `${supabaseUrl}/functions/v1/send-reset-email`);
      
      // Send email via Edge Function (will validate email exists and handle DB)
      const response = await fetch(`${supabaseUrl}/functions/v1/send-reset-email`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || `Failed to send reset email (${response.status})`);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setEmail("");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred. Please try again.";
      setError(errorMessage);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to <span className="font-medium">{email}</span>. Please check your inbox and click the link to reset your password.
            </p>
            <Button
              onClick={onClose}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg"
            >
              Back to Login
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-gray-600 text-sm mb-4">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="reset-email" className="text-gray-700 font-medium">
              Email Address
            </Label>
            <div className="relative">
              <Input
                id="reset-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition-all duration-300"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>

          {/* Back to Login */}
          <button
            type="button"
            onClick={onClose}
            className="w-full text-center text-gray-600 hover:text-gray-700 text-sm font-medium py-2"
          >
            Back to Login
          </button>
        </form>
      </Card>
    </div>
  );
}
