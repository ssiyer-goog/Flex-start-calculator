
import { PricingModel } from './constants';

export interface GpuUsageInputs {
  numGPUs: number;
  dailyUsageHours: number;
  workloadDaysPerWeek: number; // How many days in a full week the workload typically runs
  comparisonPeriodDays: number; // The actual period (1-7 days) for which costs are compared
}

export interface CostBreakdown {
  modelName: PricingModel;
  totalCost: number;
  pricePerHour: number;
  usageDescription: string;
  benefits: string[];
  considerations?: string[];
  color: string;
}

export interface ChartDataItem {
  name: string; // PricingModel as string
  cost: number;
  fill: string;
}
