
import React from 'react';
import { CalendarDays, Check, X } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  rollNo: string;
  status: 'present' | 'absent' | null;
  avatar?: string;
}

const AttendanceWidget: React.FC = () => {
  // Mock data for attendance
  const students: Student[] = [
    {
      id: '1',
      name: 'Alex Johnson',
      rollNo: '1001',
      status: 'present',
      avatar: 'https://ui-avatars.com/api/?background=10B981&color=fff&name=Alex+Johnson',
    },
    {
      id: '2',
      name: 'Sarah Williams',
      rollNo: '1002',
      status: 'present',
      avatar: 'https://ui-avatars.com/api/?background=10B981&color=fff&name=Sarah+Williams',
    },
    {
      id: '3',
      name: 'Michael Brown',
      rollNo: '1003',
      status: 'absent',
      avatar: 'https://ui-avatars.com/api/?background=10B981&color=fff&name=Michael+Brown',
    },
    {
      id: '4',
      name: 'Emily Davis',
      rollNo: '1004',
      status: 'present',
      avatar: 'https://ui-avatars.com/api/?background=10B981&color=fff&name=Emily+Davis',
    },
    {
      id: '5',
      name: 'James Wilson',
      rollNo: '1005',
      status: 'present',
      avatar: 'https://ui-avatars.com/api/?background=10B981&color=fff&name=James+Wilson',
    },
  ];

  // Calculate stats
  const totalStudents = students.length;
  const presentStudents = students.filter(s => s.status === 'present').length;
  const absentStudents = students.filter(s => s.status === 'absent').length;
  const attendancePercentage = totalStudents > 0 
    ? Math.round((presentStudents / totalStudents) * 100) 
    : 0;

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-muted/50 p-3 rounded-lg text-center">
          <h4 className="text-sm font-medium text-muted-foreground">Present</h4>
          <p className="text-2xl font-bold text-green-600">{presentStudents}</p>
        </div>
        <div className="bg-muted/50 p-3 rounded-lg text-center">
          <h4 className="text-sm font-medium text-muted-foreground">Absent</h4>
          <p className="text-2xl font-bold text-red-600">{absentStudents}</p>
        </div>
        <div className="bg-muted/50 p-3 rounded-lg text-center">
          <h4 className="text-sm font-medium text-muted-foreground">Percentage</h4>
          <p className="text-2xl font-bold">{attendancePercentage}%</p>
        </div>
      </div>

      {/* Student List */}
      <div className="rounded-lg border overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-12">#</th>
              <th>Student</th>
              <th className="w-20 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-muted/30">
                <td className="text-muted-foreground">{student.rollNo}</td>
                <td>
                  <div className="flex items-center gap-3">
                    {student.avatar && (
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <span>{student.name}</span>
                  </div>
                </td>
                <td className="text-center">
                  {student.status === 'present' ? (
                    <Check className="mx-auto text-green-600" size={18} />
                  ) : student.status === 'absent' ? (
                    <X className="mx-auto text-red-600" size={18} />
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceWidget;
