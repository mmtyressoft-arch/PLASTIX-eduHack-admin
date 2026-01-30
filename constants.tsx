
import React from 'react';
import { TableConfig } from './types';

export const TABLE_CONFIGS: TableConfig[] = [
  {
    id: 'students',
    label: 'Students',
    icon: 'UserGroupIcon',
    primaryKey: 'id',
    columns: [
      { key: 'reg_no', label: 'Reg No', type: 'text' },
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'department', label: 'Department', type: 'select', options: ['Computer Science', 'Electrical', 'Mechanical', 'Civil'] },
      { key: 'cgpa', label: 'CGPA', type: 'number' },
      { key: 'current_semester', label: 'Semester', type: 'number' },
    ]
  },
  {
    id: 'ml_predictions',
    label: 'AI Forecasts',
    icon: 'ChartBarIcon',
    primaryKey: 'id',
    columns: [
      { key: 'student_id', label: 'Student ID', type: 'text' },
      { key: 'predicted_gpa', label: 'Pred. GPA', type: 'number' },
      { key: 'risk_level', label: 'Risk', type: 'select', options: ['Low', 'Medium', 'High'] },
      { key: 'performance_trend', label: 'Trend', type: 'select', options: ['Improving', 'Stable', 'Declining'] },
      { key: 'confidence_score', label: 'Conf %', type: 'number' },
    ]
  },
  {
    id: 'teachers',
    label: 'Teachers',
    icon: 'AcademicCapIcon',
    primaryKey: 'id',
    columns: [
      { key: 'staff_id', label: 'Staff ID', type: 'text' },
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'department', label: 'Department', type: 'select', options: ['Computer Science', 'Electrical', 'Mechanical', 'Civil'] },
      { key: 'designation', label: 'Designation', type: 'text' },
    ]
  },
  {
    id: 'courses',
    label: 'Courses',
    icon: 'BookOpenIcon',
    primaryKey: 'course_code',
    columns: [
      { key: 'course_code', label: 'Code', type: 'text' },
      { key: 'course_name', label: 'Course Name', type: 'text' },
      { key: 'semester', label: 'Semester', type: 'number' },
      { key: 'department', label: 'Department', type: 'select', options: ['Computer Science', 'Electrical', 'Mechanical', 'Civil'] },
    ]
  },
  {
    id: 'assignments',
    label: 'Assignments',
    icon: 'ClipboardDocumentListIcon',
    primaryKey: 'id',
    columns: [
      { key: 'course_code', label: 'Course', type: 'text' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'deadline', label: 'Deadline', type: 'date' },
      { key: 'max_marks', label: 'Max Marks', type: 'number' },
    ]
  },
  {
    id: 'attendance',
    label: 'Attendance',
    icon: 'CheckBadgeIcon',
    primaryKey: 'id',
    columns: [
      { key: 'student_id', label: 'Student ID', type: 'text' },
      { key: 'course_code', label: 'Course', type: 'text' },
      { key: 'conducted', label: 'Conducted', type: 'number' },
      { key: 'attended', label: 'Attended', type: 'number' },
    ]
  }
];
