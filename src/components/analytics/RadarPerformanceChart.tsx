
import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RadarPerformanceChartProps {
  data: Array<{
    name: string;
    averagePercentage: number;
    [key: string]: any;
  }>;
  title: string;
  description?: string;
  color?: string;
}

const RadarPerformanceChart: React.FC<RadarPerformanceChartProps> = ({
  data,
  title,
  description,
  color = "#8884d8"
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius={90} data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis domain={[0, 100]} />
              <Radar 
                name="Performance (%)" 
                dataKey="averagePercentage" 
                stroke={color} 
                fill={color} 
                fillOpacity={0.6} 
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RadarPerformanceChart;
