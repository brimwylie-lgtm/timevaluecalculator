import { useState, useMemo, useRef, useEffect } from 'react';
import { calculateWage, formatCurrency, formatCurrencyPrecise, formatNumber, translateCost, type WageInputs } from '../data/calculator';
import { STATE_TAX_FLAT } from '../data/tax';

const DEFAULT_INPUTS: WageInputs = {
  annualSalary: 75000,
  state: 'NY',
  filingStatus: 'single',
  officialHoursPerWeek: 40,
  overtimeHoursPerWeek: 5,
  commuteMinutesOneWay: 30,
  prepMinutesPerDay: 30,
  daysPerWeek: 5,
  commuteCostPerWeek: 60,
  lunchesPerWeek: 3,
  avgLunchCost: 15,
  coffeeSnacksPerWeek: 20,
  workClothingPerMonth: 40,
  childcarePerMonth: 0,
};

type Step = 'intro' | 'salary' | 'time' | 'money' | 'result';

export default function Calculator() {
  const [step, setStep] = useState<Step>('intro');
  const [inputs, setInputs] = useState<WageInputs>(DEFAULT_INPUTS);

  const result = useMemo(() => calculateWage(inputs), [inputs]);

  const update = <K extends keyof WageInputs>(key: K, value: WageInputs[K]) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const goTo = (next: Step) => {
    setStep(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {step === 'intro' && <Intro onStart={() => goTo('salary')} />}
      {step === 'salary' && (
        <SalaryStep
          inputs={inputs}
          update={update}
          onNext={() => goTo('time')}
          onBack={() => goTo('intro')}
        />
      )}
      {step === 'time' && (
        <TimeStep
          inputs={inputs}
          update={update}
          onNext={() => goTo('money')}
          onBack={() => goTo('salary')}
        />
      )}
      {step === 'money' && (
        <MoneyStep
          inputs={inputs}
          update={update}
          onNext={() => goTo('result')}
          onBack={() => goTo('time')}
        />
      )}
      {step === 'result' && (
        <Result
          result={result}
          inputs={inputs}
          onRestart={() => {
            setInputs(DEFAULT_INPUTS);
            goTo('intro');
          }}
          onEdit={() => goTo('salary')}
        />
      )}
    </div>
  );
}

/* ============ STEPS ============ */

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24 md:py-32">
      <div className="reveal reveal-delay-1">
        <p className="font-mono text-xs uppercase tracking-widest text-mute mb-8">
          A calculator / Vol. 001
        </p>
      </div>

      <h1 className="reveal reveal-delay-2 font-display font-light text-6xl md:text-8xl leading-[0.95] tracking-tightest mb-8">
        Your salary tells you<br />
        what your time<br />
        <span className="italic text-blood" style={{ fontVariationSettings: "'SOFT' 100" }}>is worth.</span>
      </h1>

      <p className="reveal reveal-delay-3 font-display text-3xl md:text-4xl text-ink-soft italic mb-16 leading-tight">
        It's lying.
      </p>

      <div className="reveal reveal-delay-4 max-w-xl space-y-6 text-lg md:text-xl leading-relaxed text-ink-soft">
        <p>
          That $38 an hour number on your offer letter? It doesn't exist.
          Not after taxes. Not after the commute you don't get paid for. Not after
          the lunches, the coffees, the clothes, the childcare, the hours of
          unpaid overtime, the forty minutes every morning getting ready.
        </p>
        <p>
          This calculator does the math <em>Your Money or Your Life</em> started in 1992:
          what's left when you subtract everything your job actually costs you,
          divided by every hour it actually takes.
        </p>
        <p className="font-display text-2xl text-ink">
          Twelve questions. One uncomfortable number.
        </p>
      </div>

      <div className="reveal reveal-delay-5 mt-16">
        <button onClick={onStart} className="btn-primary">
          Find out &rarr;
        </button>
        <p className="mt-6 font-mono text-xs text-mute uppercase tracking-widest">
          No email. No signup. Nothing saved.
        </p>
      </div>
    </div>
  );
}

function StepHeader({ n, total, title }: { n: number; total: number; title: string }) {
  return (
    <div className="mb-12">
      <p className="font-mono text-xs uppercase tracking-widest text-mute mb-3">
        Step {n} of {total}
      </p>
      <h2 className="font-display font-light text-4xl md:text-5xl tracking-tightest leading-tight">
        {title}
      </h2>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <label className="label-base">{label}</label>
      {children}
      {hint && <p className="mt-2 text-sm text-mute italic">{hint}</p>}
    </div>
  );
}

