import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Circle,
  Calendar,
  User,
  AlertCircle,
  ChevronDown,
  MoreVertical,
  Flag,
  Clock,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Checkbox } from "../../components/ui/checkbox";

const tasks = [
  {
    id: "1",
    title: "Follow up with Acme Corp on pricing proposal",
    description: "Send updated pricing based on their enterprise requirements",
    priority: "high",
    status: "todo",
    dueDate: "Mar 22, 2026",
    assignee: "Sarah Johnson",
    company: "Acme Corp",
    tags: ["Proposal", "Pricing"],
  },
  {
    id: "2",
    title: "Schedule demo for TechStart",
    description: "Book 45-minute product demo with decision makers",
    priority: "high",
    status: "in-progress",
    dueDate: "Mar 21, 2026",
    assignee: "You",
    company: "TechStart",
    tags: ["Demo", "Discovery"],
  },
  {
    id: "3",
    title: "Send contract to GlobalTech",
    description: "Final review and send signed contract documents",
    priority: "medium",
    status: "todo",
    dueDate: "Mar 23, 2026",
    assignee: "Michael Chen",
    company: "GlobalTech",
    tags: ["Contract", "Legal"],
  },
  {
    id: "4",
    title: "Prepare Q1 sales report",
    description: "Compile metrics and prepare presentation for leadership",
    priority: "medium",
    status: "in-progress",
    dueDate: "Mar 25, 2026",
    assignee: "You",
    company: null,
    tags: ["Reporting", "Internal"],
  },
  {
    id: "5",
    title: "Onboard new customer - DataFlow",
    description: "Schedule kickoff call and send onboarding materials",
    priority: "low",
    status: "todo",
    dueDate: "Mar 28, 2026",
    assignee: "Emma Davis",
    company: "DataFlow",
    tags: ["Onboarding", "Success"],
  },
  {
    id: "6",
    title: "Review integration requirements",
    description: "Technical review session with CloudCorp engineering team",
    priority: "high",
    status: "todo",
    dueDate: "Mar 21, 2026",
    assignee: "James Wilson",
    company: "CloudCorp",
    tags: ["Technical", "Integration"],
  },
  {
    id: "7",
    title: "Update CRM with meeting notes",
    description: "Log all meeting notes from this week into Salesforce",
    priority: "low",
    status: "done",
    dueDate: "Mar 20, 2026",
    assignee: "You",
    company: null,
    tags: ["Admin", "CRM"],
  },
  {
    id: "8",
    title: "Competitive analysis for SaaS Solutions",
    description: "Research competitors and prepare comparison matrix",
    priority: "medium",
    status: "in-progress",
    dueDate: "Mar 24, 2026",
    assignee: "Lisa Anderson",
    company: "SaaS Solutions",
    tags: ["Research", "Strategy"],
  },
];

export function Tasks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "todo" | "in-progress" | "done">("all");
  const [filterPriority, setFilterPriority] = useState<"all" | "high" | "medium" | "low">("all");

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.company?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "text-green-600 bg-green-50";
      case "in-progress":
        return "text-blue-600 bg-blue-50";
      case "todo":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "in-progress":
        return "In Progress";
      case "todo":
        return "To Do";
      case "done":
        return "Done";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Tasks</h1>
              <p className="text-sm text-gray-600 mt-1">Manage your tasks and action items</p>
            </div>
            <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              New Task
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="p-6">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left w-12">
                  <Checkbox />
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Task
                    <ChevronDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Priority
                    <ChevronDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Status
                    <ChevronDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Due Date
                    <ChevronDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Assignee
                    <ChevronDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Tags
                  </div>
                </th>
                <th className="px-6 py-3 text-right">
                  <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Actions
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <Checkbox checked={task.status === "done"} />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {task.title}
                      </div>
                      <div className="text-xs text-gray-500">{task.description}</div>
                      {task.company && (
                        <div className="text-xs text-blue-600 mt-1 font-medium">
                          {task.company}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Flag className={`w-4 h-4 ${task.priority === 'high' ? 'text-red-600' : task.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'}`} />
                      <Badge className={`${getPriorityColor(task.priority)} text-xs capitalize`}>
                        {task.priority}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={`${getStatusColor(task.status)} text-xs`}>
                      {getStatusLabel(task.status)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {task.dueDate}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="w-3 h-3 text-blue-600" />
                      </div>
                      <span className="text-sm text-gray-700">{task.assignee}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {task.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end">
                      <Button variant="ghost" size="sm" className="h-7 px-2">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-2xl font-semibold text-gray-900">
              {tasks.filter((t) => t.status === "todo").length}
            </div>
            <div className="text-sm text-gray-600 mt-1">To Do</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-2xl font-semibold text-blue-600">
              {tasks.filter((t) => t.status === "in-progress").length}
            </div>
            <div className="text-sm text-gray-600 mt-1">In Progress</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-2xl font-semibold text-green-600">
              {tasks.filter((t) => t.status === "done").length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Done</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-2xl font-semibold text-red-600">
              {tasks.filter((t) => t.priority === "high" && t.status !== "done").length}
            </div>
            <div className="text-sm text-gray-600 mt-1">High Priority</div>
          </div>
        </div>
      </div>
    </div>
  );
}
