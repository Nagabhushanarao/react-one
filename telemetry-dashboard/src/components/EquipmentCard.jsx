import React from "react";

export function EquipmentCard({ item, onSelect }) {
  const statusColors = {
    ONLINE: "#10b981",
    WARNING: "#f59e0b",
    CRITICAL: "#ef4444",
    OFFLINE: "#6b7280",
  };

  return (
    <div
      onClick={() => onSelect(item.id)}
      style={{
        border: "1px solid #334155",
        borderRadius: "8px",
        padding: "16px",
        backgroundColor: "#1e293b",
        color: "#f8fafc",
        cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <span style={{ fontWeight: 600 }}>{item.name}</span>
        <span
          style={{
            fontSize: "12px",
            padding: "2px 8px",
            borderRadius: "4px",
            backgroundColor: statusColors[item.status] || "#6b7280",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          {item.status}
        </span>
      </div>

      <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "12px" }}>
        ID: {item.id} | {item.location}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", fontSize: "13px" }}>
        <div>
          <div style={{ color: "#94a3b8", fontSize: "11px" }}>Temp</div>
          <strong>{item.metrics.temperature}°C</strong>
        </div>
        <div>
          <div style={{ color: "#94a3b8", fontSize: "11px" }}>Voltage</div>
          <strong>{item.metrics.voltage}V</strong>
        </div>
        <div>
          <div style={{ color: "#94a3b8", fontSize: "11px" }}>Load</div>
          <strong>{item.metrics.load}%</strong>
        </div>
      </div>
    </div>
  );
}
