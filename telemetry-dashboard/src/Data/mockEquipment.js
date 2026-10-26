export const INITIAL_EQUIPMENT = [
  {
    id: "EQ-101",
    name: "Chiller Unit A1",
    location: "Basement Plant Room",
    status: "ONLINE", // ONLINE | WARNING | CRITICAL | OFFLINE
    metrics: { temperature: 68.4, voltage: 415.2, load: 74 },
    lastUpdated: new Date().toLocaleTimeString(),
  },
  {
    id: "EQ-102",
    name: "Air Handling Unit 3",
    location: "Floor 4 Mechanical Room",
    status: "WARNING",
    metrics: { temperature: 84.1, voltage: 408.0, load: 89 },
    lastUpdated: new Date().toLocaleTimeString(),
  },
  {
    id: "EQ-103",
    name: "Backup Diesel Generator",
    location: "Substation Yard",
    status: "CRITICAL",
    metrics: { temperature: 95.8, voltage: 395.5, load: 96 },
    lastUpdated: new Date().toLocaleTimeString(),
  },
  {
    id: "EQ-104",
    name: "Cooling Tower Pump B",
    location: "Roof Level",
    status: "ONLINE",
    metrics: { temperature: 62.0, voltage: 416.0, load: 60 },
    lastUpdated: new Date().toLocaleTimeString(),
  },
];
