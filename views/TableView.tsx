
import React, { useState } from 'react';
import { TableConfig } from '../types';
import EditModal from '../components/EditModal';

interface TableViewProps {
  config: TableConfig;
  data: any[];
  onAdd: (data: any) => void;
  onUpdate: (data: any) => void;
  onDelete: (pkValue: any) => void;
}

const TableView: React.FC<TableViewProps> = ({ config, data, onAdd, onUpdate, onDelete }) => {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const filteredData = data.filter(item => 
    Object.values(item).some(val => 
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleSave = (formData: any) => {
    if (editingItem) {
      onUpdate({ ...editingItem, ...formData });
    } else {
      onAdd(formData);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{config.label} Management</h1>
          <p className="text-slate-500 text-sm">Create, edit, and delete records for {config.label.toLowerCase()} in your Supabase DB.</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          Add New {config.label.slice(0, -1)}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
          <div className="relative max-w-xs w-full">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
            </span>
            <input
              type="text"
              placeholder={`Filter ${config.label.toLowerCase()}...`}
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">
            Total: {filteredData.length} records
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                {config.columns.map(col => (
                  <th key={col.key} className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {col.label}
                  </th>
                ))}
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {filteredData.length > 0 ? filteredData.map((item, idx) => (
                <tr key={item[config.primaryKey] || idx} className="hover:bg-slate-50 transition-colors">
                  {config.columns.map(col => (
                    <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      {item[col.key]}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleEdit(item)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => onDelete(item[config.primaryKey])}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={config.columns.length + 1} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-slate-200 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-3.586a1 1 0 00-.707.293l-1.414 1.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-1.414-1.414A1 1 0 009.586 13H6" /></svg>
                      <p>No records found in database</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <EditModal 
          isOpen={modalOpen} 
          onClose={() => setModalOpen(false)} 
          onSave={handleSave} 
          config={config} 
          item={editingItem}
        />
      )}
    </div>
  );
};

export default TableView;
