import { useCallback, useEffect, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  ChevronDown,
  MoreVertical,
  Flag,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Checkbox } from "../../components/ui/checkbox";
import { supabase } from "../../../lib/supabase";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../../components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

type TaskStatus = "todo" | "in-progress" | "done";
type TaskPriority = "high" | "medium" | "low";

type TaskRow = {
  id: string;
  title: string;
  description: string | null;
  priority: string | null;
  status: string | null;
  due_date: string | null;
  due_time: string | null;
  assigned_to: string | null;
};

type UserRow = {
  user_id: string;
  full_name: string | null;
};

type TaskViewModel = {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  dueDateRaw: string;
  dueTime: string;
  assignee: string;
  assigneeId: string;
  company: string | null;
  tags: string[];
};

type TaskFormData = {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  dueTime: string;
  assignedTo: string;
};

const normalizePriority = (priority: string | null): TaskPriority => {
  if (priority === "high" || priority === "medium" || priority === "low") {
    return priority;
  }
  return "low";
};

const normalizeStatus = (status: string | null): TaskStatus => {
  if (status === "todo" || status === "in-progress" || status === "done") {
    return status;
  }
  if (status === "completed" || status === "complete") {
    return "done";
  }
  return "todo";
};

const formatDueDate = (dueDate: string | null) => {
  if (!dueDate) return "No due date";
  return new Date(dueDate).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const toDateInputValue = (dueDate: string | null) => {
  if (!dueDate) return "";
  return dueDate.slice(0, 10);
};

const initialTaskFormData: TaskFormData = {
  title: "",
  description: "",
  priority: "medium",
  status: "todo",
  dueDate: "",
  dueTime: "",
  assignedTo: "unassigned",
};

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

export function Tasks() {
  const [tasks, setTasks] = useState<TaskViewModel[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeTaskTab, setActiveTaskTab] = useState<"all" | "completed" | "pending">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "todo" | "in-progress" | "done">("all");
  const [filterPriority, setFilterPriority] = useState<"all" | "high" | "medium" | "low">("all");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState<"create" | "edit">("create");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [taskFormData, setTaskFormData] = useState<TaskFormData>(initialTaskFormData);
  const [taskFormError, setTaskFormError] = useState<string | null>(null);
  const [savingTask, setSavingTask] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());

  const fetchTasks = useCallback(async () => {
    const organizationId = localStorage.getItem("userOrganization") || "";
    setLoading(true);
    setLoadError(null);

    if (!organizationId) {
      setTasks([]);
      setLoadError("No organization context found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const [tasksResponse, usersResponse] = await Promise.all([
        supabase
          .from("tasks")
          .select("id, title, description, priority, status, due_date, due_time, assigned_to")
          .eq("organization_id", organizationId)
          .order("created_at", { ascending: false }),
        supabase
          .from("users")
          .select("user_id, full_name")
          .eq("org_id", organizationId),
      ]);

      if (tasksResponse.error) {
        throw new Error(tasksResponse.error.message);
      }

      if (usersResponse.error) {
        throw new Error(usersResponse.error.message);
      }

      const fetchedUsers = (usersResponse.data || []) as UserRow[];
      setUsers(fetchedUsers);

      const usersById = new Map<string, string>();
      for (const user of fetchedUsers) {
        usersById.set(user.user_id, user.full_name || "Unknown user");
      }

      const mappedTasks: TaskViewModel[] = ((tasksResponse.data || []) as TaskRow[]).map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description || "No description",
        priority: normalizePriority(task.priority),
        status: normalizeStatus(task.status),
        dueDate: formatDueDate(task.due_date),
        dueDateRaw: toDateInputValue(task.due_date),
        dueTime: task.due_time || "",
        assignee: task.assigned_to ? usersById.get(task.assigned_to) || "Unknown user" : "Unassigned",
        assigneeId: task.assigned_to || "unassigned",
        company: null,
        tags: [],
      }));

      setTasks(mappedTasks);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load tasks";
      setLoadError(message);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    setSelectedTaskIds((prev) => {
      if (prev.size === 0) return prev;

      const availableTaskIds = new Set(tasks.map((task) => task.id));
      const next = new Set<string>();

      for (const taskId of prev) {
        if (availableTaskIds.has(taskId)) {
          next.add(taskId);
        }
      }

      return next.size === prev.size ? prev : next;
    });
  }, [tasks]);

  const resetTaskForm = () => {
    setTaskFormData(initialTaskFormData);
    setTaskFormError(null);
  };

  const openCreatePanel = () => {
    setPanelMode("create");
    setEditingTaskId(null);
    resetTaskForm();
    setIsPanelOpen(true);
  };

  const openEditPanel = (task: TaskViewModel) => {
    setPanelMode("edit");
    setEditingTaskId(task.id);
    setTaskFormData({
      title: task.title,
      description: task.description === "No description" ? "" : task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDateRaw,
      dueTime: task.dueTime,
      assignedTo: task.assigneeId || "unassigned",
    });
    setTaskFormError(null);
    setIsPanelOpen(true);
  };

  const handleTaskFormChange = <K extends keyof TaskFormData>(key: K, value: TaskFormData[K]) => {
    setTaskFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveTask = async () => {
    const organizationId = localStorage.getItem("userOrganization") || "";
    const userId = localStorage.getItem("userId") || "";

    if (!organizationId) {
      setTaskFormError("No organization context found. Please log in again.");
      return;
    }

    if (!isUuid(organizationId)) {
      setTaskFormError("Invalid organization id in session. Please sign in again.");
      return;
    }

    if (!taskFormData.title.trim()) {
      setTaskFormError("Task title is required.");
      return;
    }

    setSavingTask(true);
    setTaskFormError(null);

    const payload = {
      title: taskFormData.title.trim(),
      description: taskFormData.description.trim() || null,
      priority: taskFormData.priority,
      status: taskFormData.status,
      due_date: taskFormData.dueDate ? `${taskFormData.dueDate}T00:00:00Z` : null,
      due_time: taskFormData.dueTime.trim() || null,
      assigned_to:
        taskFormData.assignedTo === "unassigned" || !isUuid(taskFormData.assignedTo)
          ? null
          : taskFormData.assignedTo,
    };

    try {
      if (panelMode === "create") {
        const { error } = await supabase.from("tasks").insert({
          ...payload,
          organization_id: organizationId,
          created_by: isUuid(userId) ? userId : null,
        });

        if (error) {
          throw new Error(error.message);
        }
      } else {
        if (!editingTaskId) {
          throw new Error("Task id is missing for update.");
        }

        const { error } = await supabase
          .from("tasks")
          .update(payload)
          .eq("id", editingTaskId)
          .eq("organization_id", organizationId);

        if (error) {
          throw new Error(error.message);
        }
      }

      await fetchTasks();
      setIsPanelOpen(false);
      resetTaskForm();
      setEditingTaskId(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save task";
      setTaskFormError(message);
    } finally {
      setSavingTask(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const organizationId = localStorage.getItem("userOrganization") || "";
    if (!organizationId) {
      setLoadError("No organization context found. Please log in again.");
      return;
    }

    const confirmed = window.confirm("Delete this task permanently?");
    if (!confirmed) return;

    setDeletingTaskId(taskId);
    setLoadError(null);

    try {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId)
        .eq("organization_id", organizationId);

      if (error) {
        throw new Error(error.message);
      }

      await fetchTasks();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete task";
      setLoadError(message);
    } finally {
      setDeletingTaskId(null);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    const organizationId = localStorage.getItem("userOrganization") || "";
    if (!organizationId) {
      setLoadError("No organization context found. Please log in again.");
      return;
    }

    setCompletingTaskId(taskId);
    setLoadError(null);

    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status: "complete", completed_at: new Date().toISOString() })
        .eq("id", taskId)
        .eq("organization_id", organizationId);

      if (error) {
        throw new Error(error.message);
      }

      await fetchTasks();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to complete task";
      setLoadError(message);
    } finally {
      setCompletingTaskId(null);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesTab =
      activeTaskTab === "all"
        ? true
        : activeTaskTab === "completed"
          ? task.status === "done"
          : task.status === "todo" || task.status === "in-progress";

    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
    return matchesTab && matchesSearch && matchesStatus && matchesPriority;
  });

  const selectedVisibleCount = filteredTasks.filter((task) => selectedTaskIds.has(task.id)).length;
  const allVisibleSelected = filteredTasks.length > 0 && selectedVisibleCount === filteredTasks.length;
  const someVisibleSelected = selectedVisibleCount > 0 && !allVisibleSelected;

  const handleToggleAllVisible = (checked: boolean | "indeterminate") => {
    const shouldSelectAll = checked === true;
    const visibleTaskIds = filteredTasks.map((task) => task.id);

    setSelectedTaskIds((prev) => {
      const next = new Set(prev);
      for (const taskId of visibleTaskIds) {
        if (shouldSelectAll) {
          next.add(taskId);
        } else {
          next.delete(taskId);
        }
      }
      return next;
    });
  };

  const handleToggleTaskSelection = (taskId: string, checked: boolean | "indeterminate") => {
    const isChecked = checked === true;
    setSelectedTaskIds((prev) => {
      const next = new Set(prev);
      if (isChecked) {
        next.add(taskId);
      } else {
        next.delete(taskId);
      }
      return next;
    });
  };

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
            <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={openCreatePanel}>
              <Plus className="w-4 h-4" />
              New Task
            </Button>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <button
              type="button"
              onClick={() => setActiveTaskTab("all")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTaskTab === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All tasks
            </button>
            <button
              type="button"
              onClick={() => setActiveTaskTab("completed")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTaskTab === "completed"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Completed
            </button>
            <button
              type="button"
              onClick={() => setActiveTaskTab("pending")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTaskTab === "pending"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Pending
            </button>
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
                onChange={(e) =>
                  setFilterStatus(e.target.value as "all" | "todo" | "in-progress" | "done")
                }
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <select
                value={filterPriority}
                onChange={(e) =>
                  setFilterPriority(e.target.value as "all" | "high" | "medium" | "low")
                }
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
        {loading && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-sm text-gray-600 mb-4">
            Loading tasks from backend...
          </div>
        )}

        {!loading && loadError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-red-700">Failed to load tasks: {loadError}</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => void fetchTasks()}>
              Retry
            </Button>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left w-12">
                  <Checkbox
                    checked={allVisibleSelected ? true : someVisibleSelected ? "indeterminate" : false}
                    onCheckedChange={handleToggleAllVisible}
                    aria-label="Select all visible tasks"
                  />
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
                    <Checkbox
                      checked={selectedTaskIds.has(task.id)}
                      onCheckedChange={(checked) => handleToggleTaskSelection(task.id, checked)}
                      aria-label={`Select task ${task.title}`}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 mb-1">{task.title}</div>
                      <div className="text-xs text-gray-500">{task.description}</div>
                      {task.company && (
                        <div className="text-xs text-blue-600 mt-1 font-medium">{task.company}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Flag
                        className={`w-4 h-4 ${
                          task.priority === "high"
                            ? "text-red-600"
                            : task.priority === "medium"
                              ? "text-yellow-600"
                              : "text-green-600"
                        }`}
                      />
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
                      <span>{task.dueDate}</span>
                      {task.dueTime && <span className="text-xs text-gray-500">{task.dueTime}</span>}
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
                      {task.tags.length > 0 ? (
                        task.tags.map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex h-7 items-center justify-center rounded-md px-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                          <MoreVertical className="w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" sideOffset={6}>
                          <DropdownMenuItem
                            onClick={() => void handleCompleteTask(task.id)}
                            disabled={task.status === "done" || completingTaskId === task.id}
                          >
                            {completingTaskId === task.id ? "Completing..." : "Complete Task"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditPanel(task)}>
                            Update
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => void handleDeleteTask(task.id)}
                            disabled={deletingTaskId === task.id}
                          >
                            {deletingTaskId === task.id ? "Deleting..." : "Delete"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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

      <Sheet
        open={isPanelOpen}
        onOpenChange={(open) => {
          setIsPanelOpen(open);
          if (!open) {
            resetTaskForm();
            setEditingTaskId(null);
          }
        }}
      >
        <SheetContent side="right" className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{panelMode === "create" ? "Create New Task" : "Update Task"}</SheetTitle>
            <SheetDescription>
              {panelMode === "create"
                ? "Add a new task to your organization."
                : "Edit the selected task details."}
            </SheetDescription>
          </SheetHeader>

          <div className="px-4 pb-4 space-y-4 overflow-y-auto">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="task-title">
                Title
              </label>
              <input
                id="task-title"
                type="text"
                value={taskFormData.title}
                onChange={(e) => handleTaskFormChange("title", e.target.value)}
                placeholder="Enter task title"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="task-description">
                Description
              </label>
              <textarea
                id="task-description"
                value={taskFormData.description}
                onChange={(e) => handleTaskFormChange("description", e.target.value)}
                placeholder="Enter task description"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="task-priority">
                  Priority
                </label>
                <select
                  id="task-priority"
                  value={taskFormData.priority}
                  onChange={(e) =>
                    handleTaskFormChange("priority", e.target.value as TaskPriority)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="task-status">
                  Status
                </label>
                <select
                  id="task-status"
                  value={taskFormData.status}
                  onChange={(e) => handleTaskFormChange("status", e.target.value as TaskStatus)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="task-due-date">
                  Due Date
                </label>
                <input
                  id="task-due-date"
                  type="date"
                  value={taskFormData.dueDate}
                  onChange={(e) => handleTaskFormChange("dueDate", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="task-due-time">
                  Due Time
                </label>
                <input
                  id="task-due-time"
                  type="text"
                  value={taskFormData.dueTime}
                  onChange={(e) => handleTaskFormChange("dueTime", e.target.value)}
                  placeholder="e.g. 05:00 PM"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="task-assignee">
                Assignee
              </label>
              <select
                id="task-assignee"
                value={taskFormData.assignedTo}
                onChange={(e) => handleTaskFormChange("assignedTo", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="unassigned">Unassigned</option>
                {users.map((user) => (
                  <option key={user.user_id} value={user.user_id}>
                    {user.full_name || "Unknown user"}
                  </option>
                ))}
              </select>
            </div>

            {taskFormError && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {taskFormError}
              </div>
            )}
          </div>

          <SheetFooter>
            <Button variant="outline" onClick={() => setIsPanelOpen(false)} disabled={savingTask}>
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => void handleSaveTask()}
              disabled={savingTask}
            >
              {savingTask
                ? panelMode === "create"
                  ? "Creating..."
                  : "Updating..."
                : panelMode === "create"
                  ? "Create Task"
                  : "Update Task"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
