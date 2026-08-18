export interface ParsedGroceryItem {
  id: string;
  name: string;
  category: string;
  quantity?: string;
  notes?: string;
  isStaple?: boolean;
}

export const defaultCategoryRules: Record<string, string> = {
  // Produce (Fruits, Vegetables, Fresh Herbs)
  banana: 'Produce',
  bananas: 'Produce',
  apple: 'Produce',
  apples: 'Produce',
  orange: 'Produce',
  oranges: 'Produce',
  lime: 'Produce',
  limes: 'Produce',
  lemon: 'Produce',
  lemons: 'Produce',
  avocado: 'Produce',
  avocados: 'Produce',
  tomato: 'Produce',
  tomatoes: 'Produce',
  potato: 'Produce',
  potatoes: 'Produce',
  onion: 'Produce',
  onions: 'Produce',
  garlic: 'Produce',
  lettuce: 'Produce',
  spinach: 'Produce',
  kale: 'Produce',
  broccoli: 'Produce',
  cauliflower: 'Produce',
  carrot: 'Produce',
  carrots: 'Produce',
  cucumber: 'Produce',
  cucumbers: 'Produce',
  pepper: 'Produce',
  peppers: 'Produce',
  capsicum: 'Produce',
  mushroom: 'Produce',
  mushrooms: 'Produce',
  celery: 'Produce',
  zucchini: 'Produce',
  eggplant: 'Produce',
  cabbage: 'Produce',
  asparagus: 'Produce',
  corn: 'Produce',
  herbs: 'Produce',
  cilantro: 'Produce',
  parsley: 'Produce',
  basil: 'Produce',
  mint: 'Produce',
  rosemary: 'Produce',
  thyme: 'Produce',
  ginger: 'Produce',
  berries: 'Produce',
  strawberry: 'Produce',
  strawberries: 'Produce',
  blueberry: 'Produce',
  blueberries: 'Produce',
  raspberry: 'Produce',
  raspberries: 'Produce',
  blackberry: 'Produce',
  blackberries: 'Produce',
  grape: 'Produce',
  grapes: 'Produce',
  watermelon: 'Produce',
  melon: 'Produce',
  cantaloupe: 'Produce',
  pineapple: 'Produce',
  mango: 'Produce',
  mangoes: 'Produce',
  peach: 'Produce',
  peaches: 'Produce',
  plum: 'Produce',
  plums: 'Produce',
  pear: 'Produce',
  pears: 'Produce',
  cherry: 'Produce',
  cherries: 'Produce',
  kiwi: 'Produce',
  kiwis: 'Produce',

  // Dairy & Eggs & Plant Dairy
  milk: 'Dairy & Eggs',
  'oat milk': 'Dairy & Eggs',
  'almond milk': 'Dairy & Eggs',
  'soy milk': 'Dairy & Eggs',
  'coconut milk': 'Dairy & Eggs',
  eggs: 'Dairy & Eggs',
  egg: 'Dairy & Eggs',
  butter: 'Dairy & Eggs',
  cheese: 'Dairy & Eggs',
  cheddar: 'Dairy & Eggs',
  parmesan: 'Dairy & Eggs',
  mozzarella: 'Dairy & Eggs',
  feta: 'Dairy & Eggs',
  gouda: 'Dairy & Eggs',
  brie: 'Dairy & Eggs',
  ricotta: 'Dairy & Eggs',
  'cream cheese': 'Dairy & Eggs',
  'cottage cheese': 'Dairy & Eggs',
  yogurt: 'Dairy & Eggs',
  'greek yogurt': 'Dairy & Eggs',
  cream: 'Dairy & Eggs',
  'sour cream': 'Dairy & Eggs',
  'heavy cream': 'Dairy & Eggs',
  'whipping cream': 'Dairy & Eggs',
  tofu: 'Dairy & Eggs',
  tempeh: 'Dairy & Eggs',

  // Bakery & Breads
  bread: 'Bakery',
  sourdough: 'Bakery',
  bagel: 'Bakery',
  bagels: 'Bakery',
  croissant: 'Bakery',
  croissants: 'Bakery',
  tortilla: 'Bakery',
  tortillas: 'Bakery',
  pita: 'Bakery',
  buns: 'Bakery',
  rolls: 'Bakery',
  toast: 'Bakery',
  baguette: 'Bakery',
  muffin: 'Bakery',
  muffins: 'Bakery',
  donut: 'Bakery',
  donuts: 'Bakery',
  cake: 'Bakery',
  pastry: 'Bakery',

  // Meat & Seafood
  chicken: 'Meat & Seafood',
  beef: 'Meat & Seafood',
  steak: 'Meat & Seafood',
  ground: 'Meat & Seafood',
  mince: 'Meat & Seafood',
  pork: 'Meat & Seafood',
  bacon: 'Meat & Seafood',
  ham: 'Meat & Seafood',
  salmon: 'Meat & Seafood',
  fish: 'Meat & Seafood',
  tuna_fresh: 'Meat & Seafood',
  shrimp: 'Meat & Seafood',
  prawns: 'Meat & Seafood',
  turkey: 'Meat & Seafood',
  sausage: 'Meat & Seafood',
  sausages: 'Meat & Seafood',
  lamb: 'Meat & Seafood',
  ribs: 'Meat & Seafood',
  meatballs: 'Meat & Seafood',
  prosciutto: 'Meat & Seafood',
  salami: 'Meat & Seafood',

  // Pantry & Dry Goods
  rice: 'Pantry',
  pasta: 'Pantry',
  spaghetti: 'Pantry',
  noodles: 'Pantry',
  macaroni: 'Pantry',
  penne: 'Pantry',
  quinoa: 'Pantry',
  beans: 'Pantry',
  lentils: 'Pantry',
  chickpeas: 'Pantry',
  olive: 'Pantry',
  oil: 'Pantry',
  vinegar: 'Pantry',
  salt: 'Pantry',
  pepper_spice: 'Pantry',
  sugar: 'Pantry',
  flour: 'Pantry',
  cereal: 'Pantry',
  oats: 'Pantry',
  oatmeal: 'Pantry',
  sauce: 'Pantry',
  spices: 'Pantry',
  coffee: 'Pantry',
  espresso: 'Pantry',
  tea: 'Pantry',
  canned: 'Pantry',
  tuna: 'Pantry',
  soup: 'Pantry',
  broth: 'Pantry',
  stock: 'Pantry',
  peanut: 'Pantry',
  'peanut butter': 'Pantry',
  'almond butter': 'Pantry',
  jam: 'Pantry',
  jelly: 'Pantry',
  honey: 'Pantry',
  maple: 'Pantry',
  syrup: 'Pantry',
  ketchup: 'Pantry',
  mustard: 'Pantry',
  mayo: 'Pantry',
  mayonnaise: 'Pantry',
  dressing: 'Pantry',
  baking: 'Pantry',
  yeast: 'Pantry',
  cocoa: 'Pantry',

  // Snacks & Drinks
  chips: 'Snacks & Drinks',
  crisps: 'Snacks & Drinks',
  cookies: 'Snacks & Drinks',
  chocolate: 'Snacks & Drinks',
  crackers: 'Snacks & Drinks',
  nuts: 'Snacks & Drinks',
  almonds: 'Snacks & Drinks',
  cashews: 'Snacks & Drinks',
  walnuts: 'Snacks & Drinks',
  peanuts: 'Snacks & Drinks',
  popcorn: 'Snacks & Drinks',
  pretzels: 'Snacks & Drinks',
  candy: 'Snacks & Drinks',
  gummies: 'Snacks & Drinks',
  soda: 'Snacks & Drinks',
  coke: 'Snacks & Drinks',
  juice: 'Snacks & Drinks',
  water: 'Snacks & Drinks',
  'sparkling water': 'Snacks & Drinks',
  seltzers: 'Snacks & Drinks',
  wine: 'Snacks & Drinks',
  beer: 'Snacks & Drinks',
  cider: 'Snacks & Drinks',

  // Frozen
  frozen: 'Frozen',
  ice: 'Frozen',
  'ice cream': 'Frozen',
  pizza: 'Frozen',
  peas_frozen: 'Frozen',
  waffles: 'Frozen',
  popsicles: 'Frozen',
  nuggets: 'Frozen',

  // Household & Personal
  paper: 'Household',
  'paper towels': 'Household',
  'toilet paper': 'Household',
  tissue: 'Household',
  tissues: 'Household',
  napkins: 'Household',
  soap: 'Household',
  'dish soap': 'Household',
  'hand soap': 'Household',
  'body wash': 'Household',
  detergent: 'Household',
  'laundry detergent': 'Household',
  sponge: 'Household',
  sponges: 'Household',
  cleaner: 'Household',
  bleach: 'Household',
  wipes: 'Household',
  trash: 'Household',
  'trash bags': 'Household',
  bags: 'Household',
  foil: 'Household',
  'aluminum foil': 'Household',
  ziploc: 'Household',
  'plastic wrap': 'Household',
  shampoo: 'Household',
  conditioner: 'Household',
  toothpaste: 'Household',
  toothbrush: 'Household',
  deodorant: 'Household',
  lotion: 'Household'
};

