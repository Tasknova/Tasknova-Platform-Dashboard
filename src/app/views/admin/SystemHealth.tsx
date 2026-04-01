import { useState } from "react";
import {
  Activity,
  Server,
  Database,
  Zap,
  HardDrive,
  Wifi,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Download,
  Settings,
  BarChart3,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

interface SystemMetric {
  name: string;
  value: string;
  status: "healthy" | "warning" | "error";
  trend: "up" | "down" | "stable";
  change: string;
  icon: any;
}

interface ServiceStatus {
  name: string;
  status: "operational" | "degraded" | "outage";
  uptime: string;
  lastIncident: string;
  responseTime: string;
}

export function SystemHealth() {
  const [selectedPeriod, setSelectedPeriod] = useState<"24h" | "7d" | "30d">("24h");
  const [autoRefresh, setAutoRefresh] = useState(true);

  const systemMetrics: SystemMetric[] = [
    {
      name: "Overall Uptime",
      value: "99.98%",
      status: "healthy",
      trend: "stable",
      change: "+0.02%",
      icon: Activity,
    },
    {
      name: "API Latency",
      value: "124ms",
      status: "healthy",
      trend: "down",
      change: "-12ms",
      icon: Zap,
    },
    {
      name: "Database Performance",
      value: "98.5%",
      status: "healthy",
      trend: "up",
      change: "+1.2%",
      icon: Database,
    },
    {
      name: "Active Sessions",
      value: "89",
      status: "healthy",
      trend: "up",
      change: "+12",
      icon: Wifi,
    },
    {
      name: "Error Rate",
      value: "0.02%",
      status: "healthy",
      trend: "down",
      change: "-0.01%",
      icon: AlertCircle,
    },
    {
      name: "Storage Used",
      value: "48%",
      status: "healthy",
      trend: "up",
      change: "+3%",
      icon: HardDrive,
    },
  ];

  const services: ServiceStatus[] = [
    {
      name: "API Gateway",
      status: "operational",
      uptime: "99.99%",
      lastIncident: "12 days ago",
      responseTime: "98ms",
    },
    {
      name: "Authentication Service",
      status: "operational",
      uptime: "99.98%",
      lastIncident: "5 days ago",
      responseTime: "45ms",
    },
    {
      name: "Database Cluster",
      status: "operational",
      uptime: "99.97%",
      lastIncident: "8 days ago",
      responseTime: "12ms",
    },
    {
      name: "AI Processing",
      status: "operational",
      uptime: "99.95%",
      lastIncident: "3 days ago",
      responseTime: "450ms",
    },
    {
      name: "Recording Service",
      status: "operational",
      uptime: "99.99%",
      lastIncident: "18 days ago",
      responseTime: "120ms",
    },
    {
      name: "Email Service",
      status: "operational",
      uptime: "99.96%",
      lastIncident: "6 days ago",
      responseTime: "850ms",
    },
  ];

  const getStatusColor = (status: "healthy" | "warning" | "error" | "operational" | "degraded" | "outage") => {
    switch (status) {
      case "healthy":
      case "operational":
        return "bg-green-100 text-green-700 border-green-300";
      case "warning":
      case "degraded":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "error":
      case "outage":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusIcon = (status: "operational" | "degraded" | "outage") => {
    switch (status) {
      case "operational":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "degraded":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "outage":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    if (trend === "up") return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === "down") return <TrendingDown className="w-4 h-4 text-blue-600" />;
    return <Activity className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="max-w-[1800px] mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Health</h1>
            <p className="text-sm text-gray-600 mt-1">
              Monitor platform performance and service status
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Last updated: 2 min ago</span>
              {autoRefresh && (
                <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
              )}
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Configure Alerts
            </Button>
          </div>
        </div>

        {/* Overall Status Banner */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">All Systems Operational</h2>
                <p className="text-sm text-gray-600">
                  All services are running smoothly. No incidents detected.
                </p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-700 border-green-300 text-sm font-semibold px-4 py-2">
              100% Availability
            </Badge>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1 w-fit">
          {(["24h", "7d", "30d"] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                selectedPeriod === period
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {period === "24h" ? "Last 24 Hours" : period === "7d" ? "Last 7 Days" : "Last 30 Days"}
            </button>
          ))}
        </div>

        {/* System Metrics Grid */}
        <div className="grid grid-cols-3 gap-4">
          {systemMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      metric.status === "healthy"
                        ? "bg-green-100"
                        : metric.status === "warning"
                        ? "bg-yellow-100"
                        : "bg-red-100"
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        metric.status === "healthy"
                          ? "text-green-600"
                          : metric.status === "warning"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600">{metric.name}</div>
                      <div className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</div>
                    </div>
                  </div>
                  {getTrendIcon(metric.trend)}
                </div>
                <div className="flex items-center justify-between">
                  <Badge className={`${getStatusColor(metric.status)} border text-xs font-semibold`}>
                    {metric.status === "healthy" ? "Healthy" : metric.status === "warning" ? "Warning" : "Error"}
                  </Badge>
                  <span className={`text-sm font-medium ${
                    metric.trend === "up" && metric.name.includes("Error")
                      ? "text-red-600"
                      : metric.trend === "down" && !metric.name.includes("Error")
                      ? "text-red-600"
                      : "text-green-600"
                  }`}>
                    {metric.change}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Services Status */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Service Status</h2>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Status
            </Button>
          </div>
          <div className="divide-y divide-gray-100">
            {services.map((service, index) => (
              <div key={index} className="px-6 py-5 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center gap-3 w-64">
                      {getStatusIcon(service.status)}
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{service.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          Last incident: {service.lastIncident}
                        </div>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(service.status)} border text-xs font-semibold`}>
                      {service.status === "operational"
                        ? "Operational"
                        : service.status === "degraded"
                        ? "Degraded"
                        : "Outage"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-8 text-sm">
                    <div className="text-center">
                      <div className="text-xs text-gray-600 mb-1">Uptime</div>
                      <div className="text-sm font-semibold text-green-600">{service.uptime}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-600 mb-1">Response Time</div>
                      <div className="text-sm font-semibold text-blue-600">{service.responseTime}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Chart Placeholder */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Performance Trends</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Showing:</span>
              <select className="text-sm border border-gray-300 rounded px-3 py-1.5 bg-white">
                <option>API Response Time</option>
                <option>Error Rate</option>
                <option>Throughput</option>
                <option>Active Users</option>
              </select>
            </div>
          </div>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center border border-blue-200">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-blue-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600">Performance chart visualization</p>
              <p className="text-xs text-gray-500 mt-1">Real-time metrics tracking</p>
            </div>
          </div>
        </div>

        {/* Recent Incidents */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Incidents</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              {
                title: "Intermittent API Latency",
                date: "Mar 14, 2026",
                duration: "15 minutes",
                severity: "minor",
                status: "resolved",
              },
              {
                title: "Database Connection Timeout",
                date: "Mar 10, 2026",
                duration: "8 minutes",
                severity: "moderate",
                status: "resolved",
              },
              {
                title: "Scheduled Maintenance",
                date: "Mar 5, 2026",
                duration: "2 hours",
                severity: "planned",
                status: "completed",
              },
            ].map((incident, index) => (
              <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`mt-1 w-2 h-2 rounded-full ${
                      incident.severity === "minor"
                        ? "bg-yellow-500"
                        : incident.severity === "moderate"
                        ? "bg-orange-500"
                        : "bg-blue-500"
                    }`} />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{incident.title}</div>
                      <div className="flex items-center gap-4 text-xs text-gray-600 mt-1">
                        <span>{incident.date}</span>
                        <span>•</span>
                        <span>Duration: {incident.duration}</span>
                        <span>•</span>
                        <Badge className={`${
                          incident.severity === "minor"
                            ? "bg-yellow-100 text-yellow-700"
                            : incident.severity === "moderate"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-blue-100 text-blue-700"
                        } border-0 text-xs`}>
                          {incident.severity}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                    {incident.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
