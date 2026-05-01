import { DeliveryEntry, FuelData } from '../types';

const ENTRIES_KEY = 'delivery_entries';
const FUEL_KEY = 'fuel_data';

export const getEntries = (): DeliveryEntry[] => {
  const data = localStorage.getItem(ENTRIES_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveEntries = (entries: DeliveryEntry[]) => {
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
};

export const getEntry = (id: string): DeliveryEntry | null => {
  const entries = getEntries();
  return entries.find(e => e.id === id) || null;
};

export const addEntry = (entry: DeliveryEntry) => {
  const entries = getEntries();
  entries.push(entry);
  saveEntries(entries);
};

export const updateEntry = (id: string, updates: Partial<DeliveryEntry>) => {
  const entries = getEntries();
  const index = entries.findIndex(e => e.id === id);
  if (index !== -1) {
    entries[index] = { ...entries[index], ...updates };
    saveEntries(entries);
  }
};

export const deleteEntry = (id: string) => {
  const entries = getEntries().filter(e => e.id !== id);
  saveEntries(entries);
};

export const getFuelData = (): FuelData => {
  const data = localStorage.getItem(FUEL_KEY);
  return data ? JSON.parse(data) : { costPerLitre: 0, distance: 0, kmPerL: 0 };
};

export const saveFuelData = (fuel: FuelData) => {
  localStorage.setItem(FUEL_KEY, JSON.stringify(fuel));
};

export const resetAll = () => {
  localStorage.removeItem(ENTRIES_KEY);
  localStorage.removeItem(FUEL_KEY);
};
