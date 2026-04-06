import { createBrowserRouter } from "react-router";
import { RepDashboard } from "./views/rep/RepDashboard";
import { RepPipeline } from "./views/rep/RepPipeline";
import { RepPerformance } from "./views/rep/RepPerformance";
import { RepCallDetails } from "./views/rep/RepCallDetails";
import { ManagerDashboard } from "./views/manager/ManagerDashboard";
import { ManagerForecast } from "./views/manager/ManagerForecast";
import { ManagerPipeline } from "./views/manager/ManagerPipeline";
import { ManagerPerformance } from "./views/manager/ManagerPerformance";
import { ManagerCallDetails } from "./views/manager/ManagerCallDetails";
import { AdminDashboard } from "./views/admin/AdminDashboard";
import { AdminReports } from "./views/admin/AdminReports";
import { AdminAnalytics } from "./views/admin/AdminAnalytics";
import { AdminCallDetails } from "./views/admin/AdminCallDetails";
import { SystemHealth } from "./views/admin/SystemHealth";
import { UsageIntelligence } from "./views/admin/UsageIntelligence";
import { AdminTeam } from "./views/admin/AdminTeam";
import { TeamsManagement } from "./views/admin/TeamsManagement";
import { Meetings } from "./views/shared/Meetings";
import { Calls } from "./views/shared/Calls";
import { Tasks } from "./views/shared/Tasks";
import { Scheduler } from "./views/shared/Scheduler";
import { Customers } from "./views/shared/Customers";
import { Deals } from "./views/shared/Deals";
import { Coaching } from "./views/shared/Coaching";
import { Insights } from "./views/shared/Insights";
import { Trackers } from "./views/shared/Trackers";
import { Revenue } from "./views/shared/Revenue";
import { Settings } from "./views/shared/Settings";
import { AI } from "./views/shared/AI";
import MeetingDetail from "./views/meetings/MeetingDetail";
import { CustomerDetail } from "./views/shared/CustomerDetail";
import { LiveCall } from "./views/shared/LiveCall";
import { Activities } from "./views/shared/Activities";
import { ComposeEmail } from "./views/shared/ComposeEmail";
import { Landing } from "./views/auth/Landing";
import { RoleLogin } from "./views/auth/RoleLogin";
import { RoleSignup } from "./views/auth/RoleSignup";
import { SignupOrganization } from "./views/auth/SignupOrganization";
import { LoginOrganization } from "./views/auth/LoginOrganization";
import { Onboarding } from "./views/auth/Onboarding";
import { ResetPassword } from "./views/auth/ResetPassword";
import { Root } from "./components/Root";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { NotFound } from "./components/NotFound";

// Router configuration
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/signup",
    element: <SignupOrganization />,
  },
  {
    path: "/login",
    element: <Landing />,
  },
  {
    path: "/login/:role",
    element: <RoleLogin />,
  },
  {
    path: "/signup/:role",
    element: <RoleSignup />,
  },
  {
    path: "/onboarding",
    element: <Onboarding />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/rep",
    element: <Root />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <RepDashboard /> },
      { path: "dashboard", element: <RepDashboard /> },
      { path: "pipeline", element: <RepPipeline /> },
      { path: "performance", element: <RepPerformance /> },
      { path: "meetings", element: <Meetings /> },
      { path: "calls", element: <Calls /> },
      { path: "tasks", element: <Tasks /> },
      { path: "calendar", element: <Scheduler /> },
      { path: "customers", element: <Customers /> },
      { path: "deals", element: <Deals /> },
      { path: "deal/:id", element: <Deals /> },
      { path: "coaching", element: <Coaching /> },
      { path: "coaching/:id", element: <Coaching /> },
      { path: "coaching/review/:id", element: <Coaching /> },
      { path: "coaching/start/:id", element: <Coaching /> },
      { path: "insights", element: <Insights /> },
      { path: "trackers", element: <Trackers /> },
      { path: "revenue", element: <Revenue /> },
      { path: "settings", element: <Settings /> },
      { path: "ai", element: <AI /> },
      { path: "activities", element: <Activities /> },
      { path: "compose-email", element: <ComposeEmail /> },
      { path: "meeting/:id", element: <MeetingDetail /> },
      { path: "customer/:id", element: <CustomerDetail /> },
      { path: "call/:id", element: <LiveCall /> },
      { path: "activity/:id", element: <RepCallDetails /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path: "/manager",
    element: <Root />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <ManagerDashboard /> },
      { path: "dashboard", element: <ManagerDashboard /> },
      { path: "forecast", element: <ManagerForecast /> },
      { path: "pipeline", element: <ManagerPipeline /> },
      { path: "performance", element: <ManagerPerformance /> },
      { path: "meetings", element: <Meetings /> },
      { path: "calls", element: <Calls /> },
      { path: "tasks", element: <Tasks /> },
      { path: "scheduler", element: <Scheduler /> },
      { path: "calendar", element: <Scheduler /> },
      { path: "customers", element: <Customers /> },
      { path: "deals", element: <Deals /> },
      { path: "deal/:id", element: <Deals /> },
      { path: "coaching", element: <Coaching /> },
      { path: "coaching/:id", element: <Coaching /> },
      { path: "coaching/review/:id", element: <Coaching /> },
      { path: "coaching/start/:id", element: <Coaching /> },
      { path: "insights", element: <Insights /> },
      { path: "trackers", element: <Trackers /> },
      { path: "revenue", element: <Revenue /> },
      { path: "settings", element: <Settings /> },
      { path: "ai", element: <AI /> },
      { path: "activities", element: <Activities /> },
      { path: "compose-email", element: <ComposeEmail /> },
      { path: "meeting/:id", element: <MeetingDetail /> },
      { path: "customer/:id", element: <CustomerDetail /> },
      { path: "call/:id", element: <LiveCall /> },
      { path: "activity/:id", element: <ManagerCallDetails /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path: "/admin",
    element: <Root />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "reports", element: <AdminReports /> },
      { path: "analytics", element: <AdminAnalytics /> },
      { path: "team", element: <AdminTeam /> },
      { path: "teams", element: <TeamsManagement /> },
      { path: "meetings", element: <Meetings /> },
      { path: "calls", element: <Calls /> },
      { path: "tasks", element: <Tasks /> },
      { path: "scheduler", element: <Scheduler /> },
      { path: "calendar", element: <Scheduler /> },
      { path: "customers", element: <Customers /> },
      { path: "deals", element: <Deals /> },
      { path: "deal/:id", element: <Deals /> },
      { path: "coaching", element: <Coaching /> },
      { path: "coaching/:id", element: <Coaching /> },
      { path: "coaching/review/:id", element: <Coaching /> },
      { path: "coaching/start/:id", element: <Coaching /> },
      { path: "insights", element: <Insights /> },
      { path: "revenue", element: <Revenue /> },
      { path: "settings", element: <Settings /> },
      { path: "ai", element: <AI /> },
      { path: "activities", element: <Activities /> },
      { path: "compose-email", element: <ComposeEmail /> },
      { path: "meeting/:id", element: <MeetingDetail /> },
      { path: "customer/:id", element: <CustomerDetail /> },
      { path: "call/:id", element: <LiveCall /> },
      { path: "activity/:id", element: <AdminCallDetails /> },
      { path: "system-health", element: <SystemHealth /> },
      { path: "usage-intelligence", element: <UsageIntelligence /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);