/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface PricingDetails {
  flexStart: number;
  onDemand: number;
  oneYearCUD: number;
  threeYearCUD: number;
}

const pricingData: Record<string, PricingDetails> = {
  "A4": { flexStart: 11.28, onDemand: 16.11, oneYearCUD: 11.12, threeYearCUD: 7.09 },
  "A3 Ultra": { flexStart: 5.30, onDemand: 11.01, oneYearCUD: 7.60, threeYearCUD: 4.84 },
  "A3 Mega": { flexStart: 5.03, onDemand: 11.67, oneYearCUD: 8.05, threeYearCUD: 5.13 },
  "A3 High": { flexStart: 4.79, onDemand: 11.06, oneYearCUD: 7.63, threeYearCUD: 4.87 },
  "A2 Ultra": { flexStart: 2.40, onDemand: 5.07, oneYearCUD: 3.50, threeYearCUD: 2.23 },
  "A2 High": { flexStart: 2.00, onDemand: 3.67, oneYearCUD: 2.53, threeYearCUD: 1.62 },
};

const machineFamilies = Object.keys(pricingData);

interface AppState {
  selectedFamily: string;
  prices: PricingDetails;
  numGPUs: number;
  dailyGPUHours: number;
  workloadDaysPerWeek: number;
}

interface CalculatedCosts {
  flexStart: number;
  onDemand: number;
  oneYearCUD: number;
  threeYearCUD: number;
}

let appState: AppState;

// DOM Elements
let machineFamilySelect: HTMLSelectElement;
let priceFlexStartInput: HTMLInputElement;
let priceOnDemandInput: HTMLInputElement;
let price1yCUDInput: HTMLInputElement;
let price3yCUDInput: HTMLInputElement;
let numGPUsSlider: HTMLInputElement;
let dailyGPUHoursSlider: HTMLInputElement;
let workloadDaysSlider: HTMLInputElement;
let numGPUsValueSpan: HTMLSpanElement;
let dailyGPUHoursValueSpan: HTMLSpanElement;
let workloadDaysValueSpan: HTMLSpanElement;
let costChartContainer: HTMLDivElement;
let costSummaryDiv: HTMLDivElement;
let savingsSummaryDiv: HTMLDivElement;

