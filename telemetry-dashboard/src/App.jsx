import React, { useState } from 'react'
import './App.css'
import { INITIAL_EQUIPMENT } from './Data/mockEquipment'
import { EquipmentCard } from './components/EquipmentCard'
import { FilterBar } from './components/FilterBar'

function App() {
  // 1. Raw Data State
  const [equipmentList] = useState(INITIAL_EQUIPMENT)

  // 2. Filter Criteria States
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('ALL')

  // 3. Derived State: Computed during render
  const filteredEquipment = equipmentList.filter((item) => {
    const matchesStatus =
      selectedStatus === 'ALL' || item.status === selectedStatus

    const query = searchQuery.toLowerCase().trim()
    const matchesSearch =
      item.name.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query) ||
      item.id.toLowerCase().includes(query)

    return matchesStatus && matchesSearch
  })

  const handleSelect = (id) => {
    console.log('Equipment selected:', id)
  }

  return (
    <div style={{ padding: '24px', maxWidth: '850px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: '20px' }}>
        <h1 style={{ margin: '0 0 6px 0', fontSize: '24px' }}>⚡ Telemetry Operations Hub</h1>
        <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
          Real-time facility equipment monitoring & diagnostics
        </p>
      </header>

      {/* Controlled Filter Component */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        totalCount={equipmentList.length}
        filteredCount={filteredEquipment.length}
      />

      {/* Equipment Grid */}
      {filteredEquipment.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
          No equipment matches your search or filter.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
          {filteredEquipment.map((item) => (
            <EquipmentCard key={item.id} item={item} onSelect={handleSelect} />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
