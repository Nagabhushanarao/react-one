import React, { useState } from 'react'
import './App.css'
import { INITIAL_EQUIPMENT } from './Data/mockEquipment'
import { EquipmentCard } from './components/EquipmentCard'
import { FilterBar } from './components/FilterBar'
import { TelemetryDrawer } from './components/TelemetryDrawer'
import { Modal } from './components/Modal'
import { AddEquipmentForm } from './components/AddEquipmentForm'

function App() {
  // 1. Raw State
  const [equipmentList, setEquipmentList] = useState(INITIAL_EQUIPMENT)

  // 2. Filter States
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('ALL')

  // 3. Selection State (ID only)
  const [selectedEquipmentId, setSelectedEquipmentId] = useState(null)

  // 4. Modal Dialog State
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 5. Derived State: Filtered list
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

  // 6. Derived State: Scope selection to the active filtered set
  const selectedEquipment = filteredEquipment.find((item) => item.id === selectedEquipmentId)

  // 7. Immutable Update: Handles status changes from the Drawer
  const handleUpdateStatus = (id, newStatus) => {
    setEquipmentList((prevList) =>
      prevList.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    )
  }

  // 8. Immutable Addition: Prepends new equipment to the fleet
  const handleAddEquipment = (newUnit) => {
    setEquipmentList((prevList) => [newUnit, ...prevList])
    setIsModalOpen(false)
  }

  return (
    <div style={{ padding: '24px', maxWidth: '850px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: '0 0 6px 0', fontSize: '24px' }}>⚡ Telemetry Operations Hub</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
            Real-time facility equipment monitoring & diagnostics
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            backgroundColor: '#3b82f6',
            color: '#fff',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '6px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          + Add Unit
        </button>
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

      {/* Inspection Drawer */}
      <TelemetryDrawer
        equipment={selectedEquipment}
        onClose={() => setSelectedEquipmentId(null)}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Reusable Modal utilizing Component Composition */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Fleet Equipment"
      >
        <AddEquipmentForm
          onAddEquipment={handleAddEquipment}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  )
}

export default App
