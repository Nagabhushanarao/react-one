import React, { useState, useEffect } from 'react'
import './App.css'
import { INITIAL_EQUIPMENT } from './Data/mockEquipment'
import { EquipmentCard } from './components/EquipmentCard'
import { FilterBar } from './components/FilterBar'
import { TelemetryDrawer } from './components/TelemetryDrawer'
import { Modal } from './components/Modal'
import { AddEquipmentForm } from './components/AddEquipmentForm'
import { supabase } from './lib/supabaseClient'

function App() {
  // 1. Raw State & Async Loading State
  const [equipmentList, setEquipmentList] = useState(INITIAL_EQUIPMENT)
  const [isLoading, setIsLoading] = useState(true)
  const [isCloudSynced, setIsCloudSynced] = useState(false)

  // 2. Filter States
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('ALL')

  // 3. Selection State (ID only)
  const [selectedEquipmentId, setSelectedEquipmentId] = useState(null)

  // 4. Modal Dialog State
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Fetch initial fleet data from Supabase
  useEffect(() => {
    async function fetchFleet() {
      try {
        const { data, error } = await supabase
          .from('equipment')
          .select('*')
          .order('id', { ascending: true })

        if (error) {
          console.warn('Supabase fetch notice:', error.message)
          setIsCloudSynced(false)
        } else if (data && data.length > 0) {
          const normalized = data.map((item) => ({
            ...item,
            lastUpdated: item.last_updated || item.lastUpdated || new Date().toLocaleTimeString(),
          }))
          setEquipmentList(normalized)
          setIsCloudSynced(true)
        } else {
          // Table exists but is currently empty: keep INITIAL_EQUIPMENT and mark connected
          setIsCloudSynced(true)
        }
      } catch (err) {
        console.error('Supabase connection error:', err)
        setIsCloudSynced(false)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFleet()
  }, [])

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

  // 7. Optimistic Update: Updates UI immediately, syncs to Supabase in background
  const handleUpdateStatus = async (id, newStatus) => {
    setEquipmentList((prevList) =>
      prevList.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    )

    try {
      const { error } = await supabase
        .from('equipment')
        .update({ status: newStatus })
        .eq('id', id)
      if (error) {
        console.error('Supabase update failed:', error.message)
      }
    } catch (err) {
      console.error('Network error during status update:', err)
    }
  }

  // 8. Optimistic Addition: Prepends unit to UI immediately, syncs to Supabase in background
  const handleAddEquipment = async (newUnit) => {
    setEquipmentList((prevList) => [newUnit, ...prevList])
    setIsModalOpen(false)

    try {
      const payload = {
        id: newUnit.id,
        name: newUnit.name,
        location: newUnit.location,
        status: newUnit.status,
        metrics: newUnit.metrics,
        last_updated: newUnit.lastUpdated,
      }
      const { error } = await supabase.from('equipment').insert([payload])
      if (error) {
        console.error('Supabase insert failed:', error.message)
      }
    } catch (err) {
      console.error('Network error during insert:', err)
    }
  }

  return (
    <div style={{ padding: '24px', maxWidth: '850px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <h1 style={{ margin: '0 0 6px 0', fontSize: '24px' }}>⚡ Telemetry Operations Hub</h1>
            <span
              style={{
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: '9999px',
                fontWeight: 600,
                backgroundColor: isCloudSynced ? '#15803d22' : '#ca8a0422',
                color: isCloudSynced ? '#22c55e' : '#eab308',
                border: `1px solid ${isCloudSynced ? '#22c55e55' : '#eab30855'}`,
              }}
            >
              {isCloudSynced ? '● Cloud Synced' : '○ Local Fallback'}
            </span>
          </div>
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
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
          ⏳ Connecting to Supabase Cloud Database...
        </div>
      ) : filteredEquipment.length === 0 ? (
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
