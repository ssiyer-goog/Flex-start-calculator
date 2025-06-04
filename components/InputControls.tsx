
import React from 'react';
import { GpuUsageInputs } from '../types';
import { MAX_COMPARISON_PERIOD_DAYS } from '../constants';

interface InputControlsProps {
  inputs: GpuUsageInputs;
  onInputChange: <K extends keyof GpuUsageInputs>(key: K, value: GpuUsageInputs[K]) => void;
}

const SliderInput: React.FC<{
  label: string;
  id: keyof GpuUsageInputs;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (value: number) => void;
}> = ({ label, id, value, min, max, step, unit, onChange }) => {
  return (
    <div className="mb-6">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}: <span className="font-bold text-indigo-600 dark:text-indigo-400">{value}</span> {unit}
      </label>
      <input
        type="range"
        id={id}
        name={id}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-400"
      />
    </div>
  );
};

const InputControls: React.FC<InputControlsProps> = ({ inputs, onInputChange }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">Configure Your Workload</h2>
      <SliderInput
        label="Number of GPUs (H100 80GB equiv.)"
        id="numGPUs"
        value={inputs.numGPUs}
        min={1}
        max={16}
        step={1}
        onChange={(value) => onInputChange('numGPUs', value)}
      />
      <SliderInput
        label="Daily GPU Usage per Workload Day"
        id="dailyUsageHours"
        value={inputs.dailyUsageHours}
        min={1}
        max={24}
        step={1}
        unit="hours"
        onChange={(value) => onInputChange('dailyUsageHours', value)}
      />
      <SliderInput
        label="Workload Days per Week"
        id="workloadDaysPerWeek"
        value={inputs.workloadDaysPerWeek}
        min={1}
        max={7}
        step={1}
        unit="days"
        onChange={(value) => onInputChange('workloadDaysPerWeek', value)}
      />
      <SliderInput
        label="Comparison Period"
        id="comparisonPeriodDays"
        value={inputs.comparisonPeriodDays}
        min={1}
        max={MAX_COMPARISON_PERIOD_DAYS}
        step={1}
        unit="days"
        onChange={(value) => onInputChange('comparisonPeriodDays', value)}
      />
       <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Costs are compared over this {inputs.comparisonPeriodDays}-day period. Flex-Start VMs run for up to 7 days per instance.
      </p>
    </div>
  );
};

export default InputControls;
