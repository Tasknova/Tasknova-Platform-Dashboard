import { useState, useEffect, ChangeEvent } from "react";
import {
  Mail,
  Search,
  Filter,
  Download,
  RefreshCw,
  Clock,
  AlertCircle,
  CheckCircle,
  Star,
  Trash2,
  MoreVertical,
  X,
  Calendar,
  Settings,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { supabase } from "../../../lib/supabase";
import {
  exchangeGmailCode,
  fetchGmailEmails as gmailApiFetchEmails,
  refreshGmailToken,
  disconnectGmail,
  getStoredEmails,
  checkGmailConnection,
} from "../../../lib/gmailApi";

interface Email {
  id: string;
  from: string;
  fromEmail: string;
  subject: string;
  body: string;
  date: string;
  isRead: boolean;
  isStarred: boolean;
  isImportant: boolean;
  tags: string[];
  type: "client" | "normal" | "filtered_out";
}

interface GoogleTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}

interface GmailMessage {
  id: string;
  threadId: string;
  labelIds?: string[];
  snippet: string;
  internalDate: string;
  payload?: {
    headers?: Array<{ name: string; value: string }>;
    parts?: any[];
    body?: { data: string };
  };
}

interface GmailThread {
  id: string;
  historyId: string;
  messages: GmailMessage[];
}

const GMAIL_OAUTH_RESULT_KEY = "gmail_oauth_result";
const LIVE_SYNC_INTERVAL_MS = 30000;

function syncGmailConnectionStatus(connected: boolean): void {
  localStorage.setItem("gmailConnected", connected ? "true" : "false");
  window.dispatchEvent(new Event("gmail-status-changed"));
}

function decodeHtmlEntities(content: string): string {
  if (!content || typeof window === "undefined") return content;
  const textarea = document.createElement("textarea");
  textarea.innerHTML = content;
  return textarea.value;
}

function stripHtml(content: string): string {
  if (!content || typeof window === "undefined") return content;
  const parsed = new DOMParser().parseFromString(content, "text/html");
  return (parsed.body?.textContent || "").replace(/\s+/g, " ").trim();
}

function isHtmlContent(content: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(content || "");
}

function getEmailPreview(content: string): string {
  const value = isHtmlContent(content) ? stripHtml(content) : content;
  return decodeHtmlEntities(value || "").trim();
}

function formatEmailDate(dateValue: string): string {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;
  return date.toLocaleString();
}

