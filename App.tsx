
import React, { useState, useMemo } from 'react';
import InputControls from './components/InputControls';
import InfoBlurb from './components/InfoBlurb';
import ComparisonView from './components/ComparisonView';
import { GpuUsageInputs, CostBreakdown, ChartDataItem } from './types';
import { PRICING_RATES, PricingModel, MODEL_COLORS, DEFAULT_INPUTS } from './constants';

const App: React.FC = () => {
  const [inputs, setInputs] = useState<GpuUsageInputs>(DEFAULT_INPUTS);

  const handleInputChange = <K extends keyof GpuUsageInputs>(
    key: K,
    value: GpuUsageInputs[K]
  ) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const formatGpuHours = (hours: number): string => {
    return `${hours.toFixed(1)} GPU hour${hours === 1 ? '' : 's'}`;
  };

  const calculatedCosts = useMemo(() => {
    const { numGPUs, dailyUsageHours, workloadDaysPerWeek, comparisonPeriodDays } = inputs;

    // Calculate actual workload days within the comparison period
    // E.g., if comparison is 3 days, and workload is 5 days/week, it runs on 3 of those days.
    // If comparison is 7 days, and workload is 5 days/week, it runs on 5 days.
    const actualActiveDaysInPeriod = Math.min(comparisonPeriodDays, Math.ceil(workloadDaysPerWeek * (comparisonPeriodDays / 7) ));
    
    const totalUsageHoursInPeriod = numGPUs * dailyUsageHours * actualActiveDaysInPeriod;

    const onDemandCost = totalUsageHoursInPeriod * PRICING_RATES.ON_DEMAND;
    const flexStartCost = totalUsageHoursInPeriod * PRICING_RATES.FLEX_START;

    // CUDs are paid 24/7 for the number of GPUs over the comparison period
    const totalHoursForCUDs = numGPUs * 24 * comparisonPeriodDays;
    const oneYearCudCost = totalHoursForCUDs * PRICING_RATES.ONE_YEAR_CUD;
    const threeYearCudCost = totalHoursForCUDs * PRICING_RATES.THREE_YEAR_CUD;
    
    return {
      onDemandCost,
      flexStartCost,
      oneYearCudCost,
      threeYearCudCost,
      totalUsageHoursInPeriod,
      totalHoursForCUDs,
      actualActiveDaysInPeriod,
      comparisonPeriodDays
    };
  }, [inputs]);

  const chartData: ChartDataItem[] = useMemo(() => [
    { name: PricingModel.FlexStart, cost: calculatedCosts.flexStartCost, fill: MODEL_COLORS[PricingModel.FlexStart] },
    { name: PricingModel.OnDemand, cost: calculatedCosts.onDemandCost, fill: MODEL_COLORS[PricingModel.OnDemand] },
    { name: PricingModel.OneYearCUD, cost: calculatedCosts.oneYearCudCost, fill: MODEL_COLORS[PricingModel.OneYearCUD] },
    { name: PricingModel.ThreeYearCUD, cost: calculatedCosts.threeYearCudCost, fill: MODEL_COLORS[PricingModel.ThreeYearCUD] },
  ].sort((a,b) => a.cost - b.cost), [calculatedCosts]);

  const costBreakdowns: CostBreakdown[] = useMemo(() => [
    {
      modelName: PricingModel.FlexStart,
      totalCost: calculatedCosts.flexStartCost,
      pricePerHour: PRICING_RATES.FLEX_START,
      usageDescription: `Based on ${formatGpuHours(calculatedCosts.totalUsageHoursInPeriod)} over ${calculatedCosts.actualActiveDaysInPeriod} day(s) within a ${calculatedCosts.comparisonPeriodDays}-day period. (Pay-as-you-go)`,
      benefits: [
        "Pay only for actual GPU usage (vs. 24/7 CUDs).",
        "Discounted pricing vs. On-Demand for flexible start times.",
        "Improved resource obtainability; VMs run up to 7 days per instance."
      ],
      color: MODEL_COLORS[PricingModel.FlexStart],
    },
    {
      modelName: PricingModel.OnDemand,
      totalCost: calculatedCosts.onDemandCost,
      pricePerHour: PRICING_RATES.ON_DEMAND,
      usageDescription: `Based on ${formatGpuHours(calculatedCosts.totalUsageHoursInPeriod)} over ${calculatedCosts.actualActiveDaysInPeriod} day(s) within a ${calculatedCosts.comparisonPeriodDays}-day period. (Pay-as-you-go)`,
      benefits: ["Highest flexibility, immediate start (when capacity available)."],
      considerations: ["Highest hourly cost."],
      color: MODEL_COLORS[PricingModel.OnDemand],
    },
    {
      modelName: PricingModel.OneYearCUD,
      totalCost: calculatedCosts.oneYearCudCost,
      pricePerHour: PRICING_RATES.ONE_YEAR_CUD,
      usageDescription: `Based on 24/7 commitment for ${inputs.numGPUs} GPU(s) over ${calculatedCosts.comparisonPeriodDays} day(s), totaling ${formatGpuHours(calculatedCosts.totalHoursForCUDs)}.`,
      benefits: ["Discounted vs. On-Demand for committed 24/7 usage over 1 year."],
      considerations: ["Cost-effective if actual GPU utilization is consistently high.", "1-year commitment."],
      color: MODEL_COLORS[PricingModel.OneYearCUD],
    },
    {
      modelName: PricingModel.ThreeYearCUD,
      totalCost: calculatedCosts.threeYearCudCost,
      pricePerHour: PRICING_RATES.THREE_YEAR_CUD,
      usageDescription: `Based on 24/7 commitment for ${inputs.numGPUs} GPU(s) over ${calculatedCosts.comparisonPeriodDays} day(s), totaling ${formatGpuHours(calculatedCosts.totalHoursForCUDs)}.`,
      benefits: ["Deepest discount for long-term, committed 24/7 usage."],
      considerations: ["Best for very stable, long-term high utilization.", "3-year commitment."],
      color: MODEL_COLORS[PricingModel.ThreeYearCUD],
    },
  ].sort((a,b) => a.totalCost - b.totalCost), [calculatedCosts, inputs.numGPUs]);


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 md:p-8 transition-colors duration-300">
      <header className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-indigo-700 dark:text-indigo-400">
          GPU Cost Optimizer: Flex-Start Comparison
        </h1>
        <p className="text-md text-gray-600 dark:text-gray-400 mt-1">
          Visualize H100 80GB equivalent GPU costs on GCP for workloads up to {DEFAULT_INPUTS.comparisonPeriodDays} days.
        </p>
      </header>

      <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <InputControls inputs={inputs} onInputChange={handleInputChange} />
          <InfoBlurb />
        </div>
        <div className="lg:col-span-2">
          <ComparisonView chartData={chartData} costBreakdowns={costBreakdowns} />
        </div>
      </div>
      
      <footer className="text-center mt-12 py-6 border-t border-gray-300 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Pricing data as of user's last update. For estimation purposes only. Always check official GCP pricing.
        </p>
      </footer>
    </div>
  );
};

export default App;
