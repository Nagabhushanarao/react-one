import React, { useRef } from 'react'

export function AddEquipmentForm({ onAddEquipment, onCancel }) {
  // Uncontrolled Form: We do NOT use useState for each keystroke!
  // We use a single form ref and grab all fields cleanly on submit.
  const formRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()

    const formData = new FormData(formRef.current)
    const name = formData.get('name')?.trim()
    const location = formData.get('location')?.trim()
    const status = formData.get('status')
    const temperature = parseFloat(formData.get('temperature')) || 50
    const voltage = parseFloat(formData.get('voltage')) || 400
    const load = parseInt(formData.get('load'), 10) || 50

    if (!name || !location) {
      alert('Please enter both equipment name and location.')
      return
    }

    const newUnit = {
      id: `EQ-${Math.floor(100 + Math.random() * 900)}`,
      name,
      location,
      status,
      metrics: {
        temperature,
        voltage,
        load,
        pressure: 75,
        power: 18.5,
        uptimeHours: 0,
      },
      lastUpdated: new Date().toLocaleTimeString(),
    }

    onAddEquipment(newUnit)
  }

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    backgroundColor: '#0f172a',
    border: '1px solid #475569',
    borderRadius: '6px',
    color: '#f8fafc',
    boxSizing: 'border-box',
    marginBottom: '12px',
    outline: 'none',
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '4px' }}>
        Equipment Name
      </label>
      <input
        name="name"
        type="text"
        placeholder="e.g. Primary Water Pump 2"
        required
        style={inputStyle}
      />

      <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '4px' }}>
        Facility Location
      </label>
      <input
        name="location"
        type="text"
        placeholder="e.g. Rooftop Utility Bay"
        required
        style={inputStyle}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '4px' }}>
            Initial Status
          </label>
          <select name="status" defaultValue="ONLINE" style={inputStyle}>
            <option value="ONLINE">ONLINE</option>
            <option value="WARNING">WARNING</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="OFFLINE">OFFLINE</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '4px' }}>
            Temp (°C)
          </label>
          <input
            name="temperature"
            type="number"
            defaultValue="65"
            step="0.1"
            style={inputStyle}
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '8px 16px',
            backgroundColor: '#334155',
            color: '#cbd5e1',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          style={{
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          + Register Equipment
        </button>
      </div>
    </form>
  )
}
