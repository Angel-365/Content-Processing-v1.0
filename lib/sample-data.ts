export interface DetectorRecord {
  id: string;
  status: "New" | "Returning";
  gender: "Male" | "Female" | "Non-binary" | "Prefer not to say";
  age: number;
  city: string;
  country: string;
  reason: string;
  timestamp: string;
}

export const INITIAL_DETECTION_RECORDS: DetectorRecord[] = [
  {
    id: "#V-8492",
    status: "New",
    gender: "Male",
    age: 34,
    city: "New York",
    country: "United States",
    reason: "Business Meeting",
    timestamp: "Just now",
  },
  {
    id: "#V-8491",
    status: "Returning",
    gender: "Female",
    age: 28,
    city: "London",
    country: "United Kingdom",
    reason: "Delivery",
    timestamp: "5 mins ago",
  },
  {
    id: "#V-8490",
    status: "Returning",
    gender: "Male",
    age: 45,
    city: "Paris",
    country: "France",
    reason: "Consultation",
    timestamp: "12 mins ago",
  },
  {
    id: "#V-8489",
    status: "New",
    gender: "Female",
    age: 31,
    city: "Berlin",
    country: "Germany",
    reason: "Interview",
    timestamp: "28 mins ago",
  },
  {
    id: "#V-8488",
    status: "Returning",
    gender: "Male",
    age: 29,
    city: "San Francisco",
    country: "United States",
    reason: "Maintenance Scan",
    timestamp: "1 hour ago",
  },
  {
    id: "#V-8487",
    status: "New",
    gender: "Female",
    age: 24,
    city: "Tokyo",
    country: "Japan",
    reason: "Facility Inspection",
    timestamp: "3 hours ago",
  },
];
