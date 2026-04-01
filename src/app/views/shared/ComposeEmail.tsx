import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  X,
  Minus,
  Maximize2,
  FileText,
  Grid3x3,
  Lightbulb,
  Send,
  Eye,
  Type,
  Paperclip,
  Smile,
  Image as ImageIcon,
  Edit3,
  Link2,
  Trash2,
  Users,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";
import { Button } from "../../components/ui/button";

export function ComposeEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userRole = localStorage.getItem("userRole") || "rep";

  // Get data from URL params
  const emailType = searchParams.get("type") || "deal";
  const dealName = searchParams.get("dealName") || "Deal";
  const company = searchParams.get("company") || "Company";
  const dealId = searchParams.get("dealId") || "";
  const reportId = searchParams.get("reportId") || "";
  const reports = searchParams.get("reports") || "";
  const format = searchParams.get("format") || "pdf";
  const quarter = searchParams.get("quarter") || "Q1 2026";

  // Determine email content based on type
  const getEmailContent = () => {
    switch (emailType) {
      case "pipeline-report":
        return {
          to: userRole === "rep" ? ["Manager"] : ["VP Sales"],
          subject: "Pipeline Report - Q1 2026",
          body: `Hi there,\n\nPlease find attached my pipeline report for Q1 2026.\n\nKey highlights:\n• Total pipeline value: $465K\n• 6 active deals across all stages\n• 2 deals need attention this week\n\nLet me know if you have any questions.\n\nBest regards`
        };
      case "performance-report":
        return {
          to: ["Manager"],
          subject: "Performance Report - February 2026",
          body: `Hi Manager,\n\nSharing my performance metrics for February:\n\n• AI Performance Score: 8.4/10\n• Quota Attainment: 99.6%\n• Engagement Score: 92%\n• Calls analyzed: 42\n\nKey improvements:\n• Discovery questioning: +35%\n• Objection handling: +28%\n\nAreas to work on:\n• Active listening (talk-time ratio)\n\nHappy to discuss in our next 1-on-1.\n\nThanks!`
        };
      case "weekly-summary":
        return {
          to: ["CEO", "CRO", "CFO"],
          subject: "Executive Summary - Week of Feb 27, 2026",
          body: `Executive Team,\n\nWeekly summary for the week ending Feb 27, 2026:\n\n📊 Key Metrics:\n• Total Revenue: $14.0M (94% of target)\n• Avg Quota Attainment: 94% org-wide\n• System Uptime: 99.98%\n• Total Conversations: 24.3K\n\n✅ Wins:\n• Enterprise Sales: 112% quota attainment\n• Strategic Accounts closed $2.9M deal\n\n⚠️ Attention Needed:\n• Inside Sales at 78% quota\n• Coaching intervention scheduled\n\nDetailed reports attached.\n\nBest regards,\nMichael Thompson\nVP Sales Operations`
        };
      case "monthly-board":
        return {
          to: ["Board of Directors"],
          subject: "Board Package - Q1 2026 Performance",
          body: `Board Members,\n\nAttached is the comprehensive Q1 2026 performance package:\n\n📈 Revenue Performance:\n• Total Revenue: $14.0M (+24% YoY)\n• 94% average quota attainment\n• Pipeline coverage: 3.2x\n\n👥 Team Metrics:\n• 134 active reps across 5 departments\n• 87% average performance score\n• 24.3K conversations analyzed\n\n🎯 Strategic Initiatives:\n• Multi-threading strategy driving 42% faster closes\n• Conversation Intelligence adoption at 94%\n• Deployed SPICED qualification training\n\nFull board package attached for review.\n\nRegards,\nMichael Thompson`
        };
      case "department-digest":
        return {
          to: ["All Department Managers"],
          subject: "Department Performance Digest - Week of Feb 27",
          body: `Team,\n\nWeekly department performance digest:\n\n🏆 Top Performers:\n• Enterprise Sales: 112% attainment\n• Strategic Accounts: 104% attainment\n• Channel Partners: 106% attainment\n\n📊 Organization Metrics:\n• Avg Talk-Listen Ratio: 43:57\n• Avg Questions/Call: 15\n• Engagement Score: 85%\n\n💡 Best Practices:\n• Multi-threading with 3+ stakeholders\n• ROI-anchored pricing discussions\n• Early stakeholder mapping\n\n⚠️ Coaching Opportunities:\n• Inside Sales: SPICED qualification\n• SMB Sales: Objection handling\n\nLet's discuss in Friday's leadership meeting.\n\nBest,\nMichael`
        };
      case "revenue-report":
        const formatName = format === "pdf" ? "Pipeline Summary PDF" : 
                          format === "csv" ? "Deals Data CSV" : 
                          format === "xlsx" ? "Forecast Report XLSX" : 
                          "AI Custom Report";
        return {
          to: userRole === "admin" ? ["CEO - John Mitchell", "CFO - Sarah Chen", "CRO - David Park", "COO - Jennifer Williams"] : 
              userRole === "manager" ? ["VP Sales - Michael Thompson", "CRO - David Park"] : 
              ["Manager - Sarah Williams", "VP Sales - Michael Thompson"],
          subject: `Revenue Intelligence Report - ${quarter}`,
          body: `${userRole === "admin" ? "Executive Leadership Team" : "Team"},\\n\\nPlease find attached the Revenue Intelligence Report for ${quarter}.\\n\\nReport Type: ${formatName}\\n\\nKey Metrics Summary:\\n• Quarter: ${quarter}\\n• Export Format: ${format.toUpperCase()}\\n• Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}\\n\\nThis comprehensive report includes:\\n• Pipeline overview and forecast analysis\\n• Deal stage breakdown and conversion rates\\n• Revenue metrics and attainment tracking\\n• Risk assessment and opportunity insights\\n${userRole === "admin" ? "• Executive-level KPIs and board metrics\\n• Department-level performance comparison\\n• Strategic revenue forecasting\\n• Year-over-year growth analysis" : ""}\\n\\nThe report has been generated and is ready for your review.${userRole === "admin" ? " This report is prepared for executive review and board presentation." : ""}\\n\\nBest regards,\\n${userRole === "admin" ? "Michael Thompson\\nVP Sales Operations" : userRole === "manager" ? "Sarah Williams\\nSales Manager" : "Alex Smith\\nSales Representative"}`
        };
      case "reports":
        return {
          to: ["Leadership Team"],
          subject: `Organization Reports - ${new Date().toLocaleDateString()}`,
          body: `Team,\n\nAttached are the requested organization reports:\n\n${reports.split(",").map(r => `• ${r.replace(/-/g, " ")}`).join("\n")}\n\nAll reports include the latest data through ${new Date().toLocaleDateString()}.\n\nPlease review and let me know if you need any additional analysis.\n\nBest regards`
        };
      default:
        return {
          to: ["Bill Silver", "Karisma Clarke"],
          subject: company,
          body: `Hi Bill,\n\nThanks for the call yesterday.\n\nI understand that your procurement team is still unsure on the pricing, and your IT team have a few loose ends they want to button up.\n\nCan we set up two calls next week to address those concerns directly?\n\nTalk Soon,\nAlex`
        };
    }
  };

  const emailContent = getEmailContent();
  const [to, setTo] = useState(emailContent.to);
  const [from] = useState(userRole === "admin" ? "Michael Thompson" : userRole === "manager" ? "Sarah Williams" : "Alex Smith");
  const [subject, setSubject] = useState(emailContent.subject);
  const [emailBody, setEmailBody] = useState(emailContent.body);
  const [activeTab, setActiveTab] = useState("compose");
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleSend = () => {
    // Simulate sending email
    alert("Email sent successfully!");
    navigate(-1);
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* Email Compose Window */}
      <div className="max-w-[1400px] mx-auto p-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Deals</span>
        </button>

        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          {/* Window Header */}
          <div className="bg-purple-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-white font-medium text-sm">New Email</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1 hover:bg-purple-700 rounded text-white">
                <Minus className="w-4 h-4" />
              </button>
              <button className="p-1 hover:bg-purple-700 rounded text-white">
                <Maximize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate(-1)}
                className="p-1 hover:bg-purple-700 rounded text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_340px]">
            {/* Left: Email Composition */}
            <div className="border-r border-gray-200">
              {/* Recipients */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <label className="text-sm font-medium text-gray-700 w-12">To:</label>
                  <div className="flex-1 flex items-center gap-2 flex-wrap">
                    {to.map((recipient, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                      >
                        {recipient}
                        <button
                          onClick={() => setTo(to.filter((_, i) => i !== idx))}
                          className="hover:bg-purple-200 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      placeholder="Add recipient"
                      className="flex-1 text-sm outline-none min-w-[120px]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700 w-12">From:</label>
                  <span className="text-sm text-gray-900">{from}</span>
                </div>
              </div>

              {/* Toolbar */}
              <div className="px-6 py-3 border-b border-gray-200 flex items-center gap-4">
                <button
                  onClick={() => setActiveTab("templates")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    activeTab === "templates"
                      ? "bg-purple-100 text-purple-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Templates
                </button>
                <button
                  onClick={() => setActiveTab("blocks")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    activeTab === "blocks"
                      ? "bg-purple-100 text-purple-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Grid3x3 className="w-4 h-4" />
                  Blocks
                </button>
                <button
                  onClick={() => setActiveTab("inspiration")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    activeTab === "inspiration"
                      ? "bg-purple-100 text-purple-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Lightbulb className="w-4 h-4" />
                  Inspiration
                </button>
              </div>

              {/* Templates Panel */}
              {activeTab === "templates" && (
                <div className="px-6 py-4 bg-purple-50 border-b border-purple-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Email Templates</h4>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    <button
                      onClick={() => setEmailBody(`Hi ${to[0]?.split(' ')[0] || '[Name]'},\n\nThank you for taking the time to speak with me yesterday. I wanted to follow up on our discussion about ${company}'s goals.\n\nKey takeaways from our call:\n• [Point 1]\n• [Point 2]\n• [Point 3]\n\nNext steps:\n1. [Action item 1]\n2. [Action item 2]\n\nLooking forward to moving this forward.\n\nBest regards,\n${from}`)}
                      className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-900">Follow-Up After Call</p>
                      <p className="text-xs text-gray-500">Post-call summary with next steps</p>
                    </button>
                    <button
                      onClick={() => setEmailBody(`Hi ${to[0]?.split(' ')[0] || '[Name]'},\n\nI hope this email finds you well. I'm reaching out because I noticed ${company} is working on [initiative/project].\n\nWe help companies like yours achieve [specific outcome] by [value proposition].\n\nWould you be open to a 15-minute conversation next week to explore if this could be valuable for ${company}?\n\nBest regards,\n${from}`)}
                      className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-900">Cold Outreach</p>
                      <p className="text-xs text-gray-500">Initial contact with prospects</p>
                    </button>
                    <button
                      onClick={() => setEmailBody(`Hi ${to[0]?.split(' ')[0] || '[Name]'},\n\nI wanted to check in on our previous conversation about [topic].\n\nHave there been any developments on your end? I'm here to answer any questions or concerns your team might have.\n\nLet me know if you'd like to reconnect.\n\nBest regards,\n${from}`)}
                      className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-900">Check-In Email</p>
                      <p className="text-xs text-gray-500">Gentle follow-up for stalled deals</p>
                    </button>
                    <button
                      onClick={() => setEmailBody(`Hi ${to[0]?.split(' ')[0] || '[Name]'},\n\nThank you for your interest in our solution. I've attached a detailed proposal tailored to ${company}'s needs.\n\nProposal highlights:\n• Investment: [Pricing]\n• Timeline: [Implementation timeline]\n• Expected ROI: [ROI metrics]\n\nI'm available to walk through this proposal at your convenience. What does your calendar look like next week?\n\nBest regards,\n${from}`)}
                      className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-900">Proposal Send</p>
                      <p className="text-xs text-gray-500">Share proposal with key details</p>
                    </button>
                    <button
                      onClick={() => setEmailBody(`Hi ${to[0]?.split(' ')[0] || '[Name]'},\n\nI wanted to address the concerns you mentioned about [specific concern].\n\nHere's how we handle this:\n[Detailed explanation]\n\nAdditionally, I've attached:\n• [Resource 1]\n• [Resource 2]\n\nWould it be helpful to schedule a call with our [technical/product] team to dive deeper?\n\nBest regards,\n${from}`)}
                      className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-900">Objection Handling</p>
                      <p className="text-xs text-gray-500">Address concerns and objections</p>
                    </button>
                    <button
                      onClick={() => setEmailBody(`Hi ${to[0]?.split(' ')[0] || '[Name]'},\n\nCongratulations! We're excited to officially welcome ${company} as a partner.\n\nHere's what happens next:\n1. Kickoff call scheduled for [date]\n2. Account setup begins [date]\n3. Onboarding with [team member name]\n\nYour dedicated account manager is [name] - they'll be reaching out shortly.\n\nWelcome aboard!\n\nBest regards,\n${from}`)}
                      className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-900">Deal Closed - Welcome</p>
                      <p className="text-xs text-gray-500">Congratulations and next steps</p>
                    </button>
                    <button
                      onClick={() => setEmailBody(`Hi ${to[0]?.split(' ')[0] || '[Name]'},\n\nI wanted to share how companies similar to ${company} have benefited from our solution.\n\n[Company Name] saw:\n• [Metric 1]: [Result]\n• [Metric 2]: [Result]\n• [Metric 3]: [Result]\n\nI'd love to discuss how we can achieve similar results for ${company}.\n\nBest regards,\n${from}`)}
                      className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-900">Social Proof Share</p>
                      <p className="text-xs text-gray-500">Share success stories and results</p>
                    </button>
                  </div>
                </div>
              )}

              {/* Blocks Panel */}
              {activeTab === "blocks" && (
                <div className="px-6 py-4 bg-purple-50 border-b border-purple-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Content Blocks</h4>
                  <p className="text-xs text-gray-500 mb-3">Reusable snippets to insert into your email</p>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    <button
                      onClick={() => setEmailBody(emailBody + `\n\n--- MEETING INVITATION ---\nI'd like to schedule a meeting to discuss this further.\n\nProposed times:\n• [Date/Time Option 1]\n• [Date/Time Option 2]\n• [Date/Time Option 3]\n\nMeeting link: [Calendar link]\n`)}
                      className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-900">Meeting Scheduler</p>
                      <p className="text-xs text-gray-500">Propose meeting times</p>
                    </button>
                    <button
                      onClick={() => setEmailBody(emailBody + `\n\n--- PRICING OVERVIEW ---\n\nStarter Plan: $2,499/month\n• Up to 10 users\n• Core features included\n• Email support\n\nProfessional Plan: $4,999/month\n• Up to 50 users\n• Advanced analytics\n• Priority support\n\nEnterprise Plan: Custom pricing\n• Unlimited users\n• Custom integrations\n• Dedicated CSM\n\nAll plans include 14-day free trial.\n`)}
                      className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-900">Pricing Table</p>
                      <p className="text-xs text-gray-500">Insert pricing breakdown</p>
                    </button>
                    <button
                      onClick={() => setEmailBody(emailBody + `\n\n--- KEY FEATURES ---\n\n✓ Real-time Analytics Dashboard\n✓ AI-Powered Insights\n✓ Custom Report Builder\n✓ API Integration (Salesforce, HubSpot, etc.)\n✓ Role-Based Access Control\n✓ White-Label Options\n✓ 24/7 Support\n`)}
                      className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-900">Product Features</p>
                      <p className="text-xs text-gray-500">Highlight key capabilities</p>
                    </button>
                    <button
                      onClick={() => setEmailBody(emailBody + `\n\n--- ROI CALCULATOR ---\n\nBased on your current metrics:\n• Current monthly spend: $[amount]\n• Projected savings: $[amount] (XX% reduction)\n• Efficiency gain: XX hours/week\n• Payback period: X months\n\nEstimated first-year ROI: XXX%\n`)}
                      className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-900">ROI Calculator</p>
                      <p className="text-xs text-gray-500">Show financial impact</p>
                    </button>
                    <button
                      onClick={() => setEmailBody(emailBody + `\n\n--- SECURITY & COMPLIANCE ---\n\n🔒 Enterprise-grade security:\n• SOC 2 Type II certified\n• GDPR & CCPA compliant\n• AES-256 encryption\n• SSO/SAML support\n• Regular security audits\n• 99.9% uptime SLA\n`)}
                      className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-900">Security Details</p>
                      <p className="text-xs text-gray-500">Address security concerns</p>
                    </button>
                    <button
                      onClick={() => setEmailBody(emailBody + `\n\n--- IMPLEMENTATION TIMELINE ---\n\nWeek 1-2: Setup & Configuration\n• Account provisioning\n• User setup\n• Initial integrations\n\nWeek 3-4: Training & Onboarding\n• Team training sessions\n• Best practices workshop\n• Custom workflow setup\n\nWeek 5+: Go Live & Optimization\n• Full deployment\n• Ongoing support\n• Performance monitoring\n`)}
                      className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-900">Implementation Plan</p>
                      <p className="text-xs text-gray-500">Show rollout timeline</p>
                    </button>
                    <button
                      onClick={() => setEmailBody(emailBody + `\n\n--- CUSTOMER TESTIMONIAL ---\n\n"Since implementing this solution, we've seen a 40% increase in team productivity and saved over 15 hours per week on manual reporting."\n\n— [Name], [Title] at [Company Name]\n`)}
                      className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-900">Customer Quote</p>
                      <p className="text-xs text-gray-500">Add testimonial snippet</p>
                    </button>
                    <button
                      onClick={() => setEmailBody(emailBody + `\n\n--- RESOURCES ---\n\nI've attached some helpful resources:\n📄 Product Overview (PDF)\n📊 ROI Case Study\n🎥 3-Minute Demo Video\n📋 Feature Comparison Sheet\n🔗 Interactive Product Tour: [link]\n`)}
                      className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-900">Resource Links</p>
                      <p className="text-xs text-gray-500">Share helpful materials</p>
                    </button>
                  </div>
                </div>
              )}

              {/* Inspiration Panel */}
              {activeTab === "inspiration" && (
                <div className="px-6 py-4 bg-purple-50 border-b border-purple-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Success Stories</h4>
                  <p className="text-xs text-gray-500 mb-3">Case studies from companies in data analytics</p>
                  <div className="space-y-3 max-h-[200px] overflow-y-auto">
                    <div className="p-3 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                          TC
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">TechCorp Analytics</p>
                          <p className="text-xs text-gray-500">SaaS Analytics • 500+ employees</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-700 mb-2">
                        Reduced reporting time by 65% and increased data accuracy to 99.8% using real-time dashboards and automated insights.
                      </p>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-green-600 font-semibold">↑ 65% faster</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-purple-600 font-semibold">$450K saved/year</span>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center text-white text-xs font-bold">
                          RF
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">RetailFusion</p>
                          <p className="text-xs text-gray-500">E-commerce • 1,200 employees</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-700 mb-2">
                        Unified 15+ data sources into one platform, enabling cross-channel analytics that drove a 32% increase in conversion rates.
                      </p>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-green-600 font-semibold">↑ 32% conversion</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-purple-600 font-semibold">15 sources unified</span>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center text-white text-xs font-bold">
                          FS
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">FinServe Group</p>
                          <p className="text-xs text-gray-500">Financial Services • 3,000+ employees</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-700 mb-2">
                        Achieved SOC 2 compliance while processing 10M+ transactions daily with AI-powered anomaly detection and risk scoring.
                      </p>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-green-600 font-semibold">10M+ daily txns</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-purple-600 font-semibold">SOC 2 certified</span>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center text-white text-xs font-bold">
                          HC
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">HealthCore Systems</p>
                          <p className="text-xs text-gray-500">Healthcare Tech • 800 employees</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-700 mb-2">
                        Improved patient outcomes tracking by 47% and reduced manual data entry by 80% through automated workflow integration.
                      </p>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-green-600 font-semibold">↑ 47% outcomes</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-purple-600 font-semibold">↓ 80% manual work</span>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold">
                          ML
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">MediaLabs Inc</p>
                          <p className="text-xs text-gray-500">Marketing Analytics • 450 employees</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-700 mb-2">
                        Scaled from 5 to 50 clients without adding headcount by automating custom reporting and predictive campaign analytics.
                      </p>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-green-600 font-semibold">10x client growth</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-purple-600 font-semibold">Zero added staff</span>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white text-xs font-bold">
                          MS
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">ManufactureSmart</p>
                          <p className="text-xs text-gray-500">Manufacturing • 2,500 employees</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-700 mb-2">
                        Reduced equipment downtime by 55% using predictive maintenance analytics and real-time sensor data visualization.
                      </p>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-green-600 font-semibold">↓ 55% downtime</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-purple-600 font-semibold">$2M saved</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Email Body */}
              <div className="p-6">
                <textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full min-h-[400px] text-sm text-gray-900 leading-relaxed outline-none resize-none"
                  placeholder="Compose your email..."
                />
              </div>

              {/* Bottom Toolbar */}
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Button
                    onClick={handleSend}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </div>

                <div className="flex items-center gap-1">
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <Type className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <Paperclip className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <Smile className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <ImageIcon className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <Edit3 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <Link2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <div className="w-px h-6 bg-gray-300 mx-2" />
                  <button className="p-2 hover:bg-gray-100 rounded text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Deal Context Sidebar */}
            <div className="bg-gray-50 p-6">
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">{subject}</h3>
                <p className="text-sm text-gray-600">Jun 30, 2025</p>
              </div>

              {/* Participants */}
              <div className="mb-4">
                <button
                  onClick={() => toggleSection("participants")}
                  className="flex items-center justify-between w-full p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">Participants</span>
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                      {to.length}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      expandedSection === "participants" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedSection === "participants" && (
                  <div className="mt-2 p-4 bg-white rounded-lg border border-gray-200">
                    <div className="space-y-3">
                      {to.map((participant, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                            {participant
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{participant}</p>
                            <p className="text-xs text-gray-600">
                              {participant.toLowerCase().replace(" ", ".")}@{company.toLowerCase()}.com
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Call Brief */}
              <div className="mb-4">
                <button
                  onClick={() => toggleSection("callbrief")}
                  className="flex items-center justify-between w-full p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-900">Call brief</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      expandedSection === "callbrief" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedSection === "callbrief" && (
                  <div className="mt-2 p-4 bg-white rounded-lg border border-gray-200">
                    <div className="space-y-3 text-sm text-gray-700">
                      <div>
                        <p className="font-medium text-gray-900 mb-1">Key Discussion Points:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Procurement team concerns on pricing structure</li>
                          <li>IT team technical requirements and integration needs</li>
                          <li>Timeline for decision and implementation</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 mb-1">Action Items:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Schedule follow-up with procurement team</li>
                          <li>Prepare technical documentation for IT review</li>
                          <li>Send pricing breakdown by EOW</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Next Steps */}
              <div className="mb-6">
                <button
                  onClick={() => toggleSection("nextsteps")}
                  className="flex items-center justify-between w-full p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-900">Next Steps</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      expandedSection === "nextsteps" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedSection === "nextsteps" && (
                  <div className="mt-2 p-4 bg-white rounded-lg border border-gray-200">
                    <div className="space-y-2">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Schedule procurement call</p>
                          <p className="text-xs text-gray-600">Due: Next week</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">IT technical deep-dive</p>
                          <p className="text-xs text-gray-600">Due: Next week</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Send pricing breakdown</p>
                          <p className="text-xs text-gray-600">Due: This Friday</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}