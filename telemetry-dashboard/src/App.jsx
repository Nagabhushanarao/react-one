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

  // 5. Live Telemetry Stream Simulation State
  const [isStreaming, setIsStreaming] = useState(false)

  // Initial fetch from Supabase
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

  // Live Stream Simulation: Fluctuates telemetry readings periodically
  useEffect(() => {
    if (!isStreaming) return

    const streamInterval = setInterval(() => {
      setEquipmentList((prevList) =>
        prevList.map((item) => {
          if (item.status === 'OFFLINE') return item

          // Add minor realistic jitter (-1.5 to +1.5)
          const jitter = (Math.random() * 3 - 1.5).toFixed(1)
          const newTemp = Math.max(20, +(item.metrics.temperature + parseFloat(jitter)).toFixed(1))
          const newLoad = Math.min(100, Math.max(10, Math.round(item.metrics.load + (Math.random() * 6 - 3))))

          return {
            ...item,
            metrics: {
              ...item.metrics,
              temperature: newTemp,
              load: newLoad,
            },
            lastUpdated: new Date().toLocaleTimeString(),
          }
        })
      )
    }, 2500)

    // Critical Cleanup: Always clear interval to avoid memory leaks and ghost updates
    return () => clearInterval(streamInterval)
  }, [isStreaming])

  // 6. Derived State: Filtered list
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

  // 7. Derived State: Selected equipment
  const selectedEquipment = filteredEquipment.find((item) => item.id === selectedEquipmentId)

  // 8. Optimistic Update (Drawer)
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
      if (error) console.error('Supabase update failed:', error.message)
    } catch (err) {
      console.error('Network error during status update:', err)
    }
  }

  // 9. Optimistic Addition (Modal)
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
      if (error) console.error('Supabase insert failed:', error.message)
    } catch (err) {
      console.error('Network error during insert:', err)
    }
  }

  return (
    <div style={{ padding: '24px', maxWidth: '850px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
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

        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Live Streaming Toggle */}
          <button
            onClick={() => setIsStreaming((prev) => !prev)}
            style={{
              backgroundColor: isStreaming ? '#dc2626' : '#059669',
              color: '#fff',
              border: 'none',
              padding: '10px 14px',
              borderRadius: '6px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {isStreaming ? '⏹ Stop Stream' : '▶ Start Live Stream'}
          </button>

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
        </div>
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
