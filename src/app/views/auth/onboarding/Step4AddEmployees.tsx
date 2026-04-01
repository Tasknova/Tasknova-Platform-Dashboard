import { useState } from "react";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Plus, Trash2, Download, Upload } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  managerId: string;
}

interface Step4Props {
  data: any;
  onUpdate: (data: any) => void;
}

export default function OnboardingStep4({ data, onUpdate }: Step4Props) {
  const [employees, setEmployees] = useState<Employee[]>(data.employees || []);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    managerId: "",
  });

  const departments = [
    "Sales", "Marketing", "Customer Success", "Engineering",
    "Finance", "Operations", "HR", "Legal", "Other"
  ];

  const managers = data.managers || [];

  const addEmployee = () => {
    if (newEmployee.name && newEmployee.email) {
      const employee: Employee = {
        id: Date.now().toString(),
        ...newEmployee,
      };
      const updated = [...employees, employee];
      setEmployees(updated);
      onUpdate({ ...data, employees: updated });
      setNewEmployee({ name: "", email: "", phone: "", department: "", managerId: "" });
    }
  };

  const removeEmployee = (id: string) => {
    const updated = employees.filter((e) => e.id !== id);
    setEmployees(updated);
    onUpdate({ ...data, employees: updated });
  };

  const getManagerName = (managerId: string) => {
    const manager = managers.find((m: any) => m.id === managerId);
    return manager?.name || "Unassigned";
  };

  const downloadCSVTemplate = () => {
    const template = "name,email,phone,department,manager_name\nJohn Smith,john@company.com,+1-555-0001,Sales,Jane Doe\nMary Johnson,mary@company.com,+1-555-0002,Sales,Jane Doe";
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(template));
    element.setAttribute("download", "employees-template.csv");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Card className="bg-white border border-gray-200 p-8 rounded-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Sales Reps</h1>
        <p className="text-gray-600">Invite your sales representatives to Tasknova</p>
      </div>

      <div className="space-y-6">
        {/* Add Employee Form */}
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Add Sales Rep</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="empName" className="text-xs font-semibold text-gray-700 mb-2 block">
                  Full Name
                </Label>
                <Input
                  id="empName"
                  type="text"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                  placeholder="John Smith"
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900"
                />
              </div>
              <div>
                <Label htmlFor="empEmail" className="text-xs font-semibold text-gray-700 mb-2 block">
                  Email
                </Label>
                <Input
                  id="empEmail"
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                  placeholder="john@company.com"
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="empPhone" className="text-xs font-semibold text-gray-700 mb-2 block">
                  Phone
                </Label>
                <Input
                  id="empPhone"
                  type="tel"
                  value={newEmployee.phone}
                  onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900"
                />
              </div>
              <div>
                <Label htmlFor="empDept" className="text-xs font-semibold text-gray-700 mb-2 block">
                  Department
                </Label>
                <select
                  id="empDept"
                  value={newEmployee.department}
                  onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900"
                >
                  <option value="">Select department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="empManager" className="text-xs font-semibold text-gray-700 mb-2 block">
                Assign to Manager
              </Label>
              <select
                id="empManager"
                value={newEmployee.managerId}
                onChange={(e) => setNewEmployee({ ...newEmployee, managerId: e.target.value })}
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900"
              >
                <option value="">Select manager (optional)</option>
                {managers.map((manager: any) => (
                  <option key={manager.id} value={manager.id}>{manager.name}</option>
                ))}
              </select>
              {managers.length === 0 && (
                <p className="text-xs text-amber-600 mt-2">⚠️ Please add managers first</p>
              )}
            </div>

            <button
              onClick={addEmployee}
              disabled={!newEmployee.name || !newEmployee.email}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Add Sales Rep
            </button>
          </div>
        </div>

        {/* CSV Upload Section */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <p className="text-sm text-gray-600 mb-4">Or upload multiple sales reps via CSV</p>
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

        {/* Employees List */}
        {employees.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Sales Reps ({employees.length})</h3>
            <div className="space-y-2">
              {employees.map((employee) => (
                <div
                  key={employee.id}
                  className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                    <p className="text-xs text-gray-600">{employee.email}</p>
                    <div className="flex gap-2 text-xs text-gray-500 mt-1">
                      {employee.department && <span>📋 {employee.department}</span>}
                      {employee.managerId && <span>👤 {getManagerName(employee.managerId)}</span>}
                      {employee.phone && <span>{employee.phone}</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => removeEmployee(employee.id)}
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
            💡 You can add sales reps individually or upload a CSV file. Assigning to a manager helps with organization but can be done later.
          </p>
        </div>
      </div>
    </Card>
  );
}
