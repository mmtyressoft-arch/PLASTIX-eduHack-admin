
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  db: any;
}

const Dashboard: React.FC<DashboardProps> = ({ db }) => {
  // Ensure tables exist before accessing length
  const students = db.students || [];
  const teachers = db.teachers || [];
  const courses = db.courses || [];
  const assignments = db.assignments || [];

  const stats = [
    { label: 'Total Students', value: students.length, color: 'bg-blue-500', icon: 'U' },
    { label: 'Active Teachers', value: teachers.length, color: 'bg-green-500', icon: 'T' },
    { label: 'Courses Offered', value: courses.length, color: 'bg-indigo-500', icon: 'C' },
    { label: 'Assignments', value: assignments.length, color: 'bg-amber-500', icon: 'A' },
  ];

  const deptData = [
    { name: 'CS', count: students.filter((s: any) => s.department === 'Computer Science').length },
    { name: 'EE', count: students.filter((s: any) => s.department === 'Electrical').length },
    { name: 'ME', count: students.filter((s: any) => s.department === 'Mechanical').length },
    { name: 'CE', count: students.filter((s: any) => s.department === 'Civil').length },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#6366f1', '#f59e0b'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Academic Overview</h1>
        <p className="text-slate-500">Welcome to the EduAdmin management dashboard.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center">
            <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-slate-200`}>
              {stat.icon}
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Student Enrollment by Department</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {deptData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              </div>
              <span className="text-sm font-medium text-slate-700">Add Student</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2" /></svg>
              </div>
              <span className="text-sm font-medium text-slate-700">Create Course</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
              </div>
              <span className="text-sm font-medium text-slate-700">Post Material</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <span className="text-sm font-medium text-slate-700">Reports</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
