import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Plus, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { getEntries, deleteEntry } from '../utils/storage';
import { calculateEntryTotals } from '../utils/calculations';
import { DeliveryEntry } from '../types';

export function EntriesList() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<DeliveryEntry[]>(getEntries());
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const handleStorage = () => setEntries(getEntries());
    window.addEventListener('storage-update', handleStorage);
    return () => window.removeEventListener('storage-update', handleStorage);
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Delete this entry?')) {
      deleteEntry(id);
      setEntries(getEntries());
      window.dispatchEvent(new Event('storage-update'));
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
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
            <h1 className="text-2xl font-bold">Delivery Entries</h1>
            <p className="text-gray-400 text-sm">{entries.length} entries</p>
          </div>
        </div>

        {/* Add Entry Button */}
        <button
          onClick={() => navigate('/entry/new')}
          className="w-full bg-orange-600 hover:bg-orange-700 p-4 rounded-xl transition-colors flex items-center justify-center gap-2 mb-6"
        >
          <Plus size={20} />
          <span className="font-semibold">New Entry</span>
        </button>

        {/* Entries List */}
        {entries.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No entries yet</p>
            <p className="text-sm mt-2">Add your first delivery entry</p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry, index) => {
              const totals = calculateEntryTotals(entry);
              const isExpanded = expandedId === entry.id;
              const totalIncome = totals.spayIncome + totals.cashTip + totals.spayTip;

              return (
                <div
                  key={entry.id}
                  className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden"
                >
                  {/* Header */}
                  <div
                    className="p-4 cursor-pointer hover:bg-gray-800/50 transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-orange-500">
                            Entry #{entries.length - index}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatTime(entry.timestamp)}
                          </span>
                        </div>
                        <div className="text-lg font-bold">
                          Rp {totalIncome.toLocaleString('id-ID')}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/entry/${entry.id}`);
                          }}
                          className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm transition-colors"
                        >
                          Edit
                        </button>
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-gray-800 pt-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">SPay Income</span>
                        <span>Rp {totals.spayIncome.toLocaleString('id-ID')}</span>
                      </div>

                      {totals.cashTip > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Cash Tip</span>
                          <span className="text-green-400">Rp {totals.cashTip.toLocaleString('id-ID')}</span>
                        </div>
                      )}

                      {totals.spayTip > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">SPay Tip</span>
                          <span className="text-green-400">Rp {totals.spayTip.toLocaleString('id-ID')}</span>
                        </div>
                      )}

                      {totals.amountToTransfer > 0 && (
                        <div className="flex justify-between mt-2 pt-2 border-t border-gray-800">
                          <span className="text-gray-400">To Transfer</span>
                          <span className="text-orange-400">Rp {totals.amountToTransfer.toLocaleString('id-ID')}</span>
                        </div>
                      )}

                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="w-full mt-3 p-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 size={16} />
                        <span className="text-sm">Delete Entry</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
