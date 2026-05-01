import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Calculator, RotateCcw, Fuel, ListOrdered, Plus, Wallet, Banknote, Gift, Save } from 'lucide-react';
import { getEntries, getFuelData, saveFuelData, resetAll, addEntry } from '../utils/storage';
import { calculateSessionTotals } from '../utils/calculations';
import { FuelData } from '../types';

export function Home() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState(getEntries());
  const [fuel, setFuel] = useState<FuelData>(getFuelData());

  // Entry form state
  const [spayIncome, setSpayIncome] = useState('');
  const [hasCashPayment, setHasCashPayment] = useState(false);
  const [customerOwe, setCustomerOwe] = useState('');
  const [customerPaid, setCustomerPaid] = useState('');
  const [hasSeparateTip, setHasSeparateTip] = useState(false);
  const [separateTipAmount, setSeparateTipAmount] = useState('');
  const [separateTipType, setSeparateTipType] = useState<'cash' | 'spay'>('cash');

  useEffect(() => {
    const handleStorage = () => {
      setEntries(getEntries());
      setFuel(getFuelData());
    };
    window.addEventListener('storage-update', handleStorage);
    return () => window.removeEventListener('storage-update', handleStorage);
  }, []);

  const handleReset = () => {
    if (confirm('Reset all data? This will clear all entries and fuel data.')) {
      resetAll();
      setEntries([]);
      setFuel({ costPerLitre: 0, distance: 0, kmPerL: 0 });
      clearForm();
    }
  };

  const clearForm = () => {
    setSpayIncome('');
    setHasCashPayment(false);
    setCustomerOwe('');
    setCustomerPaid('');
    setHasSeparateTip(false);
    setSeparateTipAmount('');
    setSeparateTipType('cash');
  };

  const handleSaveEntry = () => {
    const entryData = {
      id: Date.now().toString(),
      spayIncome: parseFloat(spayIncome) || 0,
      hasCashPayment,
      customerOwe: parseFloat(customerOwe) || 0,
      customerPaid: parseFloat(customerPaid) || 0,
      hasSeparateTip,
      separateTipAmount: parseFloat(separateTipAmount) || 0,
      separateTipType,
      timestamp: Date.now(),
    };

    addEntry(entryData);
    setEntries(getEntries());
    window.dispatchEvent(new Event('storage-update'));
    clearForm();
  };

  const totals = calculateSessionTotals(entries, fuel);
  const owe = parseFloat(customerOwe) || 0;
  const paid = parseFloat(customerPaid) || 0;
  const cashTipFromPayment = hasCashPayment && paid > owe ? paid - owe : 0;

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

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => navigate('/fuel')}
            className="bg-gray-800 hover:bg-gray-700 p-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Fuel size={20} />
            <span className="font-semibold">Fuel</span>
          </button>
          <button
            onClick={() => navigate('/entries')}
            className="bg-gray-800 hover:bg-gray-700 p-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <ListOrdered size={20} />
            <span className="font-semibold">Entries ({entries.length})</span>
          </button>
        </div>

        {/* Delivery Entry Form */}
        <div className="bg-gray-900 rounded-2xl p-6 mb-6 border border-gray-800">
          <h2 className="font-semibold text-lg mb-4">New Delivery</h2>

          {/* SPay Income */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Wallet className="text-orange-500" size={18} />
              <label className="text-sm font-medium text-gray-400">SPay Income</label>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">Rp</span>
              <input
                type="number"
                value={spayIncome}
                onChange={(e) => setSpayIncome(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-white"
                placeholder="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Cash Payment Helper */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Banknote className="text-orange-500" size={18} />
                <label className="text-sm font-medium text-gray-400">Cash Payment</label>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasCashPayment}
                  onChange={(e) => setHasCashPayment(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>

            {hasCashPayment && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Customer Owe</label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">Rp</span>
                      <input
                        type="number"
                        value={customerOwe}
                        onChange={(e) => setCustomerOwe(e.target.value)}
                        className="w-full pl-8 pr-2 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-white text-sm"
                        placeholder="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Customer Paid</label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">Rp</span>
                      <input
                        type="number"
                        value={customerPaid}
                        onChange={(e) => setCustomerPaid(e.target.value)}
                        className="w-full pl-8 pr-2 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-white text-sm"
                        placeholder="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>

                {cashTipFromPayment > 0 && (
                  <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-2">
                    <span className="text-xs text-green-400 font-medium">
                      Cash Tip: Rp {cashTipFromPayment.toLocaleString('id-ID')}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Separate Tip */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Gift className="text-orange-500" size={18} />
                <label className="text-sm font-medium text-gray-400">Tip</label>
              </div>
              {!hasSeparateTip && (
                <button
                  onClick={() => setHasSeparateTip(true)}
                  className="w-10 h-10 bg-orange-600 hover:bg-orange-700 rounded-full transition-colors flex items-center justify-center shadow-lg active:scale-95"
                  aria-label="Add Tip"
                >
                  <Plus size={20} strokeWidth={3} />
                </button>
              )}
            </div>

            {hasSeparateTip && (
              <div className="space-y-3">
                <div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">Rp</span>
                    <input
                      type="number"
                      value={separateTipAmount}
                      onChange={(e) => setSeparateTipAmount(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-white"
                      placeholder="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      checked={separateTipType === 'cash'}
                      onChange={() => setSeparateTipType('cash')}
                      className="sr-only peer"
                    />
                    <div className="p-2.5 bg-gray-800 border-2 border-gray-700 rounded-lg text-center peer-checked:border-orange-600 peer-checked:bg-orange-900/20 transition-colors">
                      <span className="text-sm font-medium">Cash</span>
                    </div>
                  </label>
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      checked={separateTipType === 'spay'}
                      onChange={() => setSeparateTipType('spay')}
                      className="sr-only peer"
                    />
                    <div className="p-2.5 bg-gray-800 border-2 border-gray-700 rounded-lg text-center peer-checked:border-orange-600 peer-checked:bg-orange-900/20 transition-colors">
                      <span className="text-sm font-medium">SPay</span>
                    </div>
                  </label>
                </div>

                <button
                  onClick={() => {
                    setHasSeparateTip(false);
                    setSeparateTipAmount('');
                  }}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  Remove Tip
                </button>
              </div>
            )}
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveEntry}
            className="w-full bg-orange-600 hover:bg-orange-700 p-3 rounded-xl transition-colors flex items-center justify-center gap-2 font-semibold"
          >
            <Save size={20} />
            <span>Save Entry</span>
          </button>
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