function NumberInput({
  value,
  onChange,
  prefix,
  suffix,
  placeholder,
}: {
  value: number;
  onChange: (n: number) => void;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex items-baseline gap-2">
      {prefix && <span className="font-mono text-lg text-mute">{prefix}</span>}
      <input
        type="number"
        inputMode="decimal"
        value={value === 0 ? '' : value}
        placeholder={placeholder ?? '0'}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="input-base flex-1 min-w-0"
      />
      {suffix && <span className="font-mono text-sm text-mute">{suffix}</span>}
    </div>
  );
}

function SalaryStep({
  inputs,
  update,
  onNext,
  onBack,
}: {
  inputs: WageInputs;
  update: <K extends keyof WageInputs>(key: K, value: WageInputs[K]) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 md:py-24">
      <StepHeader n={1} total={3} title="What you make" />

      <Field label="Annual salary (gross, before tax)">
        <NumberInput
          value={inputs.annualSalary}
          onChange={(n) => update('annualSalary', n)}
          prefix="$"
        />
      </Field>

      <Field label="State" hint="Used for state income tax. We ignore local/city tax.">
        <select
          value={inputs.state}
          onChange={(e) => update('state', e.target.value)}
          className="input-base cursor-pointer"
        >
          {Object.entries(STATE_TAX_FLAT)
            .sort(([, a], [, b]) => a.name.localeCompare(b.name))
            .map(([code, { name }]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
        </select>
      </Field>

      <Field label="Filing status">
        <div className="flex gap-4 mt-3">
          {(['single', 'married'] as const).map((s) => (
            <button
              key={s}
              onClick={() => update('filingStatus', s)}
              className={`px-6 py-2 font-display uppercase tracking-tight border-2 transition-colors ${
                inputs.filingStatus === s
                  ? 'bg-ink text-cream border-ink'
                  : 'border-ink/30 text-ink hover:border-ink'
              }`}
            >
              {s === 'married' ? 'Married, filing jointly' : 'Single'}
            </button>
          ))}
        </div>
      </Field>

      <StepNav onBack={onBack} onNext={onNext} nextLabel="Next: your time &rarr;" />
    </div>
  );
}

function TimeStep({
  inputs,
  update,
  onNext,
  onBack,
}: {
  inputs: WageInputs;
  update: <K extends keyof WageInputs>(key: K, value: WageInputs[K]) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 md:py-24">
      <StepHeader n={2} total={3} title="The hours you actually spend on work" />

      <p className="text-lg text-ink-soft mb-10 leading-relaxed">
        Not the hours on your timesheet. All of them. The drive, the prep, the
        "just one more email" at 9pm.
      </p>

      <Field label="Official hours per week">
        <NumberInput
          value={inputs.officialHoursPerWeek}
          onChange={(n) => update('officialHoursPerWeek', n)}
          suffix="hrs"
        />
      </Field>

      <Field label="Days per week you work">
        <NumberInput
          value={inputs.daysPerWeek}
          onChange={(n) => update('daysPerWeek', n)}
          suffix="days"
        />
      </Field>

      <Field
        label="Unpaid overtime per week"
        hint="Evenings, weekends, 'catching up.' Be honest."
      >
        <NumberInput
          value={inputs.overtimeHoursPerWeek}
          onChange={(n) => update('overtimeHoursPerWeek', n)}
          suffix="hrs"
        />
      </Field>

      <Field label="Commute, one way" hint="Door to desk. Walking from the parking lot counts.">
        <NumberInput
          value={inputs.commuteMinutesOneWay}
          onChange={(n) => update('commuteMinutesOneWay', n)}
          suffix="min"
        />
      </Field>

      <Field
        label="Getting ready, per day"
        hint="Time you spend each workday you wouldn't spend on a day off."
      >
        <NumberInput
          value={inputs.prepMinutesPerDay}
          onChange={(n) => update('prepMinutesPerDay', n)}
          suffix="min"
        />
      </Field>

      <StepNav onBack={onBack} onNext={onNext} nextLabel="Next: the money &rarr;" />
    </div>
  );
}

function MoneyStep({
  inputs,
  update,
  onNext,
  onBack,
}: {
  inputs: WageInputs;
  update: <K extends keyof WageInputs>(key: K, value: WageInputs[K]) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 md:py-24">
      <StepHeader n={3} total={3} title="What the job costs you in money" />

      <p className="text-lg text-ink-soft mb-10 leading-relaxed">
        Only things you spend <em>because</em> you have this job. If you'd buy
        fancy coffee whether you worked or not, skip that one.
      </p>

      <Field label="Commute cost per week" hint="Gas, tolls, transit, parking. All in.">
        <NumberInput
          value={inputs.commuteCostPerWeek}
          onChange={(n) => update('commuteCostPerWeek', n)}
          prefix="$"
          suffix="/ week"
        />
      </Field>

      <div className="grid grid-cols-2 gap-6">
        <Field label="Work lunches per week">
          <NumberInput
            value={inputs.lunchesPerWeek}
            onChange={(n) => update('lunchesPerWeek', n)}
            suffix="lunches"
          />
        </Field>
        <Field label="Avg. cost each">
          <NumberInput
            value={inputs.avgLunchCost}
            onChange={(n) => update('avgLunchCost', n)}
            prefix="$"
          />
        </Field>
      </div>

      <Field
        label="Coffee, snacks, after-work drinks per week"
        hint="The $6 latte every morning. The team drinks on Thursday."
      >
        <NumberInput
          value={inputs.coffeeSnacksPerWeek}
          onChange={(n) => update('coffeeSnacksPerWeek', n)}
          prefix="$"
          suffix="/ week"
        />
      </Field>

      <Field
        label="Work clothing & dry cleaning per month"
        hint="Things you wouldn't own if you worked from home in pajamas."
      >
        <NumberInput
          value={inputs.workClothingPerMonth}
          onChange={(n) => update('workClothingPerMonth', n)}
          prefix="$"
          suffix="/ month"
        />
      </Field>

      <Field
        label="Childcare per month"
        hint="Only the portion that exists because you work. Zero if it doesn't apply."
      >
        <NumberInput
          value={inputs.childcarePerMonth}
          onChange={(n) => update('childcarePerMonth', n)}
          prefix="$"
          suffix="/ month"
        />
      </Field>

      <StepNav onBack={onBack} onNext={onNext} nextLabel="Reveal the number &rarr;" primary />
    </div>
  );
}

function StepNav({
  onBack,
  onNext,
  nextLabel,
  primary,
}: {
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
  primary?: boolean;
}) {
  return (
    <div className="flex items-center justify-between mt-12 pt-8 border-t border-ink/10">
      <button onClick={onBack} className="font-body text-mute hover:text-ink transition-colors">
        &larr; Back
      </button>
      <button onClick={onNext} className={primary ? 'btn-primary' : 'btn-secondary'}>
        {nextLabel}
      </button>
    </div>
  );
}

/* ============ RESULT ============ */

function Result({
  result,
  inputs,
  onRestart,
  onEdit,
}: {
  result: ReturnType<typeof calculateWage>;
  inputs: WageInputs;
  onRestart: () => void;
  onEdit: () => void;
}) {
  const [purchaseName, setPurchaseName] = useState('');
  const [purchaseCost, setPurchaseCost] = useState<number>(0);

  const purchaseTranslation = useMemo(
    () => (purchaseCost > 0 ? translateCost(purchaseCost, result.realHourlyWage) : null),
    [purchaseCost, result.realHourlyWage]
  );

  const copyShareText = () => {
    const text = `I thought I made ${formatCurrencyPrecise(result.naiveHourlyWage)}/hr. My real hourly wage is ${formatCurrencyPrecise(result.realHourlyWage)}. Find yours: whatsmytimeworth.com`;
    navigator.clipboard?.writeText(text);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
      {/* HEADLINE NUMBER */}
      <div className="mb-20">
        <p className="reveal font-mono text-xs uppercase tracking-widest text-mute mb-4">
          Your real hourly wage
        </p>

        <div className="number-reveal">
          <div className="flex items-baseline flex-wrap gap-x-6 gap-y-2 mb-4">
            <span className="font-display font-light text-7xl md:text-9xl tracking-tightest text-blood tabular">
              {formatCurrencyPrecise(result.realHourlyWage)}
            </span>
            <span className="font-display italic text-2xl md:text-3xl text-mute">
              per hour
            </span>
          </div>
        </div>

        <p className="reveal reveal-delay-2 font-display text-xl md:text-2xl text-ink-soft mt-6 leading-snug">
          You thought it was{' '}
          <span className="tabular font-medium text-ink">
            {formatCurrencyPrecise(result.naiveHourlyWage)}
          </span>
          . That's a{' '}
          <span className="font-medium text-blood">
            {formatNumber(result.percentDrop, 0)}% cut
          </span>{' '}
          reality just took.
        </p>
      </div>

      {/* THE BREAKDOWN */}
      <section className="reveal reveal-delay-3 mb-20 border-t border-ink/10 pt-12">
        <h2 className="font-display font-light text-3xl md:text-4xl mb-10 tracking-tightest">
          Where it went
        </h2>

        <div className="grid md:grid-cols-2 gap-x-16 gap-y-10">
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-mute mb-4">
              Money side
            </h3>
            <div className="space-y-3 font-body text-lg">
              <LineItem label="Gross salary" value={formatCurrency(result.grossAnnual)} />
              <LineItem
                label="Federal tax"
                value={`− ${formatCurrency(result.breakdown.taxes.federal)}`}
                sub
              />
              <LineItem
                label="FICA (SS + Medicare)"
                value={`− ${formatCurrency(result.breakdown.taxes.fica)}`}
                sub
              />
              <LineItem
                label="State tax"
                value={`− ${formatCurrency(result.breakdown.taxes.state)}`}
                sub
              />
              <div className="border-t border-ink/10 pt-3">
                <LineItem label="Take-home pay" value={formatCurrency(result.netAnnual)} bold />
              </div>
              {result.breakdown.jobCosts.commute > 0 && (
                <LineItem
                  label="Commute costs"
                  value={`− ${formatCurrency(result.breakdown.jobCosts.commute)}`}
                  sub
                />
              )}
              {result.breakdown.jobCosts.lunches > 0 && (
                <LineItem
                  label="Work lunches"
                  value={`− ${formatCurrency(result.breakdown.jobCosts.lunches)}`}
                  sub
                />
              )}
              {result.breakdown.jobCosts.coffeeSnacks > 0 && (
                <LineItem
                  label="Coffee / snacks / drinks"
                  value={`− ${formatCurrency(result.breakdown.jobCosts.coffeeSnacks)}`}
                  sub
                />
              )}
              {result.breakdown.jobCosts.clothing > 0 && (
                <LineItem
                  label="Work clothing"
                  value={`− ${formatCurrency(result.breakdown.jobCosts.clothing)}`}
                  sub
                />
              )}
              {result.breakdown.jobCosts.childcare > 0 && (
                <LineItem
                  label="Job-enabling childcare"
                  value={`− ${formatCurrency(result.breakdown.jobCosts.childcare)}`}
                  sub
                />
              )}
              <div className="border-t-2 border-ink pt-3 mt-3">
                <LineItem
                  label="What's actually yours"
                  value={formatCurrency(result.takeHomeAnnual)}
                  bold
                  highlight
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-mute mb-4">
              Time side
            </h3>
            <div className="space-y-3 font-body text-lg">
              <LineItem
                label="Official hours / week"
                value={`${formatNumber(result.workHoursPerWeek, 0)} hrs`}
              />
              {result.breakdown.hiddenTime.overtime > 0 && (
                <LineItem
                  label="Unpaid overtime"
                  value={`+ ${formatNumber(result.breakdown.hiddenTime.overtime, 1)} hrs`}
                  sub
                />
              )}
              {result.breakdown.hiddenTime.commute > 0 && (
                <LineItem
                  label="Commute"
                  value={`+ ${formatNumber(result.breakdown.hiddenTime.commute, 1)} hrs`}
                  sub
                />
              )}
              {result.breakdown.hiddenTime.prep > 0 && (
                <LineItem
                  label="Getting ready"
                  value={`+ ${formatNumber(result.breakdown.hiddenTime.prep, 1)} hrs`}
                  sub
                />
              )}
              <div className="border-t-2 border-ink pt-3 mt-3">
                <LineItem
                  label="Your real work week"
                  value={`${formatNumber(result.totalHoursPerWeek, 1)} hrs`}
                  bold
                  highlight
                />
              </div>
              <p className="text-sm text-mute italic pt-4">
                That's {formatNumber(result.hiddenHoursPerWeek, 1)} hours every
                week you're working and no one's paying you for it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TRANSLATIONS */}
      <section className="reveal reveal-delay-4 mb-20 border-t border-ink/10 pt-12">
        <h2 className="font-display font-light text-3xl md:text-4xl mb-4 tracking-tightest">
          What things <em className="text-blood">really</em> cost you
        </h2>
        <p className="font-body text-lg text-ink-soft mb-10">
          At {formatCurrencyPrecise(result.realHourlyWage)} an hour, this is
          what you're actually trading.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {PREBAKED_ITEMS.map((item) => {
            const t = translateCost(item.cost, result.realHourlyWage);
            if (!t) return null;
            return (
              <div
                key={item.label}
                className="border border-ink/15 p-6 bg-cream/60 backdrop-blur-sm"
              >
                <p className="font-mono text-xs uppercase tracking-widest text-mute mb-2">
                  {item.label}
                </p>
                <p className="font-display text-2xl mb-1 tabular">
                  {formatCurrency(item.cost)}
                </p>
                <p className="font-display italic text-xl text-blood tabular">
                  = {formatNumber(t.primary.value, t.primary.value < 10 ? 1 : 0)}{' '}
                  {t.primary.unit}
                </p>
                <p className="text-sm text-mute mt-2">{item.note}</p>
              </div>
            );
          })}
        </div>

        {/* Custom lookup */}
        <div className="bg-ink text-cream p-8 md:p-12 border-l-4 border-blood">
          <h3 className="font-display font-light text-2xl md:text-3xl mb-6 tracking-tightest">
            Thinking of buying something?
          </h3>
          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="font-mono text-xs uppercase tracking-widest text-cream/60 mb-2 block">
                What is it?
              </label>
              <input
                type="text"
                value={purchaseName}
                onChange={(e) => setPurchaseName(e.target.value)}
                placeholder="A new couch"
                className="w-full bg-transparent border-b-2 border-cream/30 py-2 text-cream text-xl font-mono placeholder:text-cream/40 focus:outline-none focus:border-cream"
              />
            </div>
            <div>
              <label className="font-mono text-xs uppercase tracking-widest text-cream/60 mb-2 block">
                What does it cost?
              </label>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xl text-cream/60">$</span>
                <input
                  type="number"
                  inputMode="decimal"
                  value={purchaseCost === 0 ? '' : purchaseCost}
                  onChange={(e) => setPurchaseCost(parseFloat(e.target.value) || 0)}
                  placeholder="1800"
                  className="flex-1 bg-transparent border-b-2 border-cream/30 py-2 text-cream text-xl font-mono placeholder:text-cream/40 focus:outline-none focus:border-cream"
                />
              </div>
            </div>
          </div>

          {purchaseTranslation && purchaseCost > 0 && (
            <div className="mt-8 pt-8 border-t border-cream/15">
              <p className="font-display text-2xl md:text-3xl leading-snug tracking-tightest">
                {purchaseName ? `That ${purchaseName.toLowerCase()}` : 'That purchase'}{' '}
                costs you{' '}
                <span className="text-gold-light tabular">
                  {formatNumber(
                    purchaseTranslation.primary.value,
                    purchaseTranslation.primary.value < 10 ? 1 : 0
                  )}{' '}
                  {purchaseTranslation.primary.unit}
                </span>{' '}
                of your life.
              </p>
              <p className="font-body text-cream/60 mt-4 font-mono text-sm">
                {formatNumber(purchaseTranslation.hours, 1)} hours ·{' '}
                {formatNumber(purchaseTranslation.workDays, 1)} work days ·{' '}
                {formatNumber(purchaseTranslation.workWeeks, 2)} work weeks
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ACTIONS */}
      <section className="reveal reveal-delay-5 border-t border-ink/10 pt-12">
        <div className="flex flex-wrap gap-4 items-center">
          <button onClick={copyShareText} className="btn-primary">
            Copy & share
          </button>
          <button onClick={onEdit} className="btn-secondary">
            Edit inputs
          </button>
          <button
            onClick={onRestart}
            className="font-body text-mute hover:text-ink transition-colors"
          >
            Start over
          </button>
        </div>

        <p className="mt-10 font-body text-sm text-mute italic max-w-2xl leading-relaxed">
          The math uses 2025 US federal tax brackets, state top marginal rates,
          and FICA. Everything else is what you entered.{' '}
          <a href="/methodology" className="underline decoration-blood decoration-2 underline-offset-4 hover:text-ink">
            See how we calculated this.
          </a>
        </p>
      </section>
    </div>
  );
}

function LineItem({
  label,
  value,
  sub,
  bold,
  highlight,
}: {
  label: string;
  value: string;
  sub?: boolean;
  bold?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex justify-between items-baseline gap-4 ${
        sub ? 'pl-6 text-mute text-base' : ''
      }`}
    >
      <span className={bold ? 'font-display' : ''}>{label}</span>
      <span
        className={`tabular ${
          highlight ? 'font-display text-blood text-xl' : bold ? 'font-medium' : ''
        }`}
      >
        {value}
      </span>
    </div>
  );
}

const PREBAKED_ITEMS = [
  { label: 'A fancy coffee', cost: 6.5, note: 'Every morning adds up.' },
  { label: 'Dinner for two out', cost: 80, note: 'Tip included, wine extra.' },
  { label: 'A PS5', cost: 500, note: 'Or an XBox. No judgment.' },
  { label: 'AirPods Pro', cost: 250, note: 'The nice ones with ANC.' },
  { label: 'A weekend in Miami', cost: 1200, note: 'Flight, hotel, food.' },
  { label: 'A used Honda Civic', cost: 18000, note: 'Clean title, 60k miles.' },
];
