export const GENRES = [
  { id: "romance", label: "Romance" },
  { id: "horror", label: "Horror" },
  { id: "comedy", label: "Comedy" },
  { id: "thriller", label: "Thriller" },
];

export const MAX_GENRES = 2;
export const FREE_EPISODES = 1; // episodes playable without a trial
export const TRIAL_PRICE = 1; // USD, charged today
export const PLAN_PRICE = 7.99; // USD per quarter after the trial

/** money(1) -> "$1", money(1, true) -> "$1.00", money(7.99) -> "$7.99" */
export function money(n, fixed = false) {
  return "$" + (fixed || !Number.isInteger(n) ? n.toFixed(2) : String(n));
}

/**
 * font: which display face the poster/clip title uses (script | serif | marker | display)
 * colors: [top, bottom, accent]
 */
export const DRAMAS = [
  {
    id: "dont-stay-buried",
    title: "Don't Stay Buried",
    genres: ["horror", "thriller"],
    tag: "Trending",
    eps: 42, mins: 1.5, rating: 4.8, views: "3.1M",
    font: "marker",
    colors: ["#0b1a1c", "#050505", "#e11d2e"],
    hook: "Some secrets",
    tagline: "Every clue leads deeper",
    blurb: "A journalist returns to her childhood home to find a wall of polaroids of people who vanished. The last photo is of her.",
    captions: ["“Nobody came back from that basement.”", "“Then why is my name on the wall?”", "“Don't open it. Not tonight.”"],
  },
  {
    id: "atm-pati",
    title: "ATM Pati",
    genres: ["comedy", "romance"],
    tag: "New",
    eps: 36, mins: 1.2, rating: 4.5, views: "2.4M",
    font: "display",
    colors: ["#1d4ed8", "#0b1230", "#facc15"],
    hook: "Shaadi ka budget",
    tagline: "Withdraw. Repeat. Regret.",
    blurb: "Meera marries a man who, it turns out, treats every relationship as a cash withdrawal. She decides to change his PIN.",
    captions: ["“Limit khatam? Pati ka limit kabhi khatam nahi hota.”", "“Mummy, he asked for my OTP again.”", "“Balance enquiry: zero self-respect.”"],
  },
  {
    id: "operation-badla",
    title: "Operation Badla",
    genres: ["thriller"],
    tag: "Trending",
    eps: 48, mins: 1.6, rating: 4.7, views: "4.0M",
    font: "display",
    colors: ["#3b0a12", "#0a0507", "#f97316"],
    hook: "Revenge is a plan",
    tagline: "Nine names. One list.",
    blurb: "After her brother's cover-up, a quiet bank clerk starts crossing names off a list — one Monday at a time.",
    captions: ["“Number three is in Conference Room B.”", "“You should have stayed quiet, Rohan.”", "“Badla dhoop mein sookhta hai.”"],
  },
  {
    id: "adulting-sort-of",
    title: "Adulting (sort of)",
    genres: ["comedy", "romance"],
    tag: "New",
    eps: 30, mins: 1.3, rating: 4.4, views: "1.8M",
    font: "script",
    colors: ["#f9a8b8", "#7c3a5a", "#fff1c2"],
    hook: "Rent is due",
    tagline: "Twenty-six and winging it",
    blurb: "Ira has a laptop, a landlord and a very loud flatmate. She does not have a plan. Neither does the guy in 4B.",
    captions: ["“I have a spreadsheet for feelings now.”", "“That's the fridge, not a filing cabinet.”", "“We're not dating, we're co-living.”"],
  },
  {
    id: "next-door",
    title: "Next Door",
    genres: ["romance"],
    tag: null,
    eps: 28, mins: 1.4, rating: 4.3, views: "1.2M",
    font: "script",
    colors: ["#c9a56b", "#2a1a0c", "#fde68a"],
    hook: "Thin walls",
    tagline: "He hears everything",
    blurb: "Two neighbours, one shared wall and a wrong-number text that turns into the best part of their day.",
    captions: ["“Your alarm is my alarm now.”", "“Stop humming. It's beautiful. Stop.”", "“Knock twice if you're okay.”"],
  },
  {
    id: "pieces-of-us",
    title: "Pieces of Us",
    genres: ["romance", "thriller"],
    tag: null,
    eps: 34, mins: 1.5, rating: 4.6, views: "2.0M",
    font: "serif",
    colors: ["#374151", "#0a0a0c", "#e5e7eb"],
    hook: "Before the accident",
    tagline: "She remembers him wrong",
    blurb: "After an accident, Anaya remembers her husband as a stranger. His photos say otherwise, and someone is deleting them.",
    captions: ["“You've been in every photo but one.”", "“Who took the last picture?”", "“I don't remember loving you.”"],
  },
  {
    id: "still-me",
    title: "Still Me",
    genres: ["romance"],
    tag: null,
    eps: 26, mins: 1.3, rating: 4.2, views: "980K",
    font: "script",
    colors: ["#5b4a3a", "#140d09", "#fcd9b6"],
    hook: "Second chances",
    tagline: "Same city. New people.",
    blurb: "Five years after the breakup, Kabir moves back to Pune and finds her café two streets from his office.",
    captions: ["“You still order it with extra sugar.”", "“I changed. Mostly.”", "“Tell me you're not still mine.”"],
  },
  {
    id: "billionaires-mistake",
    title: "The Billionaire's Mistake",
    genres: ["romance"],
    tag: "Trending",
    eps: 55, mins: 1.7, rating: 4.9, views: "6.2M",
    font: "serif",
    colors: ["#7f1d1d", "#160607", "#fecaca"],
    hook: "One wrong email",
    tagline: "He hired the wrong twin",
    blurb: "A CEO sends a contract to the wrong Sharma sister. She signs it, and now they're married for ninety days.",
    captions: ["“Clause nine says you can't fall in love.”", "“Then delete clause nine, Mr. Khanna.”", "“I don't lose. I especially don't lose you.”"],
  },
  {
    id: "the-last-text",
    title: "The Last Text",
    genres: ["thriller"],
    tag: null,
    eps: 32, mins: 1.4, rating: 4.4, views: "1.5M",
    font: "display",
    colors: ["#0f172a", "#020617", "#38bdf8"],
    hook: "Delivered 2:14 AM",
    tagline: "Read receipts don't lie",
    blurb: "Her sister's last text arrives eleven days after the funeral. Then the phone starts typing again.",
    captions: ["“Typing…”", "“Don't trust the police, Diya.”", "“I'm not dead. Look behind you.”"],
  },
  {
    id: "the-turning-point",
    title: "The Turning Point",
    genres: ["thriller", "romance"],
    tag: null,
    eps: 40, mins: 1.5, rating: 4.3, views: "1.1M",
    font: "serif",
    colors: ["#44403c", "#0c0a09", "#fbbf24"],
    hook: "Ten minutes earlier",
    tagline: "One decision. Two lives.",
    blurb: "A missed train splits one evening into two timelines. In both, someone doesn't come home.",
    captions: ["“If I'd caught it, he'd be alive.”", "“If you hadn't, I would be.”", "“Which version are you?”"],
  },
  {
    id: "shaadi-side-effect",
    title: "Shaadi Ka Side Effect",
    genres: ["comedy", "romance"],
    tag: "New",
    eps: 24, mins: 1.2, rating: 4.1, views: "870K",
    font: "display",
    colors: ["#db2777", "#3b0764", "#fde047"],
    hook: "Sangeet gone wrong",
    tagline: "Two families. Zero filters.",
    blurb: "Three days, two families and one DJ who will not stop playing the same song. The wedding is happening whether they like it or not.",
    captions: ["“Bua ji ne mic le liya hai.”", "“Who invited the ex?”", "“Haldi is not a personality.”"],
  },
  {
    id: "midnight-haveli",
    title: "Midnight Haveli",
    genres: ["horror"],
    tag: null,
    eps: 30, mins: 1.5, rating: 4.5, views: "2.2M",
    font: "marker",
    colors: ["#1f1d0b", "#050503", "#f59e0b"],
    hook: "Check-in after dark",
    tagline: "The guests never leave",
    blurb: "A heritage hotel offers one free night to influencers. By the third floor, the bookings start writing themselves.",
    captions: ["“Room 12 is not on the map.”", "“Why is the lift going up?”", "“Nobody checks out of Midnight Haveli.”"],
  },
  {
    id: "chai-break",
    title: "Chai Break Confessions",
    genres: ["comedy"],
    tag: null,
    eps: 22, mins: 1.1, rating: 4.2, views: "1.4M",
    font: "display",
    colors: ["#b45309", "#2b1103", "#fef3c7"],
    hook: "Cutting chai, full gossip",
    tagline: "Office politics, served hot",
    blurb: "Four colleagues, one pantry, and a group chat that no one should have named 'Confidential'.",
    captions: ["“Who added HR to the group?”", "“Promotion nahi, sirf gossip mila.”", "“Delete for everyone. DELETE FOR EVERYONE.”"],
  },
  {
    id: "mrs-ceo",
    title: "Mrs. CEO Undercover",
    genres: ["romance", "comedy"],
    tag: null,
    eps: 38, mins: 1.4, rating: 4.4, views: "1.9M",
    font: "serif",
    colors: ["#6d28d9", "#1e0a3c", "#f5d0fe"],
    hook: "Day one as an intern",
    tagline: "The boss is in the pantry",
    blurb: "The CEO takes an intern badge to find out who is leaking her numbers. She did not expect to like the guy who makes her tea.",
    captions: ["“Intern, the CEO wants this yesterday.”", "“She sounds… demanding.”", "“Do I look like someone who needs coffee?”"],
  },
  {
    id: "room-404",
    title: "Room 404",
    genres: ["horror", "thriller"],
    tag: "New",
    eps: 20, mins: 1.3, rating: 4.3, views: "1.0M",
    font: "display",
    colors: ["#111827", "#020203", "#22c55e"],
    hook: "Page not found",
    tagline: "Some doors don't exist",
    blurb: "A hostel has rooms 401, 402, 403 and 405. Every year, one student wakes up inside the one that isn't there.",
    captions: ["“There's no fourth floor, bhai.”", "“Then why is the key warm?”", "“Room 404: not found.”"],
  },
];

