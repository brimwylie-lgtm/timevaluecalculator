import { calculateNetIncome, STATE_TAX_FLAT, type FilingStatus } from './tax';

export interface WageInputs {
  // Salary
  annualSalary: number;
  state: string;
  filingStatus: FilingStatus;
  age: number;

  // Time (weekly except prep which is daily)
  officialHoursPerWeek: number;
  overtimeHoursPerWeek: number;
  commuteMinutesOneWay: number;
  prepMinutesPerDay: number;
  daysPerWeek: number;

  // Money (weekly or monthly as labeled)
  commuteCostPerWeek: number;
  lunchesPerWeek: number;
  avgLunchCost: number;
  coffeeSnacksPerWeek: number;
  workClothingPerMonth: number;
  childcarePerMonth: number;
}

export interface WageResult {
  // Headline
  naiveHourlyWage: number;
  realHourlyWage: number;
  percentDrop: number;

  // Time breakdown
  workHoursPerWeek: number;
  totalHoursPerWeek: number;
  hiddenHoursPerWeek: number;

  // Money breakdown
  grossAnnual: number;
  taxTotal: number;
  netAnnual: number;
  jobCostsAnnual: number;
  takeHomeAnnual: number;

  // Life math
  yearsUntilRetirement: number;
  lifetimeWorkHours: number;
  percentOfWakingLifeAtWork: number;

  // Detail
  breakdown: {
    taxes: { federal: number; fica: number; state: number };
    jobCosts: {
      commute: number;
      lunches: number;
      coffeeSnacks: number;
      clothing: number;
      childcare: number;
    };
    hiddenTime: {
      commute: number;
      prep: number;
      overtime: number;
    };
  };
}

const WEEKS_PER_YEAR = 50;
const RETIREMENT_AGE = 65;
const WAKING_HOURS_PER_WEEK = 7 * 16;

export function calculateWage(inputs: WageInputs): WageResult {
  const tax = calculateNetIncome(inputs.annualSalary, inputs.filingStatus, inputs.state);

  const commuteWeekly = inputs.commuteCostPerWeek;
  const lunchesWeekly = inputs.lunchesPerWeek * inputs.avgLunchCost;
  const coffeeSnacksWeekly = inputs.coffeeSnacksPerWeek;

  const commuteAnnual = commuteWeekly * WEEKS_PER_YEAR;
  const lunchesAnnual = lunchesWeekly * WEEKS_PER_YEAR;
  const coffeeSnacksAnnual = coffeeSnacksWeekly * WEEKS_PER_YEAR;
  const clothingAnnual = inputs.workClothingPerMonth * 12;
  const childcareAnnual = inputs.childcarePerMonth * 12;

  const jobCostsAnnual =
    commuteAnnual + lunchesAnnual + coffeeSnacksAnnual + clothingAnnual + childcareAnnual;

  const commuteHoursWeekly = (inputs.commuteMinutesOneWay * 2 * inputs.daysPerWeek) / 60;
  const prepHoursWeekly = (inputs.prepMinutesPerDay * inputs.daysPerWeek) / 60;
  const overtimeHoursWeekly = inputs.overtimeHoursPerWeek;

  const hiddenHoursPerWeek = commuteHoursWeekly + prepHoursWeekly + overtimeHoursWeekly;
  const totalHoursPerWeek = inputs.officialHoursPerWeek + hiddenHoursPerWeek;

  const naiveHourlyWage =
    inputs.officialHoursPerWeek > 0
      ? inputs.annualSalary / (inputs.officialHoursPerWeek * WEEKS_PER_YEAR)
      : 0;

  const takeHomeAnnual = tax.net - jobCostsAnnual;
  const totalHoursAnnual = totalHoursPerWeek * WEEKS_PER_YEAR;
  const realHourlyWage = totalHoursAnnual > 0 ? takeHomeAnnual / totalHoursAnnual : 0;

  const percentDrop =
    naiveHourlyWage > 0 ? ((naiveHourlyWage - realHourlyWage) / naiveHourlyWage) * 100 : 0;

  const yearsUntilRetirement = Math.max(0, RETIREMENT_AGE - inputs.age);
  const lifetimeWorkHours = totalHoursAnnual * yearsUntilRetirement;
  const totalWakingHoursUntilRetirement = WAKING_HOURS_PER_WEEK * 52 * yearsUntilRetirement;
  const percentOfWakingLifeAtWork =
    totalWakingHoursUntilRetirement > 0
      ? (lifetimeWorkHours / totalWakingHoursUntilRetirement) * 100
      : 0;

  return {
    naiveHourlyWage,
    realHourlyWage,
    percentDrop,
    workHoursPerWeek: inputs.officialHoursPerWeek,
    totalHoursPerWeek,
    hiddenHoursPerWeek,
    grossAnnual: inputs.annualSalary,
    taxTotal: tax.total,
    netAnnual: tax.net,
    jobCostsAnnual,
    takeHomeAnnual,
    yearsUntilRetirement,
    lifetimeWorkHours,
    percentOfWakingLifeAtWork,
    breakdown: {
      taxes: { federal: tax.federal, fica: tax.fica, state: tax.state },
      jobCosts: {
        commute: commuteAnnual,
        lunches: lunchesAnnual,
        coffeeSnacks: coffeeSnacksAnnual,
        clothing: clothingAnnual,
        childcare: childcareAnnual,
      },
      hiddenTime: {
        commute: commuteHoursWeekly,
        prep: prepHoursWeekly,
        overtime: overtimeHoursWeekly,
      },
    },
  };
}

