// Catalog of items for the "what does this cost you" section.
// Categorized to support tabbed browsing.
// Dollar figures use mid-range US 2025 estimates.

export interface CatalogItem {
  label: string;
  cost: number;
  note: string;
  // Special items compute cost from user state; flag with a key the component handles
  computed?: 'annualSalary' | 'remainingCareer';
}

export interface CatalogCategory {
  id: string;
  title: string;
  subtitle: string;
  items: CatalogItem[];
}

export const CATALOG: CatalogCategory[] = [
  {
    id: 'everyday',
    title: 'Everyday',
    subtitle: 'The small leaks that never stop.',
    items: [
      { label: 'Fancy coffee', cost: 6.5, note: 'Every morning adds up.' },
      { label: 'Lunch out', cost: 18, note: 'The "quick Chipotle" that isn\'t quick.' },
      { label: 'Streaming bundle, one month', cost: 40, note: 'Netflix + Spotify + whatever else.' },
      { label: 'A haircut', cost: 45, note: 'Or $180 if your hair has "a lot going on."' },
      { label: 'A paperback', cost: 18, note: 'The cheapest thing here. Also the most worth it.' },
      { label: 'Uber to the airport', cost: 65, note: 'One way, no surge.' },
      { label: 'A month of gym', cost: 55, note: 'You\'ll go twice.' },
    ],
  },
  {
    id: 'nice',
    title: 'Nice things',
    subtitle: 'Attainable. Probably in the cart already.',
    items: [
      { label: 'Dinner for two', cost: 95, note: 'Wine, tip, the works.' },
      { label: 'AirPods Pro', cost: 249, note: 'The ones with noise cancelling.' },
      { label: 'A PS5', cost: 500, note: 'Or Xbox. No judgment.' },
      { label: 'Concert tickets', cost: 180, note: 'Pair, decent seats, before fees.' },
      { label: 'A decent mechanical watch', cost: 1200, note: 'Not a Rolex. Not yet.' },
      { label: 'A mid-range road bike', cost: 2500, note: 'Carbon, light as a rumor.' },
      { label: 'A Peloton', cost: 1445, note: 'Plus $44/month. Plus guilt.' },
    ],
  },
  {
    id: 'tech',
    title: 'Tech',
    subtitle: 'It will be obsolete before you finish paying for it.',
    items: [
      { label: 'ChatGPT Plus, one year', cost: 240, note: 'Cheaper than therapy, worse at it.' },
      { label: 'A new iPhone', cost: 999, note: 'Base model. Pro is another 300 hours.' },
      { label: 'A MacBook Pro', cost: 2499, note: 'The one you\'ll tell yourself is "for work."' },
      { label: 'An RTX 5090', cost: 1999, note: 'For gaming. Sure. Sure.' },
      { label: 'A Meta Quest 3', cost: 500, note: 'Solitude, now immersive.' },
      { label: 'An e-bike', cost: 1800, note: 'Replaces your car, possibly.' },
    ],
  },
  {
    id: 'trips',
    title: 'Trips',
    subtitle: 'Memories at X dollars an hour.',
    items: [
      { label: 'Weekend in Miami', cost: 1200, note: 'Flights, hotel, two dinners.' },
      { label: 'Week in Mexico', cost: 2800, note: 'All-in, nothing fancy.' },
      { label: 'Two weeks in Japan', cost: 6500, note: 'You\'ll earn it back in stories.' },
      { label: 'Safari in Kenya', cost: 9500, note: 'Ten days, mid-range lodges.' },
      { label: 'A European honeymoon', cost: 12000, note: 'Three cities, no regrets.' },
      { label: 'A year of median US rent', cost: 21600, note: 'Your landlord\'s Tesla thanks you.' },
    ],
  },
  {
    id: 'big-moves',
    title: 'Big moves',
    subtitle: 'The decisions you think about for a year, then make in an afternoon.',
    items: [
      { label: 'Starter-home down payment (10% on $350k)', cost: 35000, note: 'One decision. A lot of hours.' },
      { label: 'Average US wedding', cost: 33000, note: '"We\'re keeping it small," you said.' },
      { label: 'A used Honda Civic', cost: 18000, note: 'Clean title, 60k miles, no drama.' },
      { label: 'A new mid-size SUV', cost: 42000, note: 'Cup holders for every passenger.' },
      { label: 'One year of daycare', cost: 15600, note: 'For one kid. One.' },
      { label: 'Year at a state university', cost: 28000, note: 'Tuition + room + board.' },
      { label: 'A full kitchen remodel', cost: 55000, note: 'Mid-range. Quartz counters. New cabinets.' },
    ],
  },
  {
    id: 'big-numbers',
    title: 'The big numbers',
    subtitle: 'The ones that keep you awake.',
    items: [
      { label: 'One full year of your salary', cost: 0, note: 'What you make, in the hours it takes.', computed: 'annualSalary' },
      { label: 'Retiring at 55 ($1.5M)', cost: 1500000, note: 'Roughly. Your mileage will vary.' },
      { label: 'Retiring at 65 ($900k)', cost: 900000, note: 'The more forgiving version.' },
      { label: 'A paid-off $500k mortgage', cost: 500000, note: 'Principal only. Interest not included. Yet.' },
      { label: 'Putting one kid through college', cost: 120000, note: 'In-state, public, four years.' },
    ],
  },
  {
    id: 'fun',
    title: 'Just for fun',
    subtitle: 'For the group chat.',
    items: [
      { label: 'A Taylor Swift Eras Tour ticket (face value)', cost: 450, note: 'Resale is another story.' },
      { label: 'A round of beers for the bar', cost: 85, note: 'Twelve people. Tip included. Hero status.' },
      { label: 'A single Cybertruck', cost: 80000, note: 'For the aesthetic, allegedly.' },
      { label: 'The cheapest private jet flight', cost: 3500, note: 'New York to Boston, one way.' },
      { label: 'A single Birkin bag', cost: 25000, note: 'Waitlist extra.' },
      { label: 'An NFL season ticket', cost: 2800, note: 'Nosebleeds, one team, one season.' },
      { label: 'A year of premium cable', cost: 2400, note: 'Why.' },
      { label: 'The Stanley Cup, replica', cost: 1200, note: 'The hockey one. Obviously.' },
    ],
  },
];
