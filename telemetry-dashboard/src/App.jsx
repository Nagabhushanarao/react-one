import React, { useState } from 'react'
import './App.css'
import { INITIAL_EQUIPMENT } from './Data/mockEquipment'
import { EquipmentCard } from './components/EquipmentCard'
import { FilterBar } from './components/FilterBar'
import { TelemetryDrawer } from './components/TelemetryDrawer'

function App() {
  // 1. Raw State
  const [equipmentList, setEquipmentList] = useState(INITIAL_EQUIPMENT)

  // 2. Filter States
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('ALL')

  // 3. Selection State: Store ID only, NEVER the entire duplicate object
  const [selectedEquipmentId, setSelectedEquipmentId] = useState(null)

  // 4. Derived State: Filtered list
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

  // 5. Derived State: Selected item derived from filteredEquipment
  // If an item drops out of the active filter/search, it automatically deselects!
  const selectedEquipment = filteredEquipment.find((item) => item.id === selectedEquipmentId)

  // 6. Immutable Update: Handles status changes from the Drawer
  const handleUpdateStatus = (id, newStatus) => {
    setEquipmentList((prevList) =>
      prevList.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    )
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
            <EquipmentCard
              key={item.id}
              item={item}
              onSelect={setSelectedEquipmentId}
            />
          ))}
        </div>
      )}

      {/* Inspection Drawer (Lifted State Consumer) */}
      <TelemetryDrawer
        equipment={selectedEquipment}
        onClose={() => setSelectedEquipmentId(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  )
}

export default App