export interface Scenarios {
  remoteWork: boolean;
  packedLunch: boolean;
  movedState: string | null;
}

export function applyScenarios(inputs: WageInputs, scenarios: Scenarios): WageInputs {
  const next = { ...inputs };
  if (scenarios.remoteWork) {
    next.commuteCostPerWeek = 0;
    next.commuteMinutesOneWay = 0;
    next.prepMinutesPerDay = Math.min(next.prepMinutesPerDay, 10);
    next.workClothingPerMonth = Math.floor(next.workClothingPerMonth * 0.25);
  }
  if (scenarios.packedLunch) {
    next.lunchesPerWeek = 0;
    next.avgLunchCost = 0;
  }
  if (scenarios.movedState) {
    next.state = scenarios.movedState;
  }
  return next;
}

// Find a no-income-tax state that gives the biggest real wage boost.
// Used for the "if you moved to X" suggestion.
export function findBestState(inputs: WageInputs): { code: string; name: string; delta: number } {
  const base = calculateWage(inputs).realHourlyWage;
  let best = { code: inputs.state, name: STATE_TAX_FLAT[inputs.state]?.name ?? '', delta: 0 };
  for (const [code, { rate, name }] of Object.entries(STATE_TAX_FLAT)) {
    if (rate !== 0) continue;
    if (code === inputs.state) continue;
    const alt = calculateWage({ ...inputs, state: code }).realHourlyWage;
    const delta = alt - base;
    if (delta > best.delta) {
      best = { code, name, delta };
    }
  }
  return best;
}

export function translateCost(dollarAmount: number, realHourlyWage: number) {
  if (realHourlyWage <= 0) return null;

  const hours = dollarAmount / realHourlyWage;
  const workDays = hours / 8;
  const workWeeks = hours / 40;
  const workMonths = hours / 160;
  const workYears = hours / (40 * 50);

  let primary: { value: number; unit: string };
  if (hours < 1) {
    primary = { value: hours * 60, unit: 'minutes' };
  } else if (hours < 8) {
    primary = { value: hours, unit: 'hours' };
  } else if (hours < 40) {
    primary = { value: workDays, unit: 'work days' };
  } else if (hours < 160) {
    primary = { value: workWeeks, unit: 'work weeks' };
  } else if (hours < 40 * 50) {
    primary = { value: workMonths, unit: 'work months' };
  } else {
    primary = { value: workYears, unit: 'work years' };
  }

  return {
    hours,
    workDays,
    workWeeks,
    workMonths,
    workYears,
    primary,
  };
}

export function formatCurrency(n: number): string {
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
}

export function formatCurrencyPrecise(n: number): string {
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatNumber(n: number, decimals = 1): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
