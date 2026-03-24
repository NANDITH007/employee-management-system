import Dashboard from "./Dashboard";
import "./App.css";

const styles = {
  root: { padding: "0", fontFamily: "system-ui, sans-serif" },
  navBar: { background: "#fff", borderBottom: "0.5px solid #e5e5e5", position: "sticky", top: 0, zIndex: 100 },
  navContainer: { maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem", display: "flex", gap: "0" },
  navTab: (isActive) => ({ padding: "12px 16px", fontSize: 13, fontWeight: 500, color: isActive ? "#111" : "#888", borderBottom: isActive ? "2px solid #111" : "2px solid transparent", background: "none", border: "none", cursor: "pointer", transition: "all 0.2s ease" }),
  contentContainer: { padding: "2rem 1.5rem", maxWidth: 900, margin: "0 auto" },
  header: { marginBottom: "2rem" },
  h1: { fontSize: 22, fontWeight: 500, color: "#111", letterSpacing: -0.3, margin: 0 },
  subtitle: { fontSize: 13, color: "#888", marginTop: 4 },
  formCard: { background: "#fff", border: "0.5px solid #e5e5e5", borderRadius: 12, padding: "1.25rem", marginBottom: "1.5rem" },
  formGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 },
  field: { display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: 11, fontWeight: 500, color: "#888", textTransform: "uppercase", letterSpacing: 0.5 },
  input: { height: 36, padding: "0 10px", border: "0.5px solid #e5e5e5", borderRadius: 8, fontSize: 13, color: "#111", background: "#f9f9f9", fontFamily: "inherit", outline: "none" },
  formFooter: { marginTop: 12, display: "flex", justifyContent: "flex-end" },
  btnAdd: { height: 36, padding: "0 20px", background: "#111", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" },
  stats: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: "1.5rem" },
  stat: { background: "#f5f5f5", borderRadius: 8, padding: "1rem" },
  statLabel: { fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 },
  statValue: { fontSize: 22, fontWeight: 500, color: "#111" },
  tableCard: { background: "#fff", border: "0.5px solid #e5e5e5", borderRadius: 12, overflow: "hidden" },
  tableHeader: { padding: "12px 16px", borderBottom: "0.5px solid #e5e5e5", display: "flex", alignItems: "center", justifyContent: "space-between" },
  tableTitle: { fontSize: 13, fontWeight: 500 },
  searchInput: { height: 30, padding: "0 10px", border: "0.5px solid #e5e5e5", borderRadius: 8, fontSize: 12, background: "#f9f9f9", fontFamily: "inherit", outline: "none", width: 160 },
  table: { width: "100%", borderCollapse: "collapse", tableLayout: "fixed" },
  th: { padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 500, color: "#888", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "0.5px solid #e5e5e5" },
  td: { padding: "12px 16px", fontSize: 13, color: "#111", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  tdMuted: { padding: "12px 16px", fontSize: 13, color: "#888", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  nameCell: { display: "flex", alignItems: "center", gap: 8 },
  avatar: { width: 26, height: 26, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 500, background: "#dbeafe", color: "#1d4ed8", flexShrink: 0 },
  deptBadge: (dept) => ({ display: "inline-block", padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 500, ...getDeptStyle(dept) }),
  btnDelete: { background: "none", border: "0.5px solid #e5e5e5", borderRadius: 8, padding: "4px 10px", fontSize: 11, color: "#888", cursor: "pointer", fontFamily: "inherit" },
  empty: { padding: "2rem", textAlign: "center", fontSize: 13, color: "#888" },
  trStyle: { borderBottom: "0.5px solid #f0f0f0" },
};

export default function App() {
  return <Dashboard />;
}