
import React, { useState, useEffect } from 'react';
import { TableConfig } from '../types';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  config: TableConfig;
  item?: any;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, onSave, config, item }) => {
  const [formData, setFormData] = useState<any>(() => {
    if (item) return item;
    const initial: any = {};
    config.columns.forEach(col => {
      initial[col.key] = col.type === 'number' ? 0 : '';
    });
    return initial;
  });

  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b bg-slate-50 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">
            {item ? `Edit ${config.label.slice(0, -1)}` : `Add New ${config.label.slice(0, -1)}`}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {config.columns.map(col => (
              <div key={col.key}>
                <label className="block text-sm font-semibold text-slate-700 mb-1">{col.label}</label>
                {col.type === 'select' ? (
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    value={formData[col.key]}
                    onChange={(e) => handleChange(col.key, e.target.value)}
                    required
                  >
                    <option value="">Select {col.label}</option>
                    {col.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <input
                    type={col.type}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    value={formData[col.key]}
                    onChange={(e) => handleChange(col.key, col.type === 'number' ? Number(e.target.value) : e.target.value)}
                    placeholder={`Enter ${col.label.toLowerCase()}...`}
                    required
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end items-center space-x-3 pt-4 border-t mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
            >
              {item ? 'Save Changes' : 'Create Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
