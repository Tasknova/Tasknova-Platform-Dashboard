import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { AlertCircle, CheckCircle2, Upload, Trash2 } from "lucide-react";
import { bulkCreateTeamMembers, sendTeamInvite, CreateTeamMemberParams } from "../../lib/auth";
import { supabase } from "../../lib/supabase";

interface BulkUploadResult {
  email: string;
  success: boolean;
  error?: string;
  data?: any;
}

interface CSVBulkUploadProps {
  orgId: string;
  onSuccess?: () => void;
}

export function CSVBulkUpload({ orgId, onSuccess }: CSVBulkUploadProps) {
  const [fileName, setFileName] = useState("");
  const [parsedData, setParsedData] = useState<CreateTeamMemberParams[]>([]);
  const [uploadError, setUploadError] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BulkUploadResult[]>([]);
  const [sendingInvites, setSendingInvites] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [orgName, setOrgName] = useState("");

  const validateCSVData = (
    data: Record<string, any>[]
  ): { valid: CreateTeamMemberParams[]; errors: string[] } => {
    const valid: CreateTeamMemberParams[] = [];
    const errors: string[] = [];

    data.forEach((row, index) => {
      if (!row.email || !row.full_name || !row.role) {
        errors.push(
          `Row ${index + 1}: Missing required fields (email, full_name, role)`
        );
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
        errors.push(`Row ${index + 1}: Invalid email format`);
        return;
      }

      if (!["manager", "team_member"].includes(row.role)) {
        errors.push(`Row ${index + 1}: Invalid role (must be 'manager' or 'team_member')`);
        return;
      }

      valid.push({
        email: row.email.trim(),
        full_name: row.full_name.trim(),
        phone_number: row.phone_number?.trim() || undefined,
        date_of_birth: row.date_of_birth?.trim() || undefined,
        role: row.role as "manager" | "team_member",
        password: row.password?.trim() || undefined,
      });
    });

    return { valid, errors };
  };

  const parseCSV = (text: string) => {
    const lines = text.split("\\n").filter((line) => line.trim());
    if (lines.length < 2) {
      throw new Error("CSV must have header and at least one data row");
    }

    const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const allowedHeaders = [
      "full_name",
      "email",
      "phone_number",
      "date_of_birth",
      "role",
      "password",
    ];

    const unknownHeaders = header.filter((h) => !allowedHeaders.includes(h));
    if (unknownHeaders.length > 0) {
      throw new Error(`Unknown header(s): ${unknownHeaders.join(", ")}`);
    }

    const data: Record<string, string>[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim());
      const row: Record<string, string> = {};
      header.forEach((h, idx) => {
        row[h] = values[idx] || "";
      });
      if (row.email) {
        data.push(row);
      }
    }

    return data;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setUploadError("Please upload a CSV file");
      return;
    }

    setLoading(true);
    setUploadError("");
    setParsedData([]);
    setResults([]);

    try {
      const text = await file.text();
      const csvData = parseCSV(text);
      const { valid, errors } = validateCSVData(csvData);

      if (errors.length > 0) {
        setUploadError(`Validation errors:\\n${errors.join("\\n")}`);
        setLoading(false);
        return;
      }

      setFileName(file.name);
      setParsedData(valid);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Failed to parse CSV");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUsers = async () => {
    setLoading(true);
    setUploadError("");
    setResults([]);

    try {
      const result = await bulkCreateTeamMembers(parsedData, orgId);
      if (!result.success) {
        setUploadError(result.error);
      } else {
        setResults(result.data);
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Failed to create users");
    } finally {
      setLoading(false);
    }
  };

  const handleSendAllInvites = async () => {
    setSendingInvites(true);
    setUploadError("");

    try {
      // Get admin and org info
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const userEmail = localStorage.getItem("userEmail") || user?.email || "";
      const { data: adminData } = await supabase
        .from("users")
        .select("full_name")
        .eq("email", userEmail)
        .single();

      setAdminName(adminData?.full_name || "Admin");

      const { data: orgData } = await supabase
        .from("orgs")
        .select("name")
        .eq("org_id", orgId)
        .single();

      setOrgName(orgData?.name || "Organization");
      const senderEmail = userEmail;
      const loginUrl = `${window.location.origin}/login`;

      // Send invites for successful creations
      const sucessfulUsers = results.filter((r) => r.success);
      for (const userResult of sucessfulUsers) {
        const originalData = parsedData.find((m) => m.email === userResult.email);
        if (originalData && userResult.data?.user_id) {
          await sendTeamInvite(
            userResult.data.user_id,
            userResult.email,
            originalData.full_name,
            originalData.role,
            orgId,
            adminData?.full_name || "Admin",
            orgData?.name || "Organization",
            senderEmail,
            userResult.data.temporaryPassword,
            loginUrl
          );
        }
      }

      // Update results to show sent status
      setResults((prev) =>
        prev.map((r) => ({
          ...r,
          success: r.success ? true : r.success,
        }))
      );

      setTimeout(() => {
        setParsedData([]);
        setResults([]);
        setFileName("");
        onSuccess?.();
      }, 3000);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Failed to send invitations"
      );
    } finally {
      setSendingInvites(false);
    }
  };

  const handleReset = () => {
    setFileName("");
    setParsedData([]);
    setResults([]);
    setUploadError("");
  };

  return (
    <Card className="p-6 bg-white border border-gray-200 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Bulk Upload via CSV</h2>

      {/* CSV Template Info */}
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
        <p className="font-medium mb-2">CSV Format Required:</p>
        <code className="text-xs bg-white p-2 rounded block overflow-x-auto mb-2">
          full_name,email,phone_number,date_of_birth,role,password
        </code>
        <p className="text-xs">
          Role must be: <strong>manager</strong> or <strong>team_member</strong>
        </p>
      </div>

      {uploadError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <span className="text-sm text-red-700 whitespace-pre-line">{uploadError}</span>
        </div>
      )}

      {/* File Upload */}
      {parsedData.length === 0 && results.length === 0 && (
        <div className="mb-4">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">CSV file only</p>
            </div>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={loading}
              className="hidden"
            />
          </label>
        </div>
      )}

      {/* Parsed Data Preview */}
      {parsedData.length > 0 && results.length === 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Preview ({parsedData.length} users)
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-2 px-3 font-medium text-gray-700">Name</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-700">Email</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-700">Role</th>
                </tr>
              </thead>
              <tbody>
                {parsedData.map((user, idx) => (
                  <tr key={idx} className="border-b border-gray-200">
                    <td className="py-2 px-3">{user.full_name}</td>
                    <td className="py-2 px-3">{user.email}</td>
                    <td className="py-2 px-3 capitalize">{user.role.replace("_", " ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Upload Results</p>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {results.map((result, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2 p-2 rounded text-sm ${
                  result.success
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                {result.success ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className={result.success ? "text-green-800" : "text-red-800"}>
                    {result.email}
                  </p>
                  {result.error && (
                    <p className="text-xs text-red-700">{result.error}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        {(parsedData.length > 0 || results.length > 0) && (
          <Button
            onClick={handleReset}
            variant="outline"
            disabled={loading || sendingInvites}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
        )}

        {parsedData.length > 0 && results.length === 0 && (
          <Button
            onClick={handleCreateUsers}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? "Creating..." : `Create ${parsedData.length} Users`}
          </Button>
        )}

        {results.length > 0 && results.some((r) => r.success) && (
          <Button
            onClick={handleSendAllInvites}
            disabled={sendingInvites}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {sendingInvites
              ? "Sending Invites..."
              : `Send Invites to ${results.filter((r) => r.success).length} Users`}
          </Button>
        )}
      </div>
    </Card>
  );
}
