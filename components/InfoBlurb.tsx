
import React from 'react';
import { FLEX_START_PRODUCT_DESCRIPTION } from '../constants';

const InfoBlurb: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mt-8">
      <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">About Flex-Start</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
        {FLEX_START_PRODUCT_DESCRIPTION}
      </p>
      <div className="mt-4 space-y-2">
        <h4 className="text-md font-semibold text-gray-700 dark:text-gray-200">Key Flex-Start Advantages:</h4>
        <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
          <li>
            <span className="font-medium">Cost Efficiency vs. Reservations:</span> Pay only for actual GPU usage, not 24/7 commitment.
          </li>
          <li>
            <span className="font-medium">Discounted Pricing vs. On-Demand:</span> Lower hourly rates in return for flexible workload start times.
          </li>
          <li>
            <span className="font-medium">Improved Resource Obtainability:</span> Persist resource requests and avoid stockouts for workloads that can wait for capacity.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default InfoBlurb;
