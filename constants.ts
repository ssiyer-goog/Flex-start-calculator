
export const PRICING_RATES = {
  ON_DEMAND: 11.06, // per GPU per hr
  ONE_YEAR_CUD: 7.67, // per GPU per hr (paid 24/7)
  THREE_YEAR_CUD: 4.855, // per GPU per hr (paid 24/7)
  FLEX_START: 4.79, // per GPU per hr (pay for use)
};

export enum PricingModel {
  OnDemand = 'On-Demand',
  FlexStart = 'Flex-Start',
  OneYearCUD = '1-Year CUD',
  ThreeYearCUD = '3-Year CUD',
}

export const MODEL_COLORS: Record<PricingModel, string> = {
  [PricingModel.FlexStart]: '#10B981', // Emerald 500
  [PricingModel.OnDemand]: '#F59E0B', // Amber 500
  [PricingModel.OneYearCUD]: '#3B82F6', // Blue 500
  [PricingModel.ThreeYearCUD]: '#8B5CF6', // Violet 500
};

export const DEFAULT_INPUTS = {
  numGPUs: 1,
  dailyUsageHours: 8,
  workloadDaysPerWeek: 5, // e.g., Mon-Fri
  comparisonPeriodDays: 7, // User-requested max for this filter
};

export const FLEX_START_PRODUCT_DESCRIPTION = "Flex-Start is a consumption model for compute on GCP designed to improve resource obtainability for workloads that can accommodate flexible start times. Customers can persist their resource requests without facing stockouts. Once capacity is available, their workload is provisioned with VMs for a user-defined maximum run duration (up to 7 days), after which the VMs are automatically terminated. This consumption model can be accessed via MIG, Instances, GKE, and Slurm/Cluster Toolkit. Vertex AI Training support is also rolling out in June 2025.";

export const MAX_COMPARISON_PERIOD_DAYS = 7;
