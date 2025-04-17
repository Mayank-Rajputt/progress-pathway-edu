
export interface AnalyticsData {
  _id: string;
  studentId: string;
  subjectId: {
    _id: string;
    name: string;
    code: string;
  };
  academicYear: string;
  term: string;
  marks: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  examType: string;
  examDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubjectWiseData {
  name: string;
  averagePercentage: number;
}

export interface PerformanceTrendData {
  name: string;
  date: string;
  averagePercentage: number;
}

export interface StrengthWeaknessData {
  strengths: SubjectWiseData[];
  weaknesses: SubjectWiseData[];
}

export interface ClassAverageData {
  averagePercentage: number;
}

export interface TopPerformerData {
  id: string;
  name: string;
  averagePercentage: number;
}

export interface StudentAnalyticsResponse {
  student: any;
  subjectWiseData: SubjectWiseData[];
  performanceTrendData: PerformanceTrendData[];
  strengthWeaknessData: StrengthWeaknessData;
  rawData: AnalyticsData[];
}

export interface ClassAnalyticsResponse {
  classAverageData: ClassAverageData;
  topPerformersData: TopPerformerData[];
  subjectWiseAverageData: SubjectWiseData[];
  studentCount: number;
  rawData: AnalyticsData[];
}
