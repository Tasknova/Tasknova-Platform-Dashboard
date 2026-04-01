import { useState } from "react";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import { Plus, Trash2, Download, Upload } from "lucide-react";

interface Manager {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
}

interface Step3Props {
  data: any;
  onUpdate: (data: any) => void;
}

export default function OnboardingStep3({ data, onUpdate }: Step3Props) {
  const [managers, setManagers] = useState<Manager[]>(data.managers || []);
  const [newManager, setNewManager] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
  });

  const departments = [
    "Sales", "Marketing", "Customer Success", "Engineering",
    "Finance", "Operations", "HR", "Legal", "Other"
  ];

  const addManager = () => {
    if (newManager.name && newManager.email) {
      const manager: Manager = {
        id: Date.now().toString(),
        ...newManager,
      };
      const updated = [...managers, manager];
      setManagers(updated);
      onUpdate({ ...data, managers: updated });
      setNewManager({ name: "", email: "", phone: "", department: "" });
    }
  };

  const removeManager = (id: string) => {
    const updated = managers.filter((m) => m.id !== id);
    setManagers(updated);
    onUpdate({ ...data, managers: updated });
  };

  const downloadCSVTemplate = () => {
    const template = "name,email,phone,department\nJohn Smith,john@company.com,+1-555-0001,Sales\nJane Doe,jane@company.com,+1-555-0002,Marketing";
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(template));
    element.setAttribute("download", "managers-template.csv");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Card className="bg-white border border-gray-200 p-8 rounded-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Managers</h1>
        <p className="text-gray-600">Invite your sales and team managers to Tasknova</p>
      </div>

      <div className="space-y-6">
        {/* Add Manager Form */}
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Add Manager</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="managerName" className="text-xs font-semibold text-gray-700 mb-2 block">
                  Full Name
                </Label>
                <Input
                  id="managerName"
                  type="text"
                  value={newManager.name}
                  onChange={(e) => setNewManager({ ...newManager, name: e.target.value })}
                  placeholder="Jane Smith"
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900"
                />
              </div>
              <div>
                <Label htmlFor="managerEmail" className="text-xs font-semibold text-gray-700 mb-2 block">
                  Email
                </Label>
                <Input
                  id="managerEmail"
                  type="email"
                  value={newManager.email}
                  onChange={(e) => setNewManager({ ...newManager, email: e.target.value })}
                  placeholder="jane@company.com"
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="managerPhone" className="text-xs font-semibold text-gray-700 mb-2 block">
                  Phone
                </Label>
                <Input
                  id="managerPhone"
                  type="tel"
                  value={newManager.phone}
                  onChange={(e) => setNewManager({ ...newManager, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900"
                />
              </div>
              <div>
                <Label htmlFor="managerDept" className="text-xs font-semibold text-gray-700 mb-2 block">
                  Department
                </Label>
                <select
                  id="managerDept"
                  value={newManager.department}
                  onChange={(e) => setNewManager({ ...newManager, department: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900"
                >
                  <option value="">Select department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={addManager}
              disabled={!newManager.name || !newManager.email}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Add Manager
            </button>
          </div>
        </div>

        {/* CSV Upload Section */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <p className="text-sm text-gray-600 mb-4">Or upload multiple managers via CSV</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={downloadCSVTemplate}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-900 font-medium rounded-lg transition-colors text-sm"
            >
              <Download size={16} /> Download Template
            </button>
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-300 text-blue-900 font-medium rounded-lg transition-colors cursor-pointer text-sm">
              <Upload size={16} /> Upload CSV
              <input type="file" accept=".csv" className="hidden" />
            </label>
          </div>
        </div>

        {/* Managers List */}
        {managers.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Managers ({managers.length})</h3>
            <div className="space-y-2">
              {managers.map((manager) => (
                <div
                  key={manager.id}
                  className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{manager.name}</p>
                    <p className="text-xs text-gray-600">{manager.email}</p>
                    {manager.department && (
                      <p className="text-xs text-gray-500 mt-1">
                        📋 {manager.department}
                        {manager.phone && ` • ${manager.phone}`}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeManager(manager.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Card */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            💡 You can add managers one by one or upload a CSV file with multiple managers at once.
          </p>
        </div>
      </div>
    </Card>
  );
}
