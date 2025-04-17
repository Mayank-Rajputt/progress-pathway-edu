
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Subject {
  name: string;
  averagePercentage: number;
}

interface StrengthWeaknessCardProps {
  strengths: Subject[];
  weaknesses: Subject[];
}

const StrengthWeaknessCard: React.FC<StrengthWeaknessCardProps> = ({ strengths, weaknesses }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Strengths & Areas for Improvement</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold flex items-center mb-3 text-green-600">
              <TrendingUp className="mr-2" size={20} />
              Strong Areas
            </h3>
            <ul className="space-y-3">
              {strengths && strengths.length > 0 ? (
                strengths.map((subject, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{subject.name}</span>
                    <span className="font-medium text-green-600">{subject.averagePercentage}%</span>
                  </li>
                ))
              ) : (
                <li className="text-muted-foreground">No data available</li>
              )}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold flex items-center mb-3 text-amber-600">
              <TrendingDown className="mr-2" size={20} />
              Areas for Improvement
            </h3>
            <ul className="space-y-3">
              {weaknesses && weaknesses.length > 0 ? (
                weaknesses.map((subject, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{subject.name}</span>
                    <span className="font-medium text-amber-600">{subject.averagePercentage}%</span>
                  </li>
                ))
              ) : (
                <li className="text-muted-foreground">No data available</li>
              )}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StrengthWeaknessCard;
