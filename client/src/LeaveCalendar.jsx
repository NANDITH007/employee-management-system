import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { format, isWithinInterval, isEqual } from "date-fns";
import "react-calendar/dist/Calendar.css";

const styles = {
  container: { padding: "2rem 1.5rem", maxWidth: 1200, margin: "0 auto", fontFamily: "system-ui, sans-serif" },
  header: { marginBottom: "2rem" },
  h1: { fontSize: 22, fontWeight: 500, color: "#111", letterSpacing: -0.3, margin: 0 },
  subtitle: { fontSize: 13, color: "#888", marginTop: 4 },
  mainGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" },
  calendarCard: { background: "#fff", border: "0.5px solid #e5e5e5", borderRadius: 12, padding: "1.5rem" },
  calendarTitle: { fontSize: 14, fontWeight: 500, color: "#111", marginBottom: "1rem" },
  formCard: { background: "#fff", border: "0.5px solid #e5e5e5", borderRadius: 12, padding: "1.25rem" },
  formTitle: { fontSize: 14, fontWeight: 500, color: "#111", marginBottom: "1rem" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr", gap: 12 },
  field: { display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: 11, fontWeight: 500, color: "#888", textTransform: "uppercase", letterSpacing: 0.5 },
  input: { height: 36, padding: "0 10px", border: "0.5px solid #e5e5e5", borderRadius: 8, fontSize: 13, color: "#111", background: "#f9f9f9", fontFamily: "inherit", outline: "none" },
  select: { height: 36, padding: "0 10px", border: "0.5px solid #e5e5e5", borderRadius: 8, fontSize: 13, color: "#111", background: "#f9f9f9", fontFamily: "inherit", outline: "none" },
  textarea: { padding: "10px", border: "0.5px solid #e5e5e5", borderRadius: 8, fontSize: 13, color: "#111", background: "#f9f9f9", fontFamily: "inherit", outline: "none", resize: "vertical", minHeight: 60 },
  formFooter: { marginTop: 12, display: "flex", gap: 8, justifyContent: "flex-end" },
  btnSubmit: { height: 36, padding: "0 20px", background: "#111", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" },
  btnCancel: { height: 36, padding: "0 20px", background: "#f5f5f5", color: "#111", border: "0.5px solid #e5e5e5", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" },
  leavesList: { marginTop: "2rem" },
  leavesCard: { background: "#fff", border: "0.5px solid #e5e5e5", borderRadius: 12, overflow: "hidden" },
  leavesHeader: { padding: "12px 16px", borderBottom: "0.5px solid #e5e5e5", fontSize: 13, fontWeight: 500 },
  leaveItem: { padding: "12px 16px", borderBottom: "0.5px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center" },
  leaveInfo: { flex: 1, fontSize: 13, color: "#111" },
  leaveDate: { fontSize: 12, color: "#888" },
  leaveStatus: (status) => {
    const statuses = {
      APPROVED: { bg: "#EAFFED", color: "#0F6E56" },
      PENDING: { bg: "#FFF4E6", color: "#854F0B" },
      REJECTED: { bg: "#FFEDEB", color: "#C6221F" },
    };
    return { display: "inline-block", padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 500, ...statuses[status] };
  },
  leaveActions: { display: "flex", gap: 6 },
  btnSmall: { height: 28, padding: "0 10px", fontSize: 11, border: "0.5px solid #e5e5e5", borderRadius: 6, background: "#f9f9f9", cursor: "pointer", fontFamily: "inherit" },
  btnApprove: { height: 28, padding: "0 10px", fontSize: 11, border: "0.5px solid #0F6E56", borderRadius: 6, background: "#EAFFED", color: "#0F6E56", cursor: "pointer", fontFamily: "inherit", fontWeight: 500 },
  btnReject: { height: 28, padding: "0 10px", fontSize: 11, border: "0.5px solid #C6221F", borderRadius: 6, background: "#FFEDEB", color: "#C6221F", cursor: "pointer", fontFamily: "inherit", fontWeight: 500 },
  empty: { padding: "2rem", textAlign: "center", fontSize: 13, color: "#888" },
  selectEmployee: { marginBottom: "1.5rem" },
};

export default function LeaveCalendar() {
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ startDate: "", endDate: "", reason: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
  const EMPLOYEE_API = `${API_BASE}/employees`;
  const LEAVES_API = `${API_BASE}/leaves`;

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch(EMPLOYEE_API);
        if (!res.ok) throw new Error("Failed to fetch employees");
        const data = await res.json();
        setEmployees(Array.isArray(data) ? data : []);
        if (Array.isArray(data) && data.length > 0) {
          setSelectedEmployee(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
        setError(`Failed to load employees: ${error.message}`);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // Fetch leaves
  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await fetch(LEAVES_API);
        if (!res.ok) throw new Error("Failed to fetch leaves");
        const data = await res.json();
        setLeaves(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching leaves:", error);
      }
    };
    fetchLeaves();
  }, []);

  // Check if date has a leave
  const dateHasLeave = (date) => {
    return leaves.some((leave) => {
      const startDate = new Date(leave.startDate);
      const endDate = new Date(leave.endDate);
      return isWithinInterval(date, { start: startDate, end: endDate });
    });
  };

  // Get calendar CSS
  const getTileClassName = ({ date }) => {
    if (dateHasLeave(date)) {
      return "leave-day";
    }
    return "";
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!form.startDate || !form.endDate || !selectedEmployee) return;
    const newLeave = {
      employeeId: selectedEmployee,
      startDate: form.startDate,
      endDate: form.endDate,
      reason: form.reason || "Annual leave",
      status: "PENDING",
    };
    try {
      const res = await fetch(LEAVES_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLeave),
      });
      if (res.ok) {
        setForm({ startDate: "", endDate: "", reason: "" });
        setShowForm(false);
        // Refresh leaves
        const leavesRes = await fetch(LEAVES_API);
        const data = await leavesRes.json();
        setLeaves(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error creating leave:", error);
    }
  };

  // Update leave status
  const updateLeaveStatus = async (id, status) => {
    try {
      const res = await fetch(`${LEAVES_API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        // Refresh leaves
        const leavesRes = await fetch(LEAVES_API);
        const data = await leavesRes.json();
        setLeaves(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error updating leave:", error);
    }
  };

  // Delete leave
  const deleteLeave = async (id) => {
    try {
      const res = await fetch(`${LEAVES_API}/${id}`, { method: "DELETE" });
      if (res.ok) {
        // Refresh leaves
        const leavesRes = await fetch(LEAVES_API);
        const data = await leavesRes.json();
        setLeaves(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error deleting leave:", error);
    }
  };

  const employeeLeaves = leaves.filter((leave) => leave.employeeId === selectedEmployee);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.h1}>Leave Management</h1>
        <p style={styles.subtitle}>View and manage employee leaves</p>
      </div>

      {/* Error Banner */}
      {error && (
        <div style={{ background: "#FFEDEB", border: "0.5px solid #C6221F", color: "#C6221F", padding: "12px 16px", marginBottom: "1rem", borderRadius: 8 }}>
          ⚠️ {error}
        </div>
      )}

      {/* Loading State */}
      {loading && employees.length === 0 && (
        <div style={{ ...styles.empty, background: "#f9f9f9", borderRadius: 12, border: "0.5px solid #e5e5e5" }}>
          Loading employees and leaves...
        </div>
      )}

      {/* Employee Selection */}
      {employees.length > 0 && (
        <div style={styles.selectEmployee}>
          <label style={styles.label}>Select Employee</label>
          <select
            style={styles.select}
            value={selectedEmployee || ""}
            onChange={(e) => setSelectedEmployee(Number(e.target.value))}
          >
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Main Grid */}
      <div style={styles.mainGrid}>
        {/* Calendar */}
        <div style={styles.calendarCard}>
          <h3 style={styles.calendarTitle}>Leave Calendar</h3>
          <Calendar value={selectedDate} onChange={setSelectedDate} tileClassName={getTileClassName} />
          <style>{`
            .react-calendar {
              width: 100%;
              font-family: system-ui, sans-serif;
            }
            .react-calendar__tile {
              padding: 10px;
              font-size: 13px;
            }
            .leave-day {
              background-color: #FFA500 !important;
              color: white !important;
              font-weight: bold;
            }
          `}</style>
        </div>

        {/* Leave Request Form */}
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>Request Leave</h3>
          {showForm ? (
            <div style={styles.formGrid}>
              <div style={styles.field}>
                <label style={styles.label}>Start Date</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  style={styles.input}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>End Date</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  style={styles.input}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Reason</label>
                <textarea
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  placeholder="Enter reason for leave..."
                  style={styles.textarea}
                />
              </div>
              <div style={styles.formFooter}>
                <button style={styles.btnCancel} onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button style={styles.btnSubmit} onClick={handleSubmit}>
                  Submit Request
                </button>
              </div>
            </div>
          ) : (
            <button style={styles.btnSubmit} onClick={() => setShowForm(true)}>
              + Request New Leave
            </button>
          )}
        </div>
      </div>

      {/* Leaves List */}
      <div style={styles.leavesList}>
        <div style={styles.leavesCard}>
          <div style={styles.leavesHeader}>
            Leave Requests for Selected Employee
          </div>
          {employeeLeaves.length === 0 ? (
            <div style={styles.empty}>No leave requests found</div>
          ) : (
            employeeLeaves.map((leave) => (
              <div key={leave.id} style={styles.leaveItem}>
                <div style={styles.leaveInfo}>
                  <div>
                    {format(new Date(leave.startDate), "MMM dd")} -{" "}
                    {format(new Date(leave.endDate), "MMM dd, yyyy")} • {leave.reason}
                  </div>
                  <div style={styles.leaveDate}>
                    <span style={styles.leaveStatus(leave.status)}>{leave.status}</span>
                  </div>
                </div>
                <div style={styles.leaveActions}>
                  {leave.status === "PENDING" && (
                    <>
                      <button
                        style={styles.btnApprove}
                        onClick={() => updateLeaveStatus(leave.id, "APPROVED")}
                      >
                        Approve
                      </button>
                      <button
                        style={styles.btnReject}
                        onClick={() => updateLeaveStatus(leave.id, "REJECTED")}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    style={styles.btnSmall}
                    onClick={() => deleteLeave(leave.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