const URL_REGEX = /https?:\/\/[^\s<>")]+/gi;

function sortEmailsByDate(items: Email[]): Email[] {
  return [...items].sort((a, b) => {
    const aTime = new Date(a.date).getTime();
    const bTime = new Date(b.date).getTime();
    return (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime);
  });
}

function extractEmailLinks(content: string): string[] {
  const links = new Set<string>();

  if (!content) return [];

  if (typeof window !== "undefined" && isHtmlContent(content)) {
    const parsed = new DOMParser().parseFromString(content, "text/html");
    parsed.querySelectorAll("a[href]").forEach((anchor) => {
      const href = anchor.getAttribute("href") || "";
      if (/^https?:\/\//i.test(href)) links.add(href.trim());
    });
  }

  const previewText = getEmailPreview(content);
  (previewText.match(URL_REGEX) || []).forEach((url) => links.add(url.trim()));

  return Array.from(links);
}

function getReadableEmailBody(content: string): string {
  const previewText = getEmailPreview(content);
  const cleaned = previewText.replace(URL_REGEX, " ").replace(/\s+/g, " ").trim();

  if (cleaned.length >= 24) return cleaned;
  return previewText;
}

function isLinkHeavyContent(content: string): boolean {
  const previewText = getEmailPreview(content);
  const urls = previewText.match(URL_REGEX) || [];
  if (urls.length === 0) return false;

  const nonUrlText = previewText.replace(URL_REGEX, " ").replace(/\s+/g, " ").trim();
  const urlCharRatio = urls.join("").length / Math.max(previewText.length, 1);
  return (urls.length >= 3 && nonUrlText.length < 120) || urlCharRatio > 0.4;
}

function getEmailCardPreview(content: string): string {
  const readable = getReadableEmailBody(content);
  if (!readable) return "Mostly links or rich-content email. Open to view details.";
  return readable;
}

function isLikelyImportantEmail(email: Email): boolean {
  if (email.isImportant || email.type === "client") return true;
  if (email.type === "filtered_out") return false;

  const combinedText = `${email.subject} ${getEmailPreview(email.body)}`.toLowerCase();
  const fromAddress = (email.fromEmail || "").toLowerCase();

  const noiseSenderPattern = /no-reply|noreply|newsletter|updates|notifications|mailer/;
  const importantKeywordPattern =
    /action required|follow up|follow-up|meeting|demo|proposal|contract|invoice|payment|deadline|quote|approval|urgent|next steps/;

  if (importantKeywordPattern.test(combinedText)) return true;
  if (noiseSenderPattern.test(fromAddress) && !importantKeywordPattern.test(combinedText)) return false;

  return email.isStarred;
}

function getImportantEmails(items: Email[]): Email[] {
  return items.filter((email) => isLikelyImportantEmail(email));
}

export function Emails() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [importantEmails, setImportantEmails] = useState<Email[]>([]);
  const [clientEmails, setClientEmails] = useState<Email[]>([]);
  const [filteredEmails, setFilteredEmails] = useState<Email[]>([]);
  const [allEmails, setAllEmails] = useState<Email[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [daysToFetch, setDaysToFetch] = useState(7);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"important" | "all" | "client" | "filtered">("important");
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<string | null>(null);

  // Check if Gmail is connected on component mount
  useEffect(() => {
    const initializeEmails = async () => {
      try {
        // Try to load stored emails and check Gmail connection
        const isConnected = await checkGmailConnection();
        setIsConnected(isConnected);
        syncGmailConnectionStatus(isConnected);
        
        if (isConnected) {
          await loadStoredEmails();
        }
      } catch (error) {
        // Silently fail - user may not be logged in yet
        console.debug("Skipped email initialization:", error);
      }
    };

    initializeEmails();
  }, []);

  useEffect(() => {
    if (!isConnected) return;

    const timer = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      void fetchGmailEmails({ auto: true, silent: true });
    }, LIVE_SYNC_INTERVAL_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, [isConnected, daysToFetch]);

  const handleCheckConnection = async () => {
    try {
      const isConnected = await checkGmailConnection();
      setIsConnected(isConnected);
      syncGmailConnectionStatus(isConnected);
      
      if (isConnected) {
        // Load emails if connected
        loadStoredEmails();
      }
    } catch (error) {
      console.error("Error checking Gmail connection:", error);
    }
  };

  const handleConnectGmail = async () => {
    try {
      localStorage.setItem("gmail_auth_pending", "true");
      localStorage.removeItem(GMAIL_OAUTH_RESULT_KEY);

      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "534368733016-ekbqo8a4cslrpu01ohr18jqa9o5ah2p0.apps.googleusercontent.com";
      const redirectUri = `${window.location.origin}/email-callback`;
      const scope = encodeURIComponent("https://www.googleapis.com/auth/gmail.readonly");
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;

      const popup = window.open(authUrl, "gmail-auth", "width=500,height=600");

      if (!popup) {
        alert("Please enable popups and try again.");
        return;
      }

      let isHandled = false;
      let isProcessingExchange = false;

      const cleanup = () => {
        if (isHandled) return;
        isHandled = true;
        isProcessingExchange = false;
        window.removeEventListener("message", handleMessage);
        window.clearInterval(pollId);
        localStorage.removeItem("gmail_auth_pending");
        localStorage.removeItem(GMAIL_OAUTH_RESULT_KEY);
      };

      const completeOAuth = (payload: { type: "gmail_auth_success"; code: string } | { type: "gmail_auth_error"; error: string }) => {
        if (isHandled || isProcessingExchange) return;

        if (payload.type === "gmail_auth_success") {
          isProcessingExchange = true;

          exchangeGmailCode(payload.code)
            .then(() => {
              setIsConnected(true);
              syncGmailConnectionStatus(true);
              cleanup();

              // Auto-fetch emails after connection
              setTimeout(() => fetchGmailEmails({ auto: true }), 500);
            })
            .catch(async (error) => {
              console.error("Failed to exchange code:", error);

              // Avoid false negatives when a duplicate callback triggers after a successful exchange.
              const alreadyConnected = await checkGmailConnection();
              if (alreadyConnected) {
                setIsConnected(true);
                syncGmailConnectionStatus(true);
                cleanup();
                setTimeout(() => fetchGmailEmails({ auto: true }), 500);
                return;
              }

              cleanup();
              alert(`Authentication failed: ${error.message}`);
            })
            .finally(() => {
              isProcessingExchange = false;
            });
        } else {
          cleanup();
          alert(`Authentication failed: ${payload.error}`);
        }
      };

      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;

        if (event.data.type === "gmail_auth_success" || event.data.type === "gmail_auth_error") {
          completeOAuth(event.data);
        }
      };

      window.addEventListener("message", handleMessage);

      const pollId = window.setInterval(() => {
        if (isHandled) return;

        const resultRaw = localStorage.getItem(GMAIL_OAUTH_RESULT_KEY);
        if (!resultRaw) return;

        try {
          const result = JSON.parse(resultRaw) as {
            type?: string;
            code?: string;
            error?: string;
            ts?: number;
          };

          // Ignore stale callback results from older attempts.
          if (result.ts && Date.now() - result.ts > 5 * 60 * 1000) {
            localStorage.removeItem(GMAIL_OAUTH_RESULT_KEY);
            return;
          }

          if (result.type === "gmail_auth_success" && result.code) {
            completeOAuth({ type: "gmail_auth_success", code: result.code });
          } else if (result.type === "gmail_auth_error") {
            completeOAuth({ type: "gmail_auth_error", error: result.error || "Unknown OAuth error" });
          }
        } catch {
          localStorage.removeItem(GMAIL_OAUTH_RESULT_KEY);
        }
      }, 500);
    } catch (error) {
      console.error("Error initiating Gmail connection:", error);
      localStorage.removeItem("gmail_auth_pending");
      alert("Failed to connect Gmail. Please try again.");
    }
  };

  const refreshAccessToken = async () => {
    try {
      await refreshGmailToken();
      setIsConnected(true);
      syncGmailConnectionStatus(true);
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  };

  const fetchGmailEmails = async (options?: { auto?: boolean; silent?: boolean }) => {
    if (options?.auto && isLoading) return;

    let connected = isConnected;
    if (!connected) {
      connected = await checkGmailConnection();
      if (connected) {
        setIsConnected(true);
        syncGmailConnectionStatus(true);
      }
    }

    if (!connected) {
      if (!options?.auto) {
        alert("Please connect your Gmail first");
      }
      return;
    }

    try {
      setIsLoading(true);
      
      // Call Edge Function to fetch and classify emails
      const response = await gmailApiFetchEmails(daysToFetch);
      
      // Map the response emails to Email interface
      const classified: Email[] = (response.emails || []).map((email: any) => ({
        id: email.id,
        from: email.from_name,
        fromEmail: email.from_email,
        subject: email.subject,
        body: email.body,
        date: email.date,
        isRead: email.is_read,
        isStarred: email.is_starred,
        isImportant: email.is_important,
        tags: email.tags || [],
        type: email.email_type,
      }));

      const sortedEmails = sortEmailsByDate(classified);

      // Separate into categories
      setAllEmails(sortedEmails);
      setImportantEmails(getImportantEmails(sortedEmails));
      setClientEmails(sortedEmails.filter((e: Email) => e.type === "client"));
      setFilteredEmails(sortedEmails.filter((e: Email) => e.type === "filtered_out"));
      setEmails(sortedEmails);
      setLastFetchTime(new Date().toLocaleString());
    } catch (error) {
      console.error("Error fetching emails:", error);
      if (!options?.silent) {
        alert("Failed to fetch emails. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadStoredEmails = async () => {
    try {
      const emailsData = await getStoredEmails();

      const parsedEmails: Email[] = (emailsData || []).map((email: any) => ({
        id: email.id,
        from: email.from_name,
        fromEmail: email.from_email,
        subject: email.subject,
        body: email.body,
        date: email.date,
        isRead: email.is_read,
        isStarred: email.is_starred,
        isImportant: email.is_important,
        tags: email.tags || [],
        type: email.email_type,
      }));

      const sortedEmails = sortEmailsByDate(parsedEmails);
      setAllEmails(sortedEmails);
      setImportantEmails(getImportantEmails(sortedEmails));
      setClientEmails(sortedEmails.filter((e: Email) => e.type === "client"));
      setFilteredEmails(sortedEmails.filter((e: Email) => e.type === "filtered_out"));
      setEmails(sortedEmails);
    } catch (error) {
      console.error("Error loading emails:", error);
    }
  };

  const handleDisconnect = async () => {
    try {
      const shouldDisconnect = window.confirm("Disconnect Gmail account?");
      if (!shouldDisconnect) return;

      const shouldDeleteEmails = window.confirm(
        "Do you also want to delete synced emails from Tasknova?\n\nPress OK to delete emails, or Cancel to keep them."
      );

      await disconnectGmail({ deleteEmails: shouldDeleteEmails });
      setIsConnected(false);
      syncGmailConnectionStatus(false);
      setEmails([]);
      setImportantEmails([]);
      setClientEmails([]);
      setFilteredEmails([]);
      setAllEmails([]);

      if (shouldDeleteEmails) {
        alert("Gmail disconnected and synced emails deleted.");
      } else {
        alert("Gmail disconnected. Synced emails were kept in the database.");
      }
    } catch (error) {
      console.error("Error disconnecting Gmail:", error);
      alert("Failed to disconnect Gmail. Please try again.");
    }
  };

  const displayedEmails = (): Email[] => {
    let source: Email[] =
      activeTab === "important"
        ? importantEmails
        : activeTab === "all"
          ? allEmails
          : activeTab === "client"
            ? clientEmails
            : filteredEmails;
    const loweredQuery = searchQuery.toLowerCase();
    
    return source.filter((email: Email) =>
      email.subject.toLowerCase().includes(loweredQuery) ||
      email.from.toLowerCase().includes(loweredQuery) ||
      email.fromEmail.toLowerCase().includes(loweredQuery) ||
      getReadableEmailBody(email.body).toLowerCase().includes(loweredQuery)
    );
  };

  const currentEmails = displayedEmails();
  const emptyTitle =
    activeTab === "important" && allEmails.length > 0
      ? "No important emails found"
      : "No emails found";
  const emptySubtitle = searchQuery
    ? "Try a different search"
    : activeTab === "important" && allEmails.length > 0
      ? "Switch to All Emails to view everything."
      : "Sync your Gmail to get started";

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Mail className="w-6 h-6 text-blue-600" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Emails</h1>
                <p className="text-sm text-gray-600">
                  {isConnected
                    ? `Connected • Last synced: ${lastFetchTime || "Never"} • Live sync every ${LIVE_SYNC_INTERVAL_MS / 1000}s`
                    : "Not connected"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isConnected ? (
                <>
                  <Select value={daysToFetch.toString()} onValueChange={(value: string) => setDaysToFetch(parseInt(value))}>
                    <SelectTrigger className="w-40 h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Today</SelectItem>
                      <SelectItem value="1">Last 1 day</SelectItem>
                      <SelectItem value="7">Last 7 days</SelectItem>
                      <SelectItem value="14">Last 14 days</SelectItem>
                      <SelectItem value="30">Last 30 days</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={fetchGmailEmails}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 h-9 text-sm"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Sync Emails
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleDisconnect}
                    variant="outline"
                    size="sm"
                    className="h-9 text-sm border-red-200 text-red-700 hover:bg-red-50"
                  >
                    Disconnect
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleConnectGmail}
                  className="bg-blue-600 hover:bg-blue-700 h-9 text-sm"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Connect Gmail
                </Button>
              )}
            </div>
          </div>

          {/* Search and Tabs */}
          {isConnected && (
            <div className="flex items-center gap-4 mt-4">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search emails..."
                    value={searchQuery}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    className="pl-10 h-9 text-sm"
                  />
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("important")}
                  className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                    activeTab === "important"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Important ({importantEmails.length})
                </button>
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                    activeTab === "all"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  All Emails ({allEmails.length})
                </button>
                <button
                  onClick={() => setActiveTab("client")}
                  className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                    activeTab === "client"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Client Emails ({clientEmails.length})
                </button>
                <button
                  onClick={() => setActiveTab("filtered")}
                  className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                    activeTab === "filtered"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Filtered ({filteredEmails.length})
                </button>
              </div>
            </div>
          )}
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {!isConnected ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-12 h-12 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Connect Your Gmail</h2>
              <p className="text-gray-600 text-center max-w-sm mb-6">
                Connect your Gmail account to start syncing and organizing your emails. We'll automatically filter out marketing and OTP emails for you.
              </p>
              <Button
                onClick={handleConnectGmail}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Mail className="w-4 h-4 mr-2" />
                Connect Gmail Account
              </Button>

              <div className="mt-12 grid grid-cols-3 gap-8 w-full max-w-lg">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">Auto-Filter</p>
                  <p className="text-xs text-gray-600 mt-1">Marketing & OTP emails removed</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Star className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">Client Priority</p>
                  <p className="text-xs text-gray-600 mt-1">Client emails marked important</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">Custom Duration</p>
                  <p className="text-xs text-gray-600 mt-1">Fetch 0-30 days of emails</p>
                </div>
              </div>
            </div>
          ) : currentEmails.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Mail className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-600">{emptyTitle}</p>
              <p className="text-sm text-gray-500 mt-1">{emptySubtitle}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {currentEmails.map((email) => (
                <div
                  key={email.id}
                  onClick={() => {
                    setSelectedEmail(email);
                    setIsEmailDialogOpen(true);
                  }}
                  className={`p-4 border rounded-lg transition-all hover:border-gray-300 cursor-pointer ${
                    email.isImportant
                      ? "bg-yellow-50 border-yellow-200"
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedEmails.includes(email.id)}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        if (e.target.checked) {
                          setSelectedEmails([...selectedEmails, email.id]);
                        } else {
                          setSelectedEmails(selectedEmails.filter((id: string) => id !== email.id));
                        }
                      }}
                      className="mt-1 rounded border-gray-300"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900 truncate">{email.from}</p>
                            <span className="text-xs text-gray-500 flex-shrink-0">{email.fromEmail}</span>
                          </div>
                          <h3 className="text-sm font-medium text-gray-900 mt-1 truncate">
                            {email.subject}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {getEmailCardPreview(email.body) || "(No preview text)"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {email.isImportant && (
                            <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                              Client
                            </Badge>
                          )}
                          {isLinkHeavyContent(email.body) && (
                            <Badge variant="outline" className="text-xs">
                              Link-heavy
                            </Badge>
                          )}
                          <span className="text-xs text-gray-500">{formatEmailDate(email.date)}</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={(e) => e.stopPropagation()} className="p-1 hover:bg-gray-200 rounded">
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <Dialog
        open={isEmailDialogOpen}
        onOpenChange={(open) => {
          setIsEmailDialogOpen(open);
          if (!open) setSelectedEmail(null);
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="break-words">
              {selectedEmail?.subject || "Email details"}
            </DialogTitle>
            <DialogDescription>
              From {selectedEmail?.from || "Unknown"} ({selectedEmail?.fromEmail || "Unknown"}) • {selectedEmail ? formatEmailDate(selectedEmail.date) : ""}
            </DialogDescription>
          </DialogHeader>

          {selectedEmail && (
            <div className="space-y-3 overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Type: {selectedEmail.type}</Badge>
                <Badge variant="outline">Read: {selectedEmail.isRead ? "Yes" : "No"}</Badge>
                <Badge variant="outline">Starred: {selectedEmail.isStarred ? "Yes" : "No"}</Badge>
                <Badge variant="outline">Important: {selectedEmail.isImportant ? "Yes" : "No"}</Badge>
              </div>

              <div className="rounded-md border bg-white p-4">
                <p className="text-xs font-medium text-gray-700 mb-2">Readable view</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                  {getReadableEmailBody(selectedEmail.body) || "(No readable text)"}
                </p>
                {isLinkHeavyContent(selectedEmail.body) && (
                  <p className="text-xs text-amber-700 mt-2">
                    This email contains many links. A cleaned readable view is shown above.
                  </p>
                )}
              </div>

              {extractEmailLinks(selectedEmail.body).length > 0 && (
                <div className="rounded-md border bg-gray-50 p-3">
                  <p className="text-xs font-medium text-gray-700 mb-2">Links in this email</p>
                  <div className="space-y-1 max-h-36 overflow-y-auto">
                    {extractEmailLinks(selectedEmail.body).slice(0, 12).map((link) => (
                      <a
                        key={link}
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="block text-xs text-blue-700 hover:underline break-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {link}
                      </a>
                    ))}
                    {extractEmailLinks(selectedEmail.body).length > 12 && (
                      <p className="text-xs text-gray-500">
                        +{extractEmailLinks(selectedEmail.body).length - 12} more links
                      </p>
                    )}
                  </div>
                </div>
              )}

              {isHtmlContent(selectedEmail.body) && (
                <details className="rounded-md border bg-white">
                  <summary className="cursor-pointer px-3 py-2 text-sm font-medium text-gray-700">
                    Show original HTML email
                  </summary>
                  <div className="border-t overflow-hidden h-[50vh] bg-white">
                    <iframe
                      title={`email-${selectedEmail.id}`}
                      srcDoc={selectedEmail.body}
                      className="w-full h-full"
                      sandbox=""
                    />
                  </div>
                </details>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
