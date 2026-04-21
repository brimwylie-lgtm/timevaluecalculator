// FAQ content for the homepage.
//
// Two answer fields per item:
//   - `answer`        : plain text only.  Used in JSON-LD FAQPage schema.
//                       Schema doesn't render HTML, so any tags here would
//                       leak into Google's structured-data validator as
//                       literal characters.  Keep it clean prose.
//   - `linkedAnswer`  : optional HTML version with inline links.  Used in
//                       the visible page render via `set:html`.  Falls back
//                       to `answer` when omitted.
//
// When updating an answer, update BOTH fields (or only `answer` if the
// answer is short and links aren't needed).  The two should always be
// substantively the same content — just one with links and one without.

export interface FaqItem {
  question: string;
  answer: string;
  linkedAnswer?: string;
}

export const HOMEPAGE_FAQS: FaqItem[] = [
  {
    question: 'What is a "real hourly wage"?',
    answer:
      'Your real hourly wage is what you actually take home per hour of your life that work consumes, after federal and state taxes, commute costs, work lunches, coffee, work clothes, and childcare — divided by all the hours work actually takes, including commute, prep time, and unpaid overtime. The concept comes from the 1992 book Your Money or Your Life by Vicki Robin and Joe Dominguez. It is almost always dramatically lower than the hourly rate implied by your salary.',
    linkedAnswer:
      'Your real hourly wage is what you actually take home per hour of your life that work consumes, after federal and state taxes, commute costs, work lunches, coffee, work clothes, and childcare &mdash; divided by all the hours work actually takes, including commute, prep time, and unpaid overtime. The concept comes from the 1992 book <a href="https://vickirobin.com/your-money-or-your-life/" target="_blank" rel="noopener noreferrer" class="underline decoration-blood/40 decoration-2 underline-offset-4 hover:decoration-blood hover:text-ink"><em>Your Money or Your Life</em></a> by Vicki Robin and Joe Dominguez. It is almost always dramatically lower than the hourly rate implied by your salary. See the <a href="/methodology" class="underline decoration-blood/40 decoration-2 underline-offset-4 hover:decoration-blood hover:text-ink">full methodology</a> for the exact formula.',
  },
  {
    question: 'How is this different from a salary-to-hourly or take-home pay calculator?',
    answer:
      'A standard take-home pay calculator stops at after-tax income divided by 40 hours a week, 52 weeks a year. This calculator goes further. It subtracts the hidden costs of working — money you spend because you have the job — and adds the hidden hours the job consumes. A commute you do not get paid for is still time the job takes. A $15 lunch you only eat because you are at the office is still money the job costs you. Most hourly wage calculators ignore these. This one does not.',
  },
  {
    question: 'Does this work for salaried employees, hourly workers, or both?',
    answer:
      'Both. If you earn a salary, we convert it to an implied hourly rate based on your official weekly hours, then adjust for taxes and hidden costs. If you are paid hourly, enter your average annual earnings and actual hours. The math is the same: what you actually keep per hour of your life that work takes.',
  },
  {
    question: 'Why is my real hourly wage lower than my salary would suggest?',
    answer:
      'Three reasons. Taxes: federal, state, and FICA take a meaningful cut, even at modest incomes. Hidden work hours: a 40-hour work week often becomes a 50+ hour real work week once you add commute, getting-ready time, and unpaid overtime. Job-related spending: commute costs, work lunches, coffee, professional clothing, and childcare are costs that exist because of the job. Subtract them from take-home pay and divide by the real hours, and the number drops — often 30 to 50 percent below the number on your offer letter.',
    linkedAnswer:
      'Three reasons. Taxes: federal, state, and FICA take a meaningful cut, even at modest incomes. Hidden work hours: a 40-hour work week often becomes a 50+ hour real work week once you add commute, getting-ready time, and unpaid overtime. Job-related spending: commute costs, work lunches, coffee, professional clothing, and childcare are costs that exist because of the job. Subtract them from take-home pay and divide by the real hours, and the number drops &mdash; often 30 to 50 percent below the number on your offer letter. The <a href="/methodology" class="underline decoration-blood/40 decoration-2 underline-offset-4 hover:decoration-blood hover:text-ink">methodology page</a> shows exactly which numbers are deducted and which are deliberately left out.',
  },
  {
    question: 'Can this tell me what I can really afford on my salary?',
    answer:
      'Yes, indirectly. Most affordability questions assume your take-home pay is what you have to spend. But if you subtract the money you only spend because you work — and count the real hours — you get a more honest picture of what a purchase, rent, or lifestyle change actually costs you in life-hours. The catalog on the results page translates common purchases, from coffee to a down payment, into hours of your actual life at your real wage.',
  },
  {
    question: 'Is this tool based on Your Money or Your Life?',
    answer:
      'The underlying concept comes from that book, yes. Vicki Robin and Joe Dominguez introduced the "real hourly wage" calculation in 1992 and it remains the clearest way to measure what your time is actually worth. This tool implements the math with modern US tax data and a purchase-translation feature. We have no affiliation with the book, the authors, or the FI/FIRE movement that grew out of it.',
    linkedAnswer:
      'The underlying concept comes from that book, yes. Vicki Robin and Joe Dominguez introduced the "real hourly wage" calculation in 1992 and it remains the clearest way to measure what your time is actually worth. This tool implements the math with modern US tax data and a purchase-translation feature. We have no affiliation with <a href="https://vickirobin.com/your-money-or-your-life/" target="_blank" rel="noopener noreferrer" class="underline decoration-blood/40 decoration-2 underline-offset-4 hover:decoration-blood hover:text-ink">the book</a>, the authors, or the FI/FIRE movement that grew out of it.',
  },
  {
    question: 'Is my data saved anywhere?',
    answer:
      'No. Every calculation runs in your browser. Nothing is sent to a server, stored in a database, or associated with you. Close the tab and the numbers are gone. There is no account, no email signup, and no cookies that track you.',
    linkedAnswer:
      'No. Every calculation runs in your browser. Nothing is sent to a server, stored in a database, or associated with you. Close the tab and the numbers are gone. There is no account, no email signup, and no cookies that track you. The full data-handling story is in the <a href="/privacy" class="underline decoration-blood/40 decoration-2 underline-offset-4 hover:decoration-blood hover:text-ink">privacy policy</a>.',
  },
  {
    question: 'How accurate is the tax calculation?',
    answer:
      'Accurate enough to make the point, but not a tax filing. We use 2025 federal brackets, the standard deduction, FICA at statutory rates including the additional Medicare surcharge, and a flat top-marginal state tax rate by state. We do not model itemized deductions, 401(k) contributions, HSAs, tax credits, or local and city taxes. For an exact withholding calculation, use your state tax authority or a CPA. For a directional sense of your real hourly wage, this tool is close.',
    linkedAnswer:
      'Accurate enough to make the point, but not a tax filing. We use 2025 federal brackets, the standard deduction, FICA at statutory rates including the additional Medicare surcharge, and a flat top-marginal state tax rate by state. We do not model itemized deductions, 401(k) contributions, HSAs, tax credits, or local and city taxes. For an exact withholding calculation, use your state tax authority or a CPA. For a directional sense of your real hourly wage, this tool is close. Full <a href="/methodology" class="underline decoration-blood/40 decoration-2 underline-offset-4 hover:decoration-blood hover:text-ink">tax calculation methodology</a> is documented separately.',
  },
];
