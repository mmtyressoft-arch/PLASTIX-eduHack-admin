
export const initialMockData: Record<string, any[]> = {
  students: [
    { id: '1', reg_no: '2023CS01', name: 'Alice Smith', email: 'alice@univ.edu', department: 'Computer Science', cgpa: 3.8, current_semester: 4 },
    { id: '2', reg_no: '2023CS02', name: 'Bob Johnson', email: 'bob@univ.edu', department: 'Computer Science', cgpa: 3.5, current_semester: 4 },
    { id: '3', reg_no: '2023EE01', name: 'Charlie Davis', email: 'charlie@univ.edu', department: 'Electrical', cgpa: 3.9, current_semester: 2 },
    { id: '4', reg_no: '2023ME01', name: 'Diana Prince', email: 'diana@univ.edu', department: 'Mechanical', cgpa: 3.2, current_semester: 6 },
    { id: '5', reg_no: '2023CE01', name: 'Evan Wright', email: 'evan@univ.edu', department: 'Civil', cgpa: 3.6, current_semester: 8 },
  ],
  teachers: [
    { id: 't1', staff_id: 'PROF01', name: 'Dr. Sarah Connor', email: 's.connor@univ.edu', department: 'Computer Science', designation: 'Professor' },
    { id: 't2', staff_id: 'PROF02', name: 'Dr. James Moriarty', email: 'j.moriarty@univ.edu', department: 'Electrical', designation: 'Associate Professor' },
  ],
  courses: [
    { id: 'c1', course_code: 'CS101', course_name: 'Intro to Programming', semester: 1, department: 'Computer Science', description: 'Basic C++' },
    { id: 'c2', course_code: 'EE202', course_name: 'Circuit Analysis', semester: 2, department: 'Electrical', description: 'AC/DC Circuits' },
  ],
  assignments: [
    { id: 'a1', course_code: 'CS101', title: 'Data Structures Lab', deadline: '2024-05-20', max_marks: 50 },
  ],
  attendance: [
    { id: 'at1', student_id: '1', course_code: 'CS101', conducted: 40, attended: 38, percentage: 95 },
  ],
  enrollments: [],
  grades: [],
  materials: [],
  quizzes: [],
  submissions: [],
  teaching_assignments: []
};
