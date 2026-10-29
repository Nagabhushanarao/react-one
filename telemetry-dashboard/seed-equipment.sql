-- Telemetry Fleet Database Seed Script
-- Run this in Supabase: Dashboard > SQL Editor > New Query

-- 1. Ensure Row Level Security allows public read/write from our frontend
ALTER TABLE equipment DISABLE ROW LEVEL SECURITY;

-- 2. Insert or Upsert all fleet units (Idempotent: safe to run multiple times)
INSERT INTO equipment (id, name, location, status, metrics, last_updated)
VALUES
(
  'EQ-101',
  'Chiller Unit A1',
  'Basement Plant Room',
  'ONLINE',
  '{"temperature": 68.4, "voltage": 415.2, "load": 74, "pressure": 82.5, "power": 45.2, "uptimeHours": 1240}'::jsonb,
  TO_CHAR(NOW(), 'HH12:MI:SS AM')
),
(
  'EQ-102',
  'Air Handling Unit 3',
  'Floor 4 Mechanical Room',
  'WARNING',
  '{"temperature": 84.1, "voltage": 408.0, "load": 89, "pressure": 91.0, "power": 28.6, "uptimeHours": 680}'::jsonb,
  TO_CHAR(NOW(), 'HH12:MI:SS AM')
),
(
  'EQ-103',
  'Backup Diesel Generator',
  'Substation Yard',
  'CRITICAL',
  '{"temperature": 95.8, "voltage": 395.5, "load": 96, "pressure": 104.2, "power": 120.0, "uptimeHours": 145}'::jsonb,
  TO_CHAR(NOW(), 'HH12:MI:SS AM')
),
(
  'EQ-104',
  'Cooling Tower Pump B',
  'Roof Level',
  'ONLINE',
  '{"temperature": 62.0, "voltage": 416.0, "load": 60, "pressure": 74.8, "power": 18.5, "uptimeHours": 2190}'::jsonb,
  TO_CHAR(NOW(), 'HH12:MI:SS AM')
),
(
  'EQ-105',
  'Main UPS Battery Bank 1',
  'Server Room B2',
  'ONLINE',
  '{"temperature": 24.5, "voltage": 420.0, "load": 52, "pressure": 45.0, "power": 34.0, "uptimeHours": 4320}'::jsonb,
  TO_CHAR(NOW(), 'HH12:MI:SS AM')
),
(
  'EQ-106',
  'Fire Suppression Booster',
  'Pump House North',
  'ONLINE',
  '{"temperature": 48.2, "voltage": 412.5, "load": 30, "pressure": 125.0, "power": 15.2, "uptimeHours": 850}'::jsonb,
  TO_CHAR(NOW(), 'HH12:MI:SS AM')
),
(
  'EQ-107',
  'HVAC Compressor C2',
  'Floor 8 Rooftop Deck',
  'WARNING',
  '{"temperature": 88.7, "voltage": 402.1, "load": 92, "pressure": 98.4, "power": 52.8, "uptimeHours": 310}'::jsonb,
  TO_CHAR(NOW(), 'HH12:MI:SS AM')
),
(
  'EQ-108',
  'Industrial Exhaust Fan 1B',
  'Loading Dock Ventilation',
  'OFFLINE',
  '{"temperature": 21.0, "voltage": 0.0, "load": 0, "pressure": 0.0, "power": 0.0, "uptimeHours": 0}'::jsonb,
  TO_CHAR(NOW(), 'HH12:MI:SS AM')
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  location = EXCLUDED.location,
  status = EXCLUDED.status,
  metrics = EXCLUDED.metrics,
  last_updated = EXCLUDED.last_updated;
