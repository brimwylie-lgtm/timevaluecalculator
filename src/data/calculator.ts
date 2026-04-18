import { calculateNetIncome, type FilingStatus } from './tax';

export interface WageInputs {
  // Salary
  annualSalary: number;
  state: string;
  filingStatus: FilingStatus;

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

const WEEKS_PER_YEAR = 50; // 2 weeks off for vacation/holidays is reasonable default

export function calculateWage(inputs: WageInputs): WageResult {
  // Tax calculation
  const tax = calculateNetIncome(inputs.annualSalary, inputs.filingStatus, inputs.state);

  // Weekly job costs
  const commuteWeekly = inputs.commuteCostPerWeek;
  const lunchesWeekly = inputs.lunchesPerWeek * inputs.avgLunchCost;
  const coffeeSnacksWeekly = inputs.coffeeSnacksPerWeek;

  // Annualize
  const commuteAnnual = commuteWeekly * WEEKS_PER_YEAR;
  const lunchesAnnual = lunchesWeekly * WEEKS_PER_YEAR;
  const coffeeSnacksAnnual = coffeeSnacksWeekly * WEEKS_PER_YEAR;
  const clothingAnnual = inputs.workClothingPerMonth * 12;
  const childcareAnnual = inputs.childcarePerMonth * 12;

  const jobCostsAnnual =
    commuteAnnual + lunchesAnnual + coffeeSnacksAnnual + clothingAnnual + childcareAnnual;

  // Weekly time breakdown
  const commuteHoursWeekly = (inputs.commuteMinutesOneWay * 2 * inputs.daysPerWeek) / 60;
  const prepHoursWeekly = (inputs.prepMinutesPerDay * inputs.daysPerWeek) / 60;
  const overtimeHoursWeekly = inputs.overtimeHoursPerWeek;

  const hiddenHoursPerWeek = commuteHoursWeekly + prepHoursWeekly + overtimeHoursWeekly;
  const totalHoursPerWeek = inputs.officialHoursPerWeek + hiddenHoursPerWeek;

  // The two wages
  const naiveHourlyWage =
    inputs.officialHoursPerWeek > 0
      ? inputs.annualSalary / (inputs.officialHoursPerWeek * WEEKS_PER_YEAR)
      : 0;

  const takeHomeAnnual = tax.net - jobCostsAnnual;
  const totalHoursAnnual = totalHoursPerWeek * WEEKS_PER_YEAR;
  const realHourlyWage = totalHoursAnnual > 0 ? takeHomeAnnual / totalHoursAnnual : 0;

  const percentDrop =
    naiveHourlyWage > 0 ? ((naiveHourlyWage - realHourlyWage) / naiveHourlyWage) * 100 : 0;

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

// Translate a dollar amount into "hours/days/weeks of your life"
export function translateCost(dollarAmount: number, realHourlyWage: number) {
  if (realHourlyWage <= 0) return null;

  const hours = dollarAmount / realHourlyWage;
  const workDays = hours / 8; // assume 8-hour workday for this comparison
  const workWeeks = hours / 40;
  const workMonths = hours / 160;

  // Pick the most impactful unit
  let primary: { value: number; unit: string };
  if (hours < 1) {
    primary = { value: hours * 60, unit: 'minutes' };
  } else if (hours < 8) {
    primary = { value: hours, unit: 'hours' };
  } else if (hours < 40) {
    primary = { value: workDays, unit: 'work days' };
  } else if (hours < 160) {
    primary = { value: workWeeks, unit: 'work weeks' };
  } else {
    primary = { value: workMonths, unit: 'work months' };
  }

  return {
    hours,
    workDays,
    workWeeks,
    workMonths,
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