export function inferCategory(name: string): string {
  const lower = name.toLowerCase().trim();
  for (const [keyword, category] of Object.entries(defaultCategoryRules)) {
    if (lower.includes(keyword)) {
      return category;
    }
  }
  return 'Pantry';
}

function toTitleCase(str: string): string {
  return str
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Intelligent NLP & Regex Parser for Unstructured Grocery Lists
 * Handles:
 * - Prefix quantities: "6 Banana", "2x Avocados", "1.5 kg chicken breast", "2 packs of paper towels"
 * - Suffix quantities: "Orange 12", "Limes  12", "Eggs 2 dozen", "Milk 2L"
 * - Notes & Brands in parentheses: "Oat milk (Oatly barista)", "Avocados (medium ripe)"
 * - Bullet lists, numbered lists, checkboxes, commas, and newlines
 */
export function parseRawGroceryText(rawText: string): ParsedGroceryItem[] {
  if (!rawText || typeof rawText !== 'string') return [];

  // Split lines by newline or commas (if on single line with commas)
  let rawLines: string[] = [];

  if (rawText.includes('\n')) {
    rawLines = rawText.split('\n');
  } else if (rawText.includes(',')) {
    rawLines = rawText.split(',');
  } else {
    rawLines = [rawText];
  }

  const results: ParsedGroceryItem[] = [];

  const unitRegexPart =
    '(?:x|\\*|lbs?|pounds?|kg|kilos?|g|grams?|oz|ounces?|l|liters?|litres?|ml|cartons?|packs?|boxes?|box|bags?|bag|cans?|can|bottles?|bottle|bunches?|bunch|heads?|head|dozen|doz|slices?|pcs|pieces?|count)';

  for (let line of rawLines) {
    line = line.trim();
    if (!line) continue;

    // 1. Remove leading bullets, numbers, checkboxes (e.g. "- ", "* ", "1. ", "[ ] ")
    line = line.replace(/^(\s*[-*•–—+>\[\]\(\)]+|\d+\s*[\.\)-])\s*/, '').trim();
    if (!line) continue;

    let notes = '';
    let quantity = '';
    let itemName = line;

    // 2. Extract notes in parentheses e.g. "Oat milk (Oatly barista)"
    const parenMatch = itemName.match(/\((.*?)\)|\[(.*?)\]/);
    if (parenMatch) {
      notes = (parenMatch[1] || parenMatch[2] || '').trim();
      itemName = itemName.replace(parenMatch[0], '').trim();
    }

    // 3. Check for Prefix Quantity (e.g. "6 Banana", "2 packs of strawberries", "1.5kg chicken")
    const prefixRegex = new RegExp(
      `^(\\d+(?:[.,]\\d+)?(?:\\s*${unitRegexPart})?|a\\s+dozen|dozen)\\s*(?:of\\s+)?(.+)$`,
      'i'
    );
    const prefixMatch = itemName.match(prefixRegex);

    if (prefixMatch) {
      quantity = prefixMatch[1].trim();
      itemName = prefixMatch[2].trim();
    } else {
      // 4. Check for Suffix Quantity (e.g. "Orange 12", "Limes  12", "Milk 2L", "Eggs 2 dozen")
      const suffixRegex = new RegExp(
        `^(.*?)\\s+((?:\\d+(?:[.,]\\d+)?\\s*${unitRegexPart}?)|(?:\\d+)|(?:\\d+\\s*(?:dozen|doz)))$`,
        'i'
      );
      const suffixMatch = itemName.match(suffixRegex);

      if (suffixMatch && suffixMatch[1] && suffixMatch[2]) {
        // Ensure itemName isn't just empty
        const candidateName = suffixMatch[1].trim();
        const candidateQty = suffixMatch[2].trim();

        // If candidateName has letters, accept it
        if (/[a-zA-Z]/.test(candidateName)) {
          itemName = candidateName;
          quantity = candidateQty;
        }
      }
    }

    // 5. Clean up item name
    itemName = itemName
      .replace(/^[-*•,\s]+|[-*•,\s]+$/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!itemName || itemName.length < 2) continue;

    const formattedName = toTitleCase(itemName);
    const category = inferCategory(itemName);

    results.push({
      id: `ai-item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: formattedName,
      category,
      quantity: quantity || undefined,
      notes: notes || undefined,
      isStaple: false
    });
  }

  return results;
}

export const DEFAULT_CATEGORY_ORDER: string[] = [
  'Produce',
  'Bakery',
  'Meat & Seafood',
  'Dairy & Eggs',
  'Pantry',
  'Snacks & Drinks',
  'Frozen',
  'Household',
  'Other'
];

export function getSavedCategoryOrder(uid?: string): string[] {
  if (typeof window === 'undefined') return DEFAULT_CATEGORY_ORDER;
  try {
    const key = uid ? `grocery_category_order_${uid}` : 'grocery_category_order_default';
    const stored = localStorage.getItem(key);
    if (!stored) return DEFAULT_CATEGORY_ORDER;
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Ensure all standard categories are present even if new categories are added
      const missing = DEFAULT_CATEGORY_ORDER.filter((c) => !parsed.includes(c));
      return [...parsed, ...missing];
    }
  } catch (e) {
    console.error('Failed to read saved category order:', e);
  }
  return DEFAULT_CATEGORY_ORDER;
}

export function saveCategoryOrder(order: string[], uid?: string): void {
  if (typeof window === 'undefined') return;
  try {
    const key = uid ? `grocery_category_order_${uid}` : 'grocery_category_order_default';
    localStorage.setItem(key, JSON.stringify(order));
  } catch (e) {
    console.error('Failed to save category order:', e);
  }
}

