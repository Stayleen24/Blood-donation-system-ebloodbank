export const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

export const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi",
] as const;

export const componentTypes = ["Whole Blood", "Packed RBC", "Plasma", "Platelets", "Cryoprecipitate"] as const;

export interface BloodBank {
  id: string;
  name: string;
  state: string;
  district: string;
  address: string;
  phone: string;
  email: string;
  category: string;
  availability: Record<string, number>;
}

export interface Donor {
  id: string;
  name: string;
  bloodGroup: string;
  age: number;
  state: string;
  district: string;
  lastDonation: string;
  phone: string;
}

export const mockBloodBanks: BloodBank[] = [
  {
    id: "1",
    name: "Central Blood Bank, Delhi",
    state: "Delhi",
    district: "New Delhi",
    address: "Lady Hardinge Medical College, New Delhi - 110001",
    phone: "011-23456789",
    email: "cbb.delhi@gov.in",
    category: "Government",
    availability: { "A+": 45, "A-": 12, "B+": 38, "B-": 8, "AB+": 15, "AB-": 4, "O+": 52, "O-": 10 },
  },
  {
    id: "2",
    name: "Red Cross Blood Bank, Mumbai",
    state: "Maharashtra",
    district: "Mumbai",
    address: "Dr. D.N. Road, Fort, Mumbai - 400001",
    phone: "022-23456789",
    email: "rcbb.mumbai@redcross.in",
    category: "Red Cross",
    availability: { "A+": 30, "A-": 8, "B+": 42, "B-": 6, "AB+": 20, "AB-": 3, "O+": 48, "O-": 7 },
  },
  {
    id: "3",
    name: "State Blood Bank, Bangalore",
    state: "Karnataka",
    district: "Bangalore",
    address: "Victoria Hospital Campus, Bangalore - 560002",
    phone: "080-23456789",
    email: "sbb.blr@gov.in",
    category: "Government",
    availability: { "A+": 25, "A-": 10, "B+": 35, "B-": 5, "AB+": 12, "AB-": 2, "O+": 40, "O-": 9 },
  },
  {
    id: "4",
    name: "Lions Blood Bank, Chennai",
    state: "Tamil Nadu",
    district: "Chennai",
    address: "T. Nagar, Chennai - 600017",
    phone: "044-23456789",
    email: "lionsbb@gmail.com",
    category: "Charitable",
    availability: { "A+": 20, "A-": 6, "B+": 28, "B-": 4, "AB+": 10, "AB-": 2, "O+": 35, "O-": 5 },
  },
  {
    id: "5",
    name: "Rotary Blood Bank, Kolkata",
    state: "West Bengal",
    district: "Kolkata",
    address: "Park Street, Kolkata - 700016",
    phone: "033-23456789",
    email: "rotarybb.kol@rotary.org",
    category: "Charitable",
    availability: { "A+": 18, "A-": 5, "B+": 32, "B-": 7, "AB+": 8, "AB-": 3, "O+": 42, "O-": 6 },
  },
  {
    id: "6",
    name: "AIIMS Blood Bank, Delhi",
    state: "Delhi",
    district: "New Delhi",
    address: "AIIMS Campus, Ansari Nagar, New Delhi - 110029",
    phone: "011-26593456",
    email: "bloodbank@aiims.edu",
    category: "Government",
    availability: { "A+": 55, "A-": 15, "B+": 50, "B-": 10, "AB+": 22, "AB-": 5, "O+": 60, "O-": 12 },
  },
];

export const mockDonors: Donor[] = [
  { id: "1", name: "Rahul Sharma", bloodGroup: "A+", age: 28, state: "Delhi", district: "New Delhi", lastDonation: "2025-11-15", phone: "98XXXXXXXX" },
  { id: "2", name: "Priya Patel", bloodGroup: "O+", age: 32, state: "Maharashtra", district: "Mumbai", lastDonation: "2025-12-01", phone: "97XXXXXXXX" },
  { id: "3", name: "Amit Kumar", bloodGroup: "B+", age: 25, state: "Karnataka", district: "Bangalore", lastDonation: "2025-10-20", phone: "96XXXXXXXX" },
  { id: "4", name: "Sneha Reddy", bloodGroup: "AB+", age: 30, state: "Telangana", district: "Hyderabad", lastDonation: "2026-01-05", phone: "95XXXXXXXX" },
  { id: "5", name: "Vikash Singh", bloodGroup: "O-", age: 35, state: "Uttar Pradesh", district: "Lucknow", lastDonation: "2025-09-10", phone: "94XXXXXXXX" },
];
