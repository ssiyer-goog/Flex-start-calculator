
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CostBreakdown, ChartDataItem } from '../types';

interface ComparisonViewProps {
  chartData: ChartDataItem[];
  costBreakdowns: CostBreakdown[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const CostCard: React.FC<CostBreakdown> = ({ modelName, totalCost, pricePerHour, usageDescription, benefits, considerations, color }) => {
  return (
    <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md flex flex-col h-full">
      <h3 style={{ color }} className="text-xl font-bold mb-2">{modelName}</h3>
      <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">{formatCurrency(totalCost)}</p>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Rate: {formatCurrency(pricePerHour)} / GPU / hr</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 italic">{usageDescription}</p>
      
      <div className="mt-auto">
        {benefits.length > 0 && (
          <>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Benefits:</h4>
            <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-300 space-y-0.5 mb-3">
              {benefits.map((benefit, index) => <li key={index}>{benefit}</li>)}
            </ul>
          </>
        )}
        {considerations && considerations.length > 0 && (
          <>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Considerations:</h4>
            <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-300 space-y-0.5">
              {considerations.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};


const ComparisonView: React.FC<ComparisonViewProps> = ({ chartData, costBreakdowns }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">Cost Comparison Chart</h2>
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
              <XAxis dataKey="name" angle={-15} textAnchor="end" height={50} interval={0} 
                     tick={{ fontSize: '0.75rem', fill: 'var(--recharts-axis-tick-color, #6b7280)' }}
                     className="dark:fill-gray-300" />
              <YAxis tickFormatter={formatCurrency} 
                     tick={{ fontSize: '0.75rem', fill: 'var(--recharts-axis-tick-color, #6b7280)' }} 
                     className="dark:fill-gray-300"/>
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), "Total Cost"]}
                contentStyle={{ backgroundColor: '#4B5563', borderRadius: '0.375rem', borderColor: '#6B7280' }}
                itemStyle={{ color: '#F3F4F6' }}
                labelStyle={{ color: '#F3F4F6', fontWeight: 'bold' }}
              />
              <Legend wrapperStyle={{ fontSize: '0.875rem' }}/>
              {chartData.map((entry) => (
                <Bar key={entry.name} dataKey="cost" name={entry.name} fill={entry.fill} barSize={50} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">Pricing Model Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {costBreakdowns.map(breakdown => (
            <CostCard key={breakdown.modelName} {...breakdown} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;