function formatCurrency(amount: number): string {
  return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function calculateCosts(): CalculatedCosts | null {
  const { prices, numGPUs, dailyGPUHours, workloadDaysPerWeek } = appState;

  if (!prices || numGPUs <= 0) return null;

  const usageHoursPerWeek = dailyGPUHours * workloadDaysPerWeek;

  const costFlexStart = prices.flexStart * numGPUs * usageHoursPerWeek;
  const costOnDemand = prices.onDemand * numGPUs * usageHoursPerWeek;

  // CUDs are 24/7 commitments
  const cudHoursPerWeek = 24 * 7;
  const cost1yCUD = prices.oneYearCUD * numGPUs * cudHoursPerWeek;
  const cost3yCUD = prices.threeYearCUD * numGPUs * cudHoursPerWeek;

  return {
    flexStart: costFlexStart,
    onDemand: costOnDemand,
    oneYearCUD: cost1yCUD,
    threeYearCUD: cost3yCUD,
  };
}

function updatePriceInputsFromSelection() {
  const defaultPrices = pricingData[appState.selectedFamily];
  priceFlexStartInput.value = defaultPrices.flexStart.toFixed(2);
  priceOnDemandInput.value = defaultPrices.onDemand.toFixed(2);
  price1yCUDInput.value = defaultPrices.oneYearCUD.toFixed(2);
  price3yCUDInput.value = defaultPrices.threeYearCUD.toFixed(2);
  // Update state with these default prices
  appState.prices = { ...defaultPrices };
}

function renderChart(costs: CalculatedCosts) {
  costChartContainer.innerHTML = ''; // Clear previous chart or placeholder

  const models = [
    { name: 'Flex-start', cost: costs.flexStart, class: 'flex-start' },
    { name: 'On-demand', cost: costs.onDemand, class: 'on-demand' },
    { name: '1-year CUD', cost: costs.oneYearCUD, class: 'one-year-cud' },
    { name: '3-year CUD', cost: costs.threeYearCUD, class: 'three-year-cud' },
  ];

  const maxCost = Math.max(...models.map(m => m.cost), 0.01); // Ensure maxCost is not zero to prevent division by zero for height %

  models.forEach(model => {
    const wrapper = document.createElement('div');
    wrapper.className = 'bar-wrapper';

    const bar = document.createElement('div');
    bar.className = `bar ${model.class}`;
    const barHeight = (model.cost / maxCost) * 100; // Corrected: removed space before semicolon
    bar.style.height = `${Math.max(barHeight, 0.5)}%`; // min height for visibility even at 0 cost
    bar.setAttribute('role', 'img');
    bar.setAttribute('aria-label', `${model.name}: ${formatCurrency(model.cost)} weekly`);
    
    const valueDisplay = document.createElement('div');
    valueDisplay.className = 'bar-value';
    valueDisplay.textContent = formatCurrency(model.cost);
    bar.appendChild(valueDisplay);
    
    wrapper.appendChild(bar);

    const label = document.createElement('div');
    label.className = 'bar-label';
    label.textContent = model.name;
    wrapper.appendChild(label);

    costChartContainer.appendChild(wrapper);
  });
}


function renderSummary(costs: CalculatedCosts) {
  costSummaryDiv.innerHTML = `
    <h3>Weekly Cost Details:</h3>
    <p><strong>Flex-start:</strong> ${formatCurrency(costs.flexStart)}</p>
    <p><strong>On-demand:</strong> ${formatCurrency(costs.onDemand)}</p>
    <p><strong>1-year CUD (24/7):</strong> ${formatCurrency(costs.oneYearCUD)}</p>
    <p><strong>3-year CUD (24/7):</strong> ${formatCurrency(costs.threeYearCUD)}</p>
    <small>Note: CUD costs are for 24/7 commitment, regardless of usage sliders.</small>
  `;

  savingsSummaryDiv.innerHTML = '<h3>Savings vs. On-demand:</h3>';
  if (costs.onDemand > 0) {
      const onDemandCost = costs.onDemand;
      const savings = [
          { model: 'Flex-start', saving: onDemandCost - costs.flexStart },
          { model: '1-year CUD', saving: onDemandCost - costs.oneYearCUD },
          { model: '3-year CUD', saving: onDemandCost - costs.threeYearCUD },
      ];

      savings.forEach(s => {
          const percentageSaving = (s.saving / onDemandCost) * 100;
          const p = document.createElement('p');
          if (s.saving > 0) {
              p.innerHTML = `<strong>${s.model}:</strong> Save ${formatCurrency(s.saving)} (${percentageSaving.toFixed(1)}%)`;
          } else if (s.saving < 0) {
              p.innerHTML = `<strong>${s.model}:</strong> Costs ${formatCurrency(Math.abs(s.saving))} more (${Math.abs(percentageSaving).toFixed(1)}% more)`;
          } else {
              p.innerHTML = `<strong>${s.model}:</strong> Same cost as On-demand`;
          }
          savingsSummaryDiv.appendChild(p);
      });
  } else if (costs.onDemand === 0 && (costs.flexStart > 0 || costs.oneYearCUD > 0 || costs.threeYearCUD > 0)) {
      savingsSummaryDiv.innerHTML += '<p>On-demand cost is zero. Other models may have costs.</p>';
  }
  else {
      savingsSummaryDiv.innerHTML += '<p>Enter positive On-demand price and usage or adjust sliders to see savings.</p>';
  }
}

function updateUI() {
  // Update slider value displays
  numGPUsValueSpan.textContent = appState.numGPUs.toString();
  numGPUsSlider.setAttribute('aria-valuenow', appState.numGPUs.toString());
  numGPUsSlider.setAttribute('aria-valuetext', `${appState.numGPUs} GPUs`);

  dailyGPUHoursValueSpan.textContent = appState.dailyGPUHours.toString();
  dailyGPUHoursSlider.setAttribute('aria-valuenow', appState.dailyGPUHours.toString());
  dailyGPUHoursSlider.setAttribute('aria-valuetext', `${appState.dailyGPUHours} hours per day`);
  
  workloadDaysValueSpan.textContent = appState.workloadDaysPerWeek.toString();
  workloadDaysSlider.setAttribute('aria-valuenow', appState.workloadDaysPerWeek.toString());
  workloadDaysSlider.setAttribute('aria-valuetext', `${appState.workloadDaysPerWeek} days per week`);

  const costs = calculateCosts();
  if (costs) {
    renderChart(costs);
    renderSummary(costs);
  } else {
    costChartContainer.innerHTML = '<div class="chart-bar-placeholder"><p>Adjust controls to see cost comparison.</p></div>';
    costSummaryDiv.innerHTML = '<p>Enter valid inputs to calculate costs.</p>';
    savingsSummaryDiv.innerHTML = '';
  }
}

function handleMachineFamilyChange(event: Event) {
  appState.selectedFamily = (event.target as HTMLSelectElement).value;
  updatePriceInputsFromSelection(); // This also updates appState.prices
  updateUI();
}

function handlePriceInputChange() {
  appState.prices.flexStart = parseFloat(priceFlexStartInput.value) || 0;
  appState.prices.onDemand = parseFloat(priceOnDemandInput.value) || 0;
  appState.prices.oneYearCUD = parseFloat(price1yCUDInput.value) || 0;
  appState.prices.threeYearCUD = parseFloat(price3yCUDInput.value) || 0;
  updateUI();
}

function handleSliderChange() {
  appState.numGPUs = parseInt(numGPUsSlider.value);
  appState.dailyGPUHours = parseInt(dailyGPUHoursSlider.value);
  appState.workloadDaysPerWeek = parseInt(workloadDaysSlider.value);
  updateUI();
}

function initApp() {
  // Get DOM elements
  machineFamilySelect = document.getElementById('machine-family') as HTMLSelectElement;
  priceFlexStartInput = document.getElementById('price-flex-start') as HTMLInputElement;
  priceOnDemandInput = document.getElementById('price-on-demand') as HTMLInputElement;
  price1yCUDInput = document.getElementById('price-1y-cud') as HTMLInputElement;
  price3yCUDInput = document.getElementById('price-3y-cud') as HTMLInputElement;
  numGPUsSlider = document.getElementById('num-gpus') as HTMLInputElement;
  dailyGPUHoursSlider = document.getElementById('daily-gpu-hours') as HTMLInputElement;
  workloadDaysSlider = document.getElementById('workload-days') as HTMLInputElement;
  numGPUsValueSpan = document.getElementById('num-gpus-value') as HTMLSpanElement;
  dailyGPUHoursValueSpan = document.getElementById('daily-gpu-hours-value') as HTMLSpanElement;
  workloadDaysValueSpan = document.getElementById('workload-days-value') as HTMLSpanElement;
  costChartContainer = document.getElementById('cost-chart-container') as HTMLDivElement;
  costSummaryDiv = document.getElementById('cost-summary') as HTMLDivElement;
  savingsSummaryDiv = document.getElementById('savings-summary') as HTMLDivElement;

  // Populate machine family dropdown
  machineFamilies.forEach(family => {
    const option = document.createElement('option');
    option.value = family;
    option.textContent = family;
    machineFamilySelect.appendChild(option);
  });

  // Initialize state
  appState = {
    selectedFamily: machineFamilies[0], // Default to the first family
    prices: { ...pricingData[machineFamilies[0]] },
    numGPUs: 8, // Default GPUs
    dailyGPUHours: 8, // Default hours/day
    workloadDaysPerWeek: 5, // Default days/week
  };

  // Set initial values for controls based on state
  machineFamilySelect.value = appState.selectedFamily;
  updatePriceInputsFromSelection(); // Set initial price input values from data based on selected family
  
  numGPUsSlider.value = appState.numGPUs.toString();
  dailyGPUHoursSlider.value = appState.dailyGPUHours.toString();
  workloadDaysSlider.value = appState.workloadDaysPerWeek.toString();

  // Add event listeners
  machineFamilySelect.addEventListener('change', handleMachineFamilyChange);
  [priceFlexStartInput, priceOnDemandInput, price1yCUDInput, price3yCUDInput].forEach(input => {
    input.addEventListener('input', handlePriceInputChange);
  });
  [numGPUsSlider, dailyGPUHoursSlider, workloadDaysSlider].forEach(slider => {
    slider.addEventListener('input', handleSliderChange);
  });

  // Initial UI render
  updateUI();
}

// Start the app
document.addEventListener('DOMContentLoaded', initApp);