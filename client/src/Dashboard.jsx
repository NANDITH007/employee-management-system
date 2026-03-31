import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { format } from "date-fns";
import "react-calendar/dist/Calendar.css";
import "./Dashboard.css";
import { EMPLOYEE_API, LEAVES_API, authFetch } from "./lib/api";

export default function Dashboard({ onLogout }) {
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [form, setForm] = useState({ startDate: "", endDate: "", reason: "" });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [search, setSearch] = useState("");
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [employeeForm, setEmployeeForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
    salary: "",
  });

  useEffect(() => {
    fetchEmployees();
    fetchLeaves();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await authFetch(EMPLOYEE_API);
      const data = await res.json();
      setEmployees(Array.isArray(data) ? data : []);
      if (Array.isArray(data) && data.length > 0 && !selectedEmployee) {
        setSelectedEmployee(data[0]);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchLeaves = async () => {
    try {
      const res = await authFetch(LEAVES_API);
      const data = await res.json();
      setLeaves(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    }
  };

  const getEmployeeInitials = (firstName, lastName) => {
    return (firstName?.[0] || "") + (lastName?.[0] || "");
  };

  const getEmployeeLeaves = () => {
    if (!selectedEmployee) return [];
    return leaves.filter((leave) => leave.employeeId === selectedEmployee.id);
  };

  const handleEmployeeChange = (e) => {
    const { name, value } = e.target;
    setEmployeeForm({ ...employeeForm, [name]: value });
  };

  const handleAddEmployee = async () => {
    if (!employeeForm.firstName || !employeeForm.lastName || !employeeForm.email) {
      alert("Please fill in all required fields");
      return;
    }
    try {
      const res = await authFetch(EMPLOYEE_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeForm),
      });
      if (res.ok) {
        setEmployeeForm({ firstName: "", lastName: "", email: "", department: "", salary: "" });
        setShowEmployeeForm(false);
        fetchEmployees();
      } else {
        alert("Failed to add employee");
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      alert("Error adding employee");
    }
  };

  const handleLeaveSubmit = async () => {
    if (!form.startDate || !form.endDate) {
      setError("Please select both start and end dates");
      return;
    }
    if (!selectedEmployee) {
      setError("Please select an employee first");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch(LEAVES_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: selectedEmployee.id,
          startDate: form.startDate,
          endDate: form.endDate,
          reason: form.reason || "Leave",
          status: "PENDING",
        }),
      });
      if (res.ok) {
        setForm({ startDate: "", endDate: "", reason: "" });
        setShowLeaveForm(false);
        setError(null);
        fetchLeaves();
      } else {
        setError("Failed to submit leave request");
      }
    } catch (error) {
      console.error("Error submitting leave:", error);
      setError("Error submitting leave request: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const approveLeave = async (leaveId) => {
    try {
      await authFetch(`${LEAVES_API}/${leaveId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "APPROVED" }),
      });
      fetchLeaves();
    } catch (error) {
      console.error("Error approving leave:", error);
    }
  };

  const rejectLeave = async (leaveId) => {
    try {
      await authFetch(`${LEAVES_API}/${leaveId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "REJECTED" }),
      });
      fetchLeaves();
    } catch (error) {
      console.error("Error rejecting leave:", error);
    }
  };

  const employeeLeaves = getEmployeeLeaves();
  const filteredEmployees = employees.filter((emp) =>
    `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  const avgSalary = selectedEmployee
    ? Math.round(selectedEmployee.salary || 0)
    : employees.length
    ? Math.round(employees.reduce((sum, e) => sum + (e.salary || 0), 0) / employees.length)
    : 0;

  const getLeaveStats = () => {
    const approvedLeaves = employeeLeaves.filter((l) => l.status === "APPROVED");
    const pendingLeaves = employeeLeaves.filter((l) => l.status === "PENDING");
    
    let approvedDays = 0;
    let pendingDays = 0;

    approvedLeaves.forEach((l) => {
      const start = new Date(l.startDate);
      const end = new Date(l.endDate);
      approvedDays += Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    });

    pendingLeaves.forEach((l) => {
      const start = new Date(l.startDate);
      const end = new Date(l.endDate);
      pendingDays += Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    });

    return { approvedDays, pendingDays, totalLeaves: employeeLeaves.length };
  };

  const leaveStats = getLeaveStats();

  // Render calendar tiles with leave highlighting
  const getTileClassName = ({ date }) => {
    const isLeaveDay = employeeLeaves.some((leave) => {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      return date >= start && date <= end;
    });
    return isLeaveDay ? "leave-highlight" : "";
  };

  return (
    <div className="dashboard">
      {/* Left Sidebar - Employee List */}
      <aside className="sidebar-left">
        <div className="sidebar-header">
          <h2>Team Members</h2>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button 
              className="btn-add-header" 
              onClick={() => setShowEmployeeForm(!showEmployeeForm)}
              title="Add new employee"
            >
              {showEmployeeForm ? "✕" : "+"}
            </button>
            {onLogout && (
              <button 
                className="btn-add-header" 
                onClick={onLogout}
                title="Sign out"
                style={{ fontSize: '14px' }}
              >
                🚪
              </button>
            )}
          </div>
        </div>

        {showEmployeeForm && (
          <div className="employee-form">
            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                name="firstName"
                placeholder="Enter first name"
                value={employeeForm.firstName}
                onChange={handleEmployeeChange}
              />
            </div>
            <div className="form-group">
              <label>Last Name *</label>
              <input
                type="text"
                name="lastName"
                placeholder="Enter last name"
                value={employeeForm.lastName}
                onChange={handleEmployeeChange}
              />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={employeeForm.email}
                onChange={handleEmployeeChange}
              />
            </div>
            <div className="form-group">
              <label>Department</label>
              <input
                type="text"
                name="department"
                placeholder="Enter department"
                value={employeeForm.department}
                onChange={handleEmployeeChange}
              />
            </div>
            <div className="form-group">
              <label>Salary</label>
              <input
                type="number"
                name="salary"
                placeholder="Enter salary"
                value={employeeForm.salary}
                onChange={handleEmployeeChange}
              />
            </div>
            <button className="btn-submit-form" onClick={handleAddEmployee}>
              Add Employee
            </button>
          </div>
        )}

        <div className="search-box">
          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="employee-list">
          {filteredEmployees.map((emp) => (
            <div
              key={emp.id}
              className={`employee-item ${selectedEmployee?.id === emp.id ? "active" : ""}`}
              onClick={() => setSelectedEmployee(emp)}
            >
              <div className="employee-avatar">{getEmployeeInitials(emp.firstName, emp.lastName)}</div>
              <div className="employee-info">
                <p className="employee-name">
                  {emp.firstName} {emp.lastName}
                </p>
                <p className="employee-role">{emp.department}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Center - Main Content */}
      <main className="main-content">
        {employees.length === 0 ? (
          <div className="empty-state-main">
            <p>No employees found. Add an employee first using the "+" button.</p>
          </div>
        ) : !selectedEmployee ? (
          <div className="empty-state-main">
            <p>Select an employee from the list to view details.</p>
          </div>
        ) : (
          <>
            {/* Header Section */}
            <div className="content-header">
              <div className="header-info">
                <h1>
                  {selectedEmployee.firstName} {selectedEmployee.lastName}
                </h1>
                <p className="header-subtitle">{selectedEmployee.department} • {selectedEmployee.email}</p>
              </div>
              <div className="header-stats">
                <div className="stat-box">
                  <span className="stat-label">Salary</span>
                  <span className="stat-value">${Number(selectedEmployee.salary).toLocaleString()}</span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Leaves</span>
                  <span className="stat-value">{leaveStats.approvedDays} days</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="tabs">
              <button className={`tab ${activeTab === "overview" ? "active" : ""}`} onClick={() => setActiveTab("overview")}>
                📊 Overview
              </button>
              <button className={`tab ${activeTab === "calendar" ? "active" : ""}`} onClick={() => setActiveTab("calendar")}>
                📅 Calendar
              </button>
              <button className={`tab ${activeTab === "leaves" ? "active" : ""}`} onClick={() => setActiveTab("leaves")}>
                🏖️ Leaves
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div className="tab-content">
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon approved">✓</div>
                    <div className="stat-details">
                      <p className="stat-title">Approved Leaves</p>
                      <p className="stat-number">{leaveStats.approvedDays} days</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon pending">⏳</div>
                    <div className="stat-details">
                      <p className="stat-title">Pending Leaves</p>
                      <p className="stat-number">{leaveStats.pendingDays} days</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon total">📋</div>
                    <div className="stat-details">
                      <p className="stat-title">Total Requests</p>
                      <p className="stat-number">{leaveStats.totalLeaves}</p>
                    </div>
                  </div>
                </div>

                <div className="info-section">
                  <h3>Employee Details</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-icon">📧</span>
                      <div>
                        <p className="info-label">Email</p>
                        <p className="info-value">{selectedEmployee.email}</p>
                      </div>
                    </div>
                    <div className="info-item">
                      <span className="info-icon">🏢</span>
                      <div>
                        <p className="info-label">Department</p>
                        <p className="info-value">{selectedEmployee.department}</p>
                      </div>
                    </div>
                    <div className="info-item">
                      <span className="info-icon">💰</span>
                      <div>
                        <p className="info-label">Monthly Salary</p>
                        <p className="info-value">${Number(selectedEmployee.salary).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "calendar" && (
              <div className="tab-content">
                <div className="calendar-container">
                  <Calendar
                    value={selectedDate}
                    onChange={setSelectedDate}
                    tileClassName={getTileClassName}
                  />
                </div>
              </div>
            )}

            {activeTab === "leaves" && (
              <div className="tab-content">
                {error && (
                  <div className="error-banner">
                    <span>❌ {error}</span>
                    <button onClick={() => setError(null)}>✕</button>
                  </div>
                )}
                <div className="leaves-header">
                  <h3>Leave Requests</h3>
                  <button className="btn-primary" onClick={() => setShowLeaveForm(!showLeaveForm)}>
                    {showLeaveForm ? "✕ Cancel" : "+ Request Leave"}
                  </button>
                </div>

                {showLeaveForm && (
                  <div className="leave-form">
                    <div className="form-group">
                      <label>Start Date</label>
                      <input
                        type="date"
                        value={form.startDate}
                        onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>End Date</label>
                      <input
                        type="date"
                        value={form.endDate}
                        onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Reason</label>
                      <textarea
                        value={form.reason}
                        onChange={(e) => setForm({ ...form, reason: e.target.value })}
                        placeholder="Enter reason for leave..."
                      />
                    </div>
                    <button className="btn-submit" onClick={handleLeaveSubmit}>
                      Submit Request
                    </button>
                  </div>
                )}

                <div className="leaves-list">
                  {employeeLeaves.length === 0 ? (
                    <div className="empty-state">No leave requests</div>
                  ) : (
                    employeeLeaves.map((leave) => (
                      <div key={leave.id} className={`leave-item leave-${leave.status.toLowerCase()}`}>
                        <div className="leave-info">
                          <p className="leave-dates">
                            {format(new Date(leave.startDate), "MMM dd")} → {format(new Date(leave.endDate), "MMM dd, yyyy")}
                          </p>
                          <p className="leave-reason">{leave.reason}</p>
                          <span className={`leave-badge ${leave.status.toLowerCase()}`}>{leave.status}</span>
                        </div>
                        {leave.status === "PENDING" && (
                          <div className="leave-actions">
                            <button
                              className="btn-approve"
                              onClick={() => approveLeave(leave.id)}
                            >
                              Approve
                            </button>
                            <button
                              className="btn-reject"
                              onClick={() => rejectLeave(leave.id)}
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Right Sidebar - Employee Profile */}
      {selectedEmployee && (
        <aside className="sidebar-right">
          <div className="profile-card">
            <div className="profile-avatar-large">{getEmployeeInitials(selectedEmployee.firstName, selectedEmployee.lastName)}</div>
            <h3>{selectedEmployee.firstName} {selectedEmployee.lastName}</h3>
            <p className="profile-role">{selectedEmployee.department}</p>

            <div className="profile-section">
              <h4>Contact Information</h4>
              <div className="profile-item">
                <span className="label">Email:</span>
                <span className="value">{selectedEmployee.email}</span>
              </div>
            </div>

            <div className="profile-section">
              <h4>Compensation</h4>
              <div className="profile-item">
                <span className="label">Annual Salary:</span>
                <span className="value salary">${Number(selectedEmployee.salary).toLocaleString()}</span>
              </div>
              <div className="profile-item">
                <span className="label">Monthly:</span>
                <span className="value">${Math.round(selectedEmployee.salary / 12).toLocaleString()}</span>
              </div>
            </div>

            <div className="profile-section">
              <h4>Leave Summary</h4>
              <div className="leave-summary">
                <div className="summary-item">
                  <span>Approved</span>
                  <strong>{leaveStats.approvedDays}</strong>
                </div>
                <div className="summary-item">
                  <span>Pending</span>
                  <strong>{leaveStats.pendingDays}</strong>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h4>Statistics</h4>
              <div className="stats-mini">
                <div className="stat-bar">
                  <div className="bar-label">Utilization</div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: "65%" }}></div>
                  </div>
                  <div className="bar-percent">65%</div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
