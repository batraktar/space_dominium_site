export interface Order {
  id: string;
  product: string;
  amount: number;
  time: string;
  status: 'Processing' | 'Completed' | 'Booked' | 'Rented';
  // New fields for specific logic
  customerName?: string; // For Hotel (Guest Name)
  meta?: string;         // For Rental (Battery %) or Hotel (Dates)
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
}

export interface ChartData {
  name: string;
  value: number;
}

export type ScenarioType = 'coffee' | 'hotel' | 'rental';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

export interface ScenarioConfig {
  id: ScenarioType;
  label: string;
  productName: string; // Used as fallback or main title
  productDesc: string;
  price: number;       // Default/Base price
  currency: string;
  image: string;       // Hero image
  buttonText: string;
  colorTheme: string;
  icon: any;
  adminTitle: string;
  botPrefix: string;
  menu?: MenuItem[];   // Optional menu list
}