
import React from 'react';
import {
  GraduationCap,
  BookMarked,
  ArrowUp,
  ArrowDown,
  ArrowRight,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface GradeEntry {
  id: string;
  subject: string;
  grade: string;
  score: number;
  maxScore: number;
  trend: 'up' | 'down' | 'same';
  date: string;
}

const GradesWidget: React.FC = () => {
  // Mock data for grades
  const grades: GradeEntry[] = [
    {
      id: '1',
      subject: 'Mathematics',
      grade: 'A',
      score: 92,
      maxScore: 100,
      trend: 'up',
      date: '2025-04-05',
    },
    {
      id: '2',
      subject: 'Science',
      grade: 'A-',
      score: 88,
      maxScore: 100,
      trend: 'same',
      date: '2025-04-02',
    },
    {
      id: '3',
      subject: 'English',
      grade: 'B+',
      score: 85,
      maxScore: 100,
      trend: 'down',
      date: '2025-03-28',
    },
    {
      id: '4',
      subject: 'History',
      grade: 'A',
      score: 95,
      maxScore: 100,
      trend: 'up',
      date: '2025-03-25',
    },
    {
      id: '5',
      subject: 'Computer Science',
      grade: 'A+',
      score: 98,
      maxScore: 100,
      trend: 'up',
      date: '2025-03-20',
    },
  ];

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600';
    if (grade.startsWith('B')) return 'text-blue-600';
    if (grade.startsWith('C')) return 'text-yellow-600';
    if (grade.startsWith('D')) return 'text-orange-600';
    return 'text-red-600';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUp size={16} className="text-green-600" />;
      case 'down':
        return <ArrowDown size={16} className="text-red-600" />;
      default:
        return <ArrowRight size={16} className="text-gray-600" />;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      {grades.length === 0 ? (
        <div className="text-center py-8">
          <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground opacity-30" />
          <p className="mt-2 text-muted-foreground">No grades available</p>
        </div>
      ) : (
        <div className="space-y-4">
          {grades.map((grade) => (
            <div
              key={grade.id}
              className="p-4 border rounded-lg hover:bg-muted/30 transition-colors"
            >
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <BookMarked size={18} className="text-muted-foreground" />
                  <h3 className="font-medium">{grade.subject}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-base font-bold ${getGradeColor(grade.grade)}`}>
                    {grade.grade}
                  </span>
                  {getTrendIcon(grade.trend)}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Progress value={(grade.score / grade.maxScore) * 100} className="h-2" />
                <span className="text-sm text-muted-foreground">
                  {grade.score}/{grade.maxScore}
                </span>
              </div>
              <div className="text-xs text-right mt-1 text-muted-foreground">
                {formatDate(grade.date)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GradesWidget;
