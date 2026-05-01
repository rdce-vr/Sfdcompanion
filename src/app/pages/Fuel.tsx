import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Fuel as FuelIcon, Save } from 'lucide-react';
import { getFuelData, saveFuelData } from '../utils/storage';
import { FuelData } from '../types';

export function Fuel() {
  const navigate = useNavigate();
  const [fuel, setFuel] = useState<FuelData>(getFuelData());

  useEffect(() => {
    const handleStorage = () => setFuel(getFuelData());
    window.addEventListener('storage-update', handleStorage);
    return () => window.removeEventListener('storage-update', handleStorage);
  }, []);

  const updateFuel = (updates: Partial<FuelData>) => {
    const newFuel = { ...fuel, ...updates };
    setFuel(newFuel);
  };

  const handleSave = () => {
    saveFuelData(fuel);
    window.dispatchEvent(new Event('storage-update'));
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-2xl mx-auto p-4 pb-24">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Fuel Expenses</h1>
            <p className="text-gray-400 text-sm">Track your fuel costs</p>
          </div>
        </div>

        {/* Fuel Form */}
        <div className="bg-gray-900 rounded-2xl p-6 mb-6 border border-gray-800">
          <div className="flex items-center gap-2 mb-6">
            <FuelIcon className="text-orange-500" size={20} />
            <h2 className="font-semibold">Fuel Details</h2>
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
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-white"
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
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-white"
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
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-white"
                  placeholder="0"
                  step="0.1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-orange-600 hover:bg-orange-700 p-4 rounded-xl transition-colors flex items-center justify-center gap-2 font-semibold"
        >
          <Save size={20} />
          <span>Save Fuel Data</span>
        </button>
      </div>
    </div>
  );
}
