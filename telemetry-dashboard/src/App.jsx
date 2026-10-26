import React, { useState } from 'react'
import './App.css'
import { INITIAL_EQUIPMENT } from './Data/mockEquipment'
import { EquipmentCard } from './components/EquipmentCard'

function App() {
  const [equipmentList, setEquipmentList] = useState(INITIAL_EQUIPMENT)

  // Function to reverse the order of items
  const handleReverse = () => {
    setEquipmentList([...equipmentList].reverse())
  }

  const handleSelect = (id) => {
    console.log('Equipment selected:', id)
  }

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>Equipment Telemetry (Key Reconciliation Drill)</h2>

      <div style={{ marginBottom: '16px' }}>
        <button
          onClick={handleReverse}
          style={{
            padding: '10px 16px',
            backgroundColor: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          🔀 Reverse List Order
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {equipmentList.map((item, index) => (
          /* TEST 1: Using key={index} on the outer wrapper */
          <div
            key={item.id}
            style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
          >
            <input type="checkbox" style={{ transform: 'scale(1.3)' }} />
            <div style={{ flex: 1 }}>
              <EquipmentCard item={item} onSelect={handleSelect} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
