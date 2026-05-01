export interface DeliveryEntry {
  id: string;
  spayIncome: number;
  hasCashPayment: boolean;
  customerOwe: number;
  customerPaid: number;
  hasSeparateTip: boolean;
  separateTipAmount: number;
  separateTipType: 'cash' | 'spay';
  timestamp: number;
}

export interface FuelData {
  costPerLitre: number;
  distance: number;
  kmPerL: number;
}