// Order in which we pick preview clips: lead with the most gripping genre
const GENRE_PRIORITY = ["horror", "thriller", "romance", "comedy"];

/** Two preview clips for the swipe feed, based on chosen genres. */
export function pickPreviewClips(selected) {
  const chosen = GENRE_PRIORITY.filter((g) => selected.includes(g));
  const picks = [];
  const take = (genre) => {
    const d = DRAMAS.find((x) => x.genres.includes(genre) && !picks.includes(x));
    if (d) picks.push(d);
  };
  chosen.forEach(take);
  if (picks.length < 2 && chosen[0]) take(chosen[0]);
  DRAMAS.forEach((d) => picks.length < 2 && !picks.includes(d) && picks.push(d));
  return picks.slice(0, 2);
}

const EP_NAMES = ["The Meeting", "The Message", "The Secret", "The Twist", "The Fallout", "The Deal", "The Truth", "The Finale"];
export function episodeList(drama, limit = 8) {
  const n = Math.min(drama.eps, limit);
  return Array.from({ length: n }, (_, i) => ({
    n: i + 1,
    title: i === 0 ? "Pilot" : EP_NAMES[(i + drama.title.length) % EP_NAMES.length],
    mins: (drama.mins + ((i * 7) % 5) / 10).toFixed(1),
  }));
}

export const PAY_METHODS = [
  { id: "card", name: "Card", sub: "Credit or debit card", secure: "Secure checkout · Card details are encrypted" },
  { id: "applepay", name: "Apple Pay", sub: "Pay with Face ID or Touch ID", secure: "Secure checkout powered by Apple Pay" },
  { id: "gpay", name: "Google Pay", sub: "Use a card saved to Google", secure: "Secure checkout powered by Google Pay" },
];
