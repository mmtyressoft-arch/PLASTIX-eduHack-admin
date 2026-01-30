
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { TABLE_CONFIGS } from './constants';
import { TableName } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './views/Dashboard';
import TableView from './views/TableView';
import Forecasting from './views/Forecasting';
import { supabase } from './services/supabase';

const App: React.FC = () => {
  // Initialize db with empty arrays for all configured tables to avoid undefined errors
  const [db, setDb] = useState<Record<string, any[]>>(() => {
    const initial: Record<string, any[]> = {};
    TABLE_CONFIGS.forEach(config => {
      initial[config.id] = [];
    });
    return initial;
  });
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await Promise.all(
        TABLE_CONFIGS.map(config => supabase.from(config.id).select('*'))
      );

      const newDb: Record<string, any[]> = {};
      results.forEach((res, index) => {
        if (res.error) throw res.error;
        newDb[TABLE_CONFIGS[index].id] = res.data || [];
      });
      setDb(newDb);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to fetch data from Supabase');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdate = async (table: TableName, data: any) => {
    const config = TABLE_CONFIGS.find(c => c.id === table);
    if (!config) return;

    const pk = config.primaryKey;
    const pkValue = data[pk];

    const { error } = await supabase
      .from(table)
      .update(data)
      .eq(pk, pkValue);

    if (error) {
      alert(`Update failed: ${error.message}`);
    } else {
      fetchData(); // Simple re-sync
    }
  };

  const handleAdd = async (table: TableName, data: any) => {
    const { error } = await supabase
      .from(table)
      .insert([data]);

    if (error) {
      alert(`Insert failed: ${error.message}`);
    } else {
      fetchData();
    }
  };

  const handleDelete = async (table: TableName, pkValue: any) => {
    const config = TABLE_CONFIGS.find(c => c.id === table);
    if (!config) return;

    if (!confirm('Are you sure you want to delete this record?')) return;

    const { error } = await supabase
      .from(table)
      .delete()
      .eq(config.primaryKey, pkValue);

    if (error) {
      alert(`Delete failed: ${error.message}`);
    } else {
      fetchData();
    }
  };

  return (
    <Router>
      <div className="flex h-screen overflow-hidden bg-slate-50">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <div className="flex flex-col flex-1 w-full overflow-y-auto relative">
          <Header />
          
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-50 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="mt-4 text-slate-600 font-medium">Syncing with Database...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="m-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <h3 className="font-bold">Database Error</h3>
              <p>{error}</p>
              <button 
                onClick={fetchData} 
                className="mt-2 text-sm font-semibold underline hover:text-red-800"
              >
                Retry Connection
              </button>
            </div>
          )}
          
          <main className="p-4 md:p-6 lg:p-8">
            <Routes>
              <Route path="/" element={<Dashboard db={db} />} />
              <Route path="/forecasting" element={<Forecasting db={db} onRefresh={fetchData} />} />
              {TABLE_CONFIGS.map(config => (
                <Route 
                  key={config.id} 
                  path={`/${config.id}`} 
                  element={
                    <TableView 
                      config={config} 
                      data={db[config.id] || []} 
                      onAdd={(data) => handleAdd(config.id, data)}
                      onUpdate={(data) => handleUpdate(config.id, data)}
                      onDelete={(id) => handleDelete(config.id, id)}
                    />
                  } 
                />
              ))}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
