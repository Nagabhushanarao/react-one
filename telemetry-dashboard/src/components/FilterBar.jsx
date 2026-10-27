import React from 'react'

const STATUS_OPTIONS = ['ALL', 'ONLINE', 'WARNING', 'CRITICAL', 'OFFLINE']

export function FilterBar({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  totalCount,
  filteredCount,
}) {
  return (
    <div
      style={{
        backgroundColor: '#1e293b',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1px solid #334155',
      }}
    >
      {/* Search Input */}
      <input
        type="text"
        placeholder="🔍 Search equipment or location..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{
          flex: '1 1 240px',
          padding: '8px 12px',
          borderRadius: '6px',
          border: '1px solid #475569',
          backgroundColor: '#0f172a',
          color: '#f8fafc',
          outline: 'none',
        }}
      />

      {/* Status Filter Buttons */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {STATUS_OPTIONS.map((status) => {
          const isActive = selectedStatus === status
          return (
            <button
              key={status}
              onClick={() => onStatusChange(status)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 600,
                backgroundColor: isActive ? '#3b82f6' : '#334155',
                color: isActive ? '#ffffff' : '#94a3b8',
                transition: 'all 0.2s ease',
              }}
            >
              {status}
            </button>
          )
        })}
      </div>

      {/* Results Counter */}
      <div style={{ fontSize: '13px', color: '#94a3b8' }}>
        Showing <strong>{filteredCount}</strong> of {totalCount} units
      </div>
    </div>
  )
}
