import React, { useRef } from 'react'

export function EquipmentCard({ item, onSelect }) {
  // Render Tracker: useRef maintains value across renders WITHOUT triggering re-renders
  const renderCount = useRef(0)
  renderCount.current += 1

  const statusColors = {
    ONLINE: '#10b981',
    WARNING: '#f59e0b',
    CRITICAL: '#ef4444',
    OFFLINE: '#6b7280',
  }

  return (
    <div
      onClick={() => onSelect(item.id)}
      style={{
        border: '1px solid #334155',
        borderRadius: '8px',
        padding: '16px',
        backgroundColor: '#1e293b',
        color: '#f8fafc',
        cursor: 'pointer',
        position: 'relative',
        transition: 'transform 0.15s ease, border-color 0.15s ease',
      }}
    >
      {/* Visual Render Badge: Shows how many times Fiber re-executed this card */}
      <span
        title="Number of times this component re-rendered"
        style={{
          position: 'absolute',
          top: '-8px',
          right: '12px',
          backgroundColor: '#6366f1',
          color: '#ffffff',
          fontSize: '10px',
          fontWeight: 700,
          padding: '2px 6px',
          borderRadius: '9999px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          letterSpacing: '0.5px',
        }}
      >
        Render #{renderCount.current}
      </span>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', marginTop: '4px' }}>
        <span style={{ fontWeight: 600 }}>{item.name}</span>
        <span
          style={{
            fontSize: '11px',
            padding: '2px 8px',
            borderRadius: '4px',
            backgroundColor: statusColors[item.status] || '#6b7280',
            color: '#fff',
            fontWeight: 'bold',
          }}
        >
          {item.status}
        </span>
      </div>

      <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '12px' }}>
        ID: {item.id} | 📍 {item.location}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', fontSize: '13px' }}>
        <div>
          <div style={{ color: '#94a3b8', fontSize: '11px' }}>Temp</div>
          <strong>{item.metrics.temperature}°C</strong>
        </div>
        <div>
          <div style={{ color: '#94a3b8', fontSize: '11px' }}>Voltage</div>
          <strong>{item.metrics.voltage}V</strong>
        </div>
        <div>
          <div style={{ color: '#94a3b8', fontSize: '11px' }}>Load</div>
          <strong>{item.metrics.load}%</strong>
        </div>
      </div>
    </div>
  )
}
