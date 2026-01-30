
import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { supabase } from '../services/supabase';

interface ForecastingProps {
  db: any;
  onRefresh: () => void;
}

const Forecasting: React.FC<ForecastingProps> = ({ db, onRefresh }) => {
  const [isPredicting, setIsPredicting] = useState<string | null>(null);
  
  const students = db.students || [];
  const predictions = db.ml_predictions || [];

  const handlePredict = async (student: any) => {
    setIsPredicting(student.id);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Collect metrics for this student
      const studentAttendance = db.attendance?.filter((a: any) => a.student_id === student.id) || [];
      const studentGrades = db.grades?.filter((g: any) => g.student_id === student.id) || [];
      
      const avgAttendance = studentAttendance.length > 0 
        ? studentAttendance.reduce((acc: number, cur: any) => acc + (cur.attended / cur.conducted), 0) / studentAttendance.length * 100
        : 80;

      const prompt = `Act as an academic predictive engine. Based on the following student data, forecast their performance for the next semester.
      
      Student: ${student.name}
      Current CGPA: ${student.cgpa}
      Current Semester: ${student.current_semester}
      Avg Attendance: ${avgAttendance.toFixed(1)}%
      Recent Grades: ${studentGrades.map((g: any) => g.grade).join(', ') || 'N/A'}
      
      Provide your prediction in a structured JSON format.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              predicted_gpa: { type: Type.NUMBER, description: 'Predicted GPA (0.00 to 4.00)' },
              risk_level: { type: Type.STRING, description: 'One of: Low, Medium, High' },
              performance_trend: { type: Type.STRING, description: 'One of: Improving, Stable, Declining' },
              confidence_score: { type: Type.INTEGER, description: 'Percentage 0-100' },
              risk_factors: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Specific reasons for the risk level' },
              recommendation: { type: Type.STRING, description: 'Actionable advice for teachers' }
            },
            required: ['predicted_gpa', 'risk_level', 'performance_trend', 'confidence_score', 'risk_factors', 'recommendation']
          }
        }
      });

      const predictionData = JSON.parse(response.text);
      
      // Save to Supabase
      const { error } = await supabase.from('ml_predictions').insert([{
        student_id: student.id,
        predicted_gpa: predictionData.predicted_gpa,
        risk_level: predictionData.risk_level,
        performance_trend: predictionData.performance_trend,
        confidence_score: predictionData.confidence_score,
        risk_factors: predictionData.risk_factors,
        recommendation: predictionData.recommendation
      }]);

      if (error) throw error;
      
      onRefresh();
      alert('AI Forecast generated successfully!');
    } catch (err: any) {
      console.error(err);
      alert('Forecasting failed: ' + err.message);
    } finally {
      setIsPredicting(null);
    }
  };

  const getRiskStyles = (level: string) => {
    switch(level) {
      case 'High': return 'bg-red-50 border-red-200 text-red-700';
      case 'Medium': return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'Low': return 'bg-green-50 border-green-200 text-green-700';
      default: return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Academic Forecast Engine</h1>
          <p className="text-slate-500 text-sm">Early intervention needs identification using predictive ML.</p>
        </div>
        <div className="flex items-center space-x-2 bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-100">
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">AI System Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student: any) => {
          const prediction = predictions.find((p: any) => p.student_id === student.id);
          const isAtRisk = prediction?.risk_level === 'High' || prediction?.risk_level === 'Medium';

          return (
            <div key={student.id} className={`p-5 rounded-2xl border bg-white shadow-sm transition-all hover:shadow-md ${isAtRisk ? 'ring-2 ring-red-100' : ''}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-slate-900">{student.name}</h3>
                  <p className="text-xs text-slate-500 font-medium uppercase">{student.reg_no}</p>
                </div>
                {prediction ? (
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${getRiskStyles(prediction.risk_level)}`}>
                    {prediction.risk_level} Risk
                  </span>
                ) : (
                  <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase border bg-slate-50 text-slate-400">
                    No Forecast
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-50 p-3 rounded-xl text-center">
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Current CGPA</p>
                  <p className="text-xl font-bold text-slate-800">{student.cgpa}</p>
                </div>
                <div className="bg-indigo-50 p-3 rounded-xl text-center border border-indigo-100">
                  <p className="text-[10px] text-indigo-400 font-bold uppercase mb-1">Predicted</p>
                  <p className="text-xl font-bold text-indigo-700">{prediction ? prediction.predicted_gpa.toFixed(2) : '--'}</p>
                </div>
              </div>

              {prediction && (
                <div className="space-y-3 mb-5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Trend</span>
                    <span className={`font-bold ${prediction.performance_trend === 'Declining' ? 'text-red-500' : 'text-green-600'}`}>
                      {prediction.performance_trend === 'Declining' ? '↘' : prediction.performance_trend === 'Improving' ? '↗' : '→'} {prediction.performance_trend}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-dashed border-slate-200">
                    <p className="font-bold text-slate-800 mb-1 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                      AI Insight
                    </p>
                    {prediction.recommendation}
                  </div>
                </div>
              )}

              <button
                onClick={() => handlePredict(student)}
                disabled={isPredicting === student.id}
                className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center space-x-2 ${
                  prediction 
                    ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100'
                }`}
              >
                {isPredicting === student.id ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <span>{prediction ? 'Recalculate Forecast' : 'Run AI Prediction'}</span>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Forecasting;
