// US Federal tax brackets for 2025 tax year (filed 2026).
// Source: IRS Revenue Procedure 2024-40.
// Note: We use 2025 brackets as they are the most recently finalized at build time.

export type FilingStatus = 'single' | 'married';

export interface TaxBracket {
  rate: number;
  upTo: number | null; // null = infinity
}

export const FEDERAL_BRACKETS_2025: Record<FilingStatus, TaxBracket[]> = {
  single: [
    { rate: 0.10, upTo: 11925 },
    { rate: 0.12, upTo: 48475 },
    { rate: 0.22, upTo: 103350 },
    { rate: 0.24, upTo: 197300 },
    { rate: 0.32, upTo: 250525 },
    { rate: 0.35, upTo: 626350 },
    { rate: 0.37, upTo: null },
  ],
  married: [
    { rate: 0.10, upTo: 23850 },
    { rate: 0.12, upTo: 96950 },
    { rate: 0.22, upTo: 206700 },
    { rate: 0.24, upTo: 394600 },
    { rate: 0.32, upTo: 501050 },
    { rate: 0.35, upTo: 751600 },
    { rate: 0.37, upTo: null },
  ],
};

export const STANDARD_DEDUCTION_2025: Record<FilingStatus, number> = {
  single: 15000,
  married: 30000,
};

// FICA: Social Security 6.2% (up to $176,100 for 2025) + Medicare 1.45%.
// Additional Medicare 0.9% above $200k single / $250k married.
export const SS_RATE = 0.062;
export const SS_WAGE_BASE_2025 = 176100;
export const MEDICARE_RATE = 0.0145;
export const ADDITIONAL_MEDICARE_RATE = 0.009;
export const ADDITIONAL_MEDICARE_THRESHOLD: Record<FilingStatus, number> = {
  single: 200000,
  married: 250000,
};

// Flat state income tax approximations.
// Uses top marginal rate for simplicity on the assumption that middle-income
// earners pay close to but not exactly this rate. Noted in methodology page.
// Source: Tax Foundation 2025 State Individual Income Tax Rates.
export const STATE_TAX_FLAT: Record<string, { rate: number; name: string }> = {
  AL: { rate: 0.05, name: 'Alabama' },
  AK: { rate: 0, name: 'Alaska' },
  AZ: { rate: 0.025, name: 'Arizona' },
  AR: { rate: 0.039, name: 'Arkansas' },
  CA: { rate: 0.093, name: 'California' },
  CO: { rate: 0.044, name: 'Colorado' },
  CT: { rate: 0.055, name: 'Connecticut' },
  DE: { rate: 0.066, name: 'Delaware' },
  DC: { rate: 0.085, name: 'District of Columbia' },
  FL: { rate: 0, name: 'Florida' },
  GA: { rate: 0.0539, name: 'Georgia' },
  HI: { rate: 0.079, name: 'Hawaii' },
  ID: { rate: 0.058, name: 'Idaho' },
  IL: { rate: 0.0495, name: 'Illinois' },
  IN: { rate: 0.03, name: 'Indiana' },
  IA: { rate: 0.038, name: 'Iowa' },
  KS: { rate: 0.057, name: 'Kansas' },
  KY: { rate: 0.04, name: 'Kentucky' },
  LA: { rate: 0.03, name: 'Louisiana' },
  ME: { rate: 0.0715, name: 'Maine' },
  MD: { rate: 0.0525, name: 'Maryland' },
  MA: { rate: 0.05, name: 'Massachusetts' },
  MI: { rate: 0.0425, name: 'Michigan' },
  MN: { rate: 0.0785, name: 'Minnesota' },
  MS: { rate: 0.044, name: 'Mississippi' },
  MO: { rate: 0.047, name: 'Missouri' },
  MT: { rate: 0.059, name: 'Montana' },
  NE: { rate: 0.052, name: 'Nebraska' },
  NV: { rate: 0, name: 'Nevada' },
  NH: { rate: 0, name: 'New Hampshire' }, // no wage income tax
  NJ: { rate: 0.0637, name: 'New Jersey' },
  NM: { rate: 0.049, name: 'New Mexico' },
  NY: { rate: 0.0685, name: 'New York' },
  NC: { rate: 0.0425, name: 'North Carolina' },
  ND: { rate: 0.025, name: 'North Dakota' },
  OH: { rate: 0.035, name: 'Ohio' },
  OK: { rate: 0.0475, name: 'Oklahoma' },
  OR: { rate: 0.0875, name: 'Oregon' },
  PA: { rate: 0.0307, name: 'Pennsylvania' },
  RI: { rate: 0.0475, name: 'Rhode Island' },
  SC: { rate: 0.064, name: 'South Carolina' },
  SD: { rate: 0, name: 'South Dakota' },
  TN: { rate: 0, name: 'Tennessee' },
  TX: { rate: 0, name: 'Texas' },
  UT: { rate: 0.0455, name: 'Utah' },
  VT: { rate: 0.066, name: 'Vermont' },
  VA: { rate: 0.0525, name: 'Virginia' },
  WA: { rate: 0, name: 'Washington' },
  WV: { rate: 0.0482, name: 'West Virginia' },
  WI: { rate: 0.053, name: 'Wisconsin' },
  WY: { rate: 0, name: 'Wyoming' },
};

export function calculateFederalTax(taxableIncome: number, status: FilingStatus): number {
  if (taxableIncome <= 0) return 0;
  const brackets = FEDERAL_BRACKETS_2025[status];
  let tax = 0;
  let prevLimit = 0;
  for (const bracket of brackets) {
    const limit = bracket.upTo ?? Infinity;
    const taxableAtThisRate = Math.max(0, Math.min(taxableIncome, limit) - prevLimit);
    tax += taxableAtThisRate * bracket.rate;
    if (taxableIncome <= limit) break;
    prevLimit = limit;
  }
  return tax;
}

export function calculateFICA(grossIncome: number, status: FilingStatus): number {
  const ss = Math.min(grossIncome, SS_WAGE_BASE_2025) * SS_RATE;
  const medicare = grossIncome * MEDICARE_RATE;
  const addlThreshold = ADDITIONAL_MEDICARE_THRESHOLD[status];
  const addlMedicare = Math.max(0, grossIncome - addlThreshold) * ADDITIONAL_MEDICARE_RATE;
  return ss + medicare + addlMedicare;
}

export function calculateStateTax(grossIncome: number, stateCode: string): number {
  const state = STATE_TAX_FLAT[stateCode];
  if (!state) return 0;
  return grossIncome * state.rate;
}

export function calculateNetIncome(
  grossIncome: number,
  status: FilingStatus,
  stateCode: string
): {
  federal: number;
  fica: number;
  state: number;
  total: number;
  net: number;
} {
  const taxableIncome = Math.max(0, grossIncome - STANDARD_DEDUCTION_2025[status]);
  const federal = calculateFederalTax(taxableIncome, status);
  const fica = calculateFICA(grossIncome, status);
  const state = calculateStateTax(grossIncome, stateCode);
  const total = federal + fica + state;
  const net = grossIncome - total;
  return { federal, fica, state, total, net };
}
