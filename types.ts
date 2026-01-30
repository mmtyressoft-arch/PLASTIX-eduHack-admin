
export type TableName = 
  | 'students' 
  | 'teachers' 
  | 'courses' 
  | 'assignments' 
  | 'attendance' 
  | 'enrollments' 
  | 'grades' 
  | 'materials' 
  | 'quizzes' 
  | 'submissions'
  | 'teaching_assignments'
  | 'ml_predictions';

export interface TableConfig {
  id: TableName;
  label: string;
  icon: string;
  primaryKey: string;
  columns: { key: string; label: string; type: 'text' | 'number' | 'date' | 'select' | 'json'; options?: string[] }[];
}

export interface MLPrediction {
  id: string;
  student_id: string;
  predicted_gpa: number;
  risk_level: 'Low' | 'Medium' | 'High';
  performance_trend: 'Improving' | 'Stable' | 'Declining';
  confidence_score: number;
  risk_factors: string[];
  recommendation: string;
  prediction_date: string;
}
