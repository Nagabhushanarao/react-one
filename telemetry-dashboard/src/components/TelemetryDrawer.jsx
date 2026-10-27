import React from 'react'

export function TelemetryDrawer({ equipment, onClose, onUpdateStatus }) {
  if (!equipment) return null

  const getStatusColor = (status) => {
    switch (status) {
      case 'ONLINE': return '#22c55e'
      case 'WARNING': return '#eab308'
      case 'CRITICAL': return '#ef4444'
      default: return '#64748b'
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '380px',
        height: '100vh',
        backgroundColor: '#0f172a',
        borderLeft: '1px solid #334155',
        boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.5)',
        padding: '24px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        color: '#f8fafc',
        animation: 'slideIn 0.25s ease-out',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {equipment.id}
          </span>
          <h2 style={{ margin: '4px 0 0 0', fontSize: '20px' }}>{equipment.name}</h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>📍 {equipment.location}</p>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            fontSize: '22px',
            cursor: 'pointer',
            padding: '4px 8px',
          }}
        >
          ✕
        </button>
      </div>

      {/* Status Pill */}
      <div style={{ marginBottom: '24px' }}>
        <span
          style={{
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: 700,
            backgroundColor: `${getStatusColor(equipment.status)}22`,
            color: getStatusColor(equipment.status),
            border: `1px solid ${getStatusColor(equipment.status)}55`,
          }}
        >
          ● {equipment.status}
        </span>
      </div>

      {/* Telemetry Metrics Panel */}
      <div
        style={{
          backgroundColor: '#1e293b',
          borderRadius: '8px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginBottom: '24px',
        }}
      >
        <h4 style={{ margin: 0, fontSize: '13px', color: '#94a3b8', textTransform: 'uppercase' }}>
          Live Telemetry Readings
        </h4>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span style={{ color: '#cbd5e1' }}>Temperature</span>
          <strong style={{ color: equipment.metrics.temperature > 80 ? '#ef4444' : '#f8fafc' }}>
            {equipment.metrics.temperature}°C
          </strong>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span style={{ color: '#cbd5e1' }}>Pressure / Load</span>
          <strong>{equipment.metrics.pressure} PSI</strong>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span style={{ color: '#cbd5e1' }}>Power Consumption</span>
          <strong>{equipment.metrics.power} kW</strong>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span style={{ color: '#cbd5e1' }}>Uptime</span>
          <strong>{equipment.metrics.uptimeHours} hrs</strong>
        </div>
      </div>

      {/* Status Transition Actions (Immutable State Trigger) */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h4 style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>
          Operator Actions
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <button
            onClick={() => onUpdateStatus(equipment.id, 'ONLINE')}
            disabled={equipment.status === 'ONLINE'}
            style={{
              padding: '10px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#15803d',
              color: '#fff',
              fontWeight: 600,
              cursor: equipment.status === 'ONLINE' ? 'not-allowed' : 'pointer',
              opacity: equipment.status === 'ONLINE' ? 0.4 : 1,
            }}
          >
            Mark Online
          </button>
          <button
            onClick={() => onUpdateStatus(equipment.id, 'WARNING')}
            disabled={equipment.status === 'WARNING'}
            style={{
              padding: '10px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#a16207',
              color: '#fff',
              fontWeight: 600,
              cursor: equipment.status === 'WARNING' ? 'not-allowed' : 'pointer',
              opacity: equipment.status === 'WARNING' ? 0.4 : 1,
            }}
          >
            Flag Warning
          </button>
        </div>
        <button
          onClick={() => onUpdateStatus(equipment.id, 'CRITICAL')}
          disabled={equipment.status === 'CRITICAL'}
          style={{
            padding: '10px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#b91c1c',
            color: '#fff',
            fontWeight: 600,
            cursor: equipment.status === 'CRITICAL' ? 'not-allowed' : 'pointer',
            opacity: equipment.status === 'CRITICAL' ? 0.4 : 1,
          }}
        >
          🚨 Escalate to Critical
        </button>
      </div>
    </div>
  )
}
