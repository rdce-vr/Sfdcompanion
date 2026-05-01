import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Calculator, RotateCcw, Fuel, ListOrdered, Plus } from 'lucide-react';
import { getEntries, getFuelData, saveFuelData, resetAll } from '../utils/storage';
import { calculateSessionTotals } from '../utils/calculations';
import { FuelData } from '../types';

export function Home() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState(getEntries());
  const [fuel, setFuel] = useState<FuelData>(getFuelData());

  useEffect(() => {
    const handleStorage = () => {
      setEntries(getEntries());
      setFuel(getFuelData());
    };
    window.addEventListener('storage-update', handleStorage);
    return () => window.removeEventListener('storage-update', handleStorage);
  }, []);

  const updateFuel = (updates: Partial<FuelData>) => {
    const newFuel = { ...fuel, ...updates };
    setFuel(newFuel);
    saveFuelData(newFuel);
  };

  const handleReset = () => {
    if (confirm('Reset all data? This will clear all entries and fuel data.')) {
      resetAll();
      setEntries([]);
      setFuel({ costPerLitre: 0, distance: 0, kmPerL: 0 });
    }
  };

  const totals = calculateSessionTotals(entries, fuel);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-2xl mx-auto p-4 pb-24">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-6">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="bg-orange-600 p-3 rounded-xl flex-shrink-0">
              <Calculator className="text-white" size={24} />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold truncate">Delivery Earnings</h1>
              <p className="text-gray-400 text-xs sm:text-sm">SFD Session Tracker</p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
            title="Reset all data"
          >
            <RotateCcw className="text-gray-400" size={20} />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => navigate('/entry/new')}
            className="bg-orange-600 hover:bg-orange-700 p-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            <span className="font-semibold">New Entry</span>
          </button>
          <button
            onClick={() => navigate('/entries')}
            className="bg-gray-800 hover:bg-gray-700 p-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <ListOrdered size={20} />
            <span className="font-semibold">View Entries ({entries.length})</span>
          </button>
        </div>

        {/* Fuel Section */}
        <div className="bg-gray-900 rounded-2xl p-6 mb-6 border border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <Fuel className="text-orange-500" size={20} />
            <h2 className="font-semibold">Fuel Expenses</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Fuel Cost per Litre
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">Rp</span>
                <input
                  type="number"
                  value={fuel.costPerLitre || ''}
                  onChange={(e) => updateFuel({ costPerLitre: parseFloat(e.target.value) || 0 })}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-white"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Distance (km)
                </label>
                <input
                  type="number"
                  value={fuel.distance || ''}
                  onChange={(e) => updateFuel({ distance: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-white"
                  placeholder="0"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Average km/L
                </label>
                <input
                  type="number"
                  value={fuel.kmPerL || ''}
                  onChange={(e) => updateFuel({ kmPerL: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-white"
                  placeholder="0"
                  step="0.1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl p-6 border border-orange-500">
          <h2 className="font-semibold mb-4 text-lg">Session Summary</h2>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-orange-100">SPay Income</span>
              <span className="font-semibold">Rp {totals.totalSpayIncome.toLocaleString('id-ID')}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-orange-100">Total Tip</span>
              <span className="font-semibold">Rp {totals.totalTip.toLocaleString('id-ID')}</span>
            </div>

            {totals.totalTip > 0 && (
              <div className="pl-4 text-sm space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-orange-200">Cash</span>
                  <span>Rp {totals.totalCashTip.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-orange-200">SPay</span>
                  <span>Rp {totals.totalSpayTip.toLocaleString('id-ID')}</span>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-orange-100">Total Income</span>
              <span className="font-semibold">Rp {totals.totalIncome.toLocaleString('id-ID')}</span>
            </div>

            <div className="h-px bg-white/30 my-2"></div>

            <div className="flex justify-between items-center">
              <span className="text-orange-100">
                Fuel Expense {totals.litresConsumed > 0 && `(${totals.litresConsumed.toFixed(2)}L)`}
              </span>
              <span className="font-semibold text-red-200">-Rp {totals.fuelExpense.toLocaleString('id-ID')}</span>
            </div>

            <div className="h-px bg-white/30 my-2"></div>

            <div className="flex justify-between items-center text-lg">
              <span className="font-bold">Net Earnings</span>
              <span className="font-bold text-2xl">
                Rp {totals.netEarnings.toLocaleString('id-ID')}
              </span>
            </div>

            {totals.totalAmountToTransfer > 0 && (
              <>
                <div className="h-px bg-white/30 my-2"></div>
                <div className="flex justify-between items-center bg-orange-800/50 -mx-6 px-6 py-3 -mb-6 rounded-b-2xl">
                  <span className="font-semibold">Amount to Transfer</span>
                  <span className="font-bold text-lg">Rp {totals.totalAmountToTransfer.toLocaleString('id-ID')}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
