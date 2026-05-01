import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Save, Wallet, Banknote, Gift, Plus } from 'lucide-react';
import { getEntry, addEntry, updateEntry } from '../utils/storage';
import { DeliveryEntry } from '../types';

export function EntryDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = id !== 'new';

  const [spayIncome, setSpayIncome] = useState('');
  const [hasCashPayment, setHasCashPayment] = useState(false);
  const [customerOwe, setCustomerOwe] = useState('');
  const [customerPaid, setCustomerPaid] = useState('');
  const [hasSeparateTip, setHasSeparateTip] = useState(false);
  const [separateTipAmount, setSeparateTipAmount] = useState('');
  const [separateTipType, setSeparateTipType] = useState<'cash' | 'spay'>('cash');

  useEffect(() => {
    if (isEditing && id) {
      const entry = getEntry(id);
      if (entry) {
        setSpayIncome(entry.spayIncome.toString());
        setHasCashPayment(entry.hasCashPayment);
        setCustomerOwe(entry.customerOwe.toString());
        setCustomerPaid(entry.customerPaid.toString());
        setHasSeparateTip(entry.hasSeparateTip);
        setSeparateTipAmount(entry.separateTipAmount.toString());
        setSeparateTipType(entry.separateTipType);
      }
    }
  }, [id, isEditing]);

  const handleSave = () => {
    const entryData: DeliveryEntry = {
      id: isEditing && id ? id : Date.now().toString(),
      spayIncome: parseFloat(spayIncome) || 0,
      hasCashPayment,
      customerOwe: parseFloat(customerOwe) || 0,
      customerPaid: parseFloat(customerPaid) || 0,
      hasSeparateTip,
      separateTipAmount: parseFloat(separateTipAmount) || 0,
      separateTipType,
      timestamp: isEditing && id ? getEntry(id)?.timestamp || Date.now() : Date.now(),
    };

    if (isEditing && id) {
      updateEntry(id, entryData);
    } else {
      addEntry(entryData);
    }

    window.dispatchEvent(new Event('storage-update'));
    navigate('/entries');
  };

  const owe = parseFloat(customerOwe) || 0;
  const paid = parseFloat(customerPaid) || 0;
  const cashTipFromPayment = hasCashPayment && paid > owe ? paid - owe : 0;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-2xl mx-auto p-4 pb-24">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/entries')}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">
              {isEditing ? 'Edit Entry' : 'New Entry'}
            </h1>
            <p className="text-gray-400 text-sm">Add delivery details</p>
          </div>
        </div>

        {/* SPay Income */}
        <div className="bg-gray-900 rounded-2xl p-6 mb-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <Wallet className="text-orange-500" size={20} />
            <h2 className="font-semibold">SPay Income</h2>
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">Rp</span>
            <input
              type="number"
              value={spayIncome}
              onChange={(e) => setSpayIncome(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-white text-lg"
              placeholder="0"
              step="0.01"
            />
          </div>
        </div>

        {/* Cash Payment Helper */}
        <div className="bg-gray-900 rounded-2xl p-6 mb-4 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Banknote className="text-orange-500" size={20} />
              <h2 className="font-semibold">Cash Payment</h2>
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
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Customer Owe
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">Rp</span>
                  <input
                    type="number"
                    value={customerOwe}
                    onChange={(e) => setCustomerOwe(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-white"
                    placeholder="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Customer Paid
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">Rp</span>
                  <input
                    type="number"
                    value={customerPaid}
                    onChange={(e) => setCustomerPaid(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-white"
                    placeholder="0"
                    step="0.01"
                  />
                </div>
              </div>

              {cashTipFromPayment > 0 && (
                <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-3">
                  <span className="text-sm text-green-400 font-medium">
                    Cash Tip: Rp {cashTipFromPayment.toLocaleString('id-ID')}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Separate Tip */}
        <div className="bg-gray-900 rounded-2xl p-6 mb-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Gift className="text-orange-500" size={20} />
              <h2 className="font-semibold">Tip</h2>
            </div>
            {!hasSeparateTip && (
              <button
                onClick={() => setHasSeparateTip(true)}
                className="w-12 h-12 bg-orange-600 hover:bg-orange-700 rounded-full transition-colors flex items-center justify-center shadow-lg active:scale-95"
                aria-label="Add Tip"
              >
                <Plus size={24} strokeWidth={3} />
              </button>
            )}
          </div>

          {hasSeparateTip && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Tip Amount
                </label>
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

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Tip Type
                </label>
                <div className="flex gap-3">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      checked={separateTipType === 'cash'}
                      onChange={() => setSeparateTipType('cash')}
                      className="sr-only peer"
                    />
                    <div className="p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-center peer-checked:border-orange-600 peer-checked:bg-orange-900/20 transition-colors">
                      <span className="font-medium">Cash</span>
                    </div>
                  </label>
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      checked={separateTipType === 'spay'}
                      onChange={() => setSeparateTipType('spay')}
                      className="sr-only peer"
                    />
                    <div className="p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-center peer-checked:border-orange-600 peer-checked:bg-orange-900/20 transition-colors">
                      <span className="font-medium">SPay</span>
                    </div>
                  </label>
                </div>
              </div>

              <button
                onClick={() => {
                  setHasSeparateTip(false);
                  setSeparateTipAmount('');
                }}
                className="text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                Remove Tip
              </button>
            </div>
          )}
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-orange-600 hover:bg-orange-700 p-4 rounded-xl transition-colors flex items-center justify-center gap-2 font-semibold"
        >
          <Save size={20} />
          <span>{isEditing ? 'Update Entry' : 'Save Entry'}</span>
        </button>
      </div>
    </div>
  );
}
