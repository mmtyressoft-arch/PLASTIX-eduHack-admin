
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
        TABLE_CONFIGS.map(config => 
          supabase.from(config.id).select('*').order(config.primaryKey, { ascending: true })
        )
      );

      const newDb: Record<string, any[]> = {};
      results.forEach((res, index) => {
        if (res.error) {
          console.warn(`Error fetching table ${TABLE_CONFIGS[index].id}:`, res.error);
          newDb[TABLE_CONFIGS[index].id] = []; // Fallback to empty instead of crashing
        } else {
          newDb[TABLE_CONFIGS[index].id] = res.data || [];
        }
      });
      setDb(newDb);
    } catch (err: any) {
      console.error('Critical fetch error:', err);
      setError(err.message || 'Connection to database failed. Please check your Supabase credentials.');
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
      fetchData();
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
          
          {isLoading && db.students.length === 0 && (
            <div className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-600 font-medium">Loading Academic Data...</p>
            </div>
          )}

          {error && (
            <div className="m-8 p-6 bg-red-50 border border-red-200 rounded-2xl text-red-700 shadow-sm animate-in slide-in-from-top-4 duration-300">
              <div className="flex items-start">
                <svg className="w-6 h-6 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <div>
                  <h3 className="font-bold text-lg">Application Sync Failed</h3>
                  <p className="mt-1 opacity-90">{error}</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors"
                  >
                    Refresh Application
                  </button>
                </div>
              </div>
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
