"use strict";

/* ============================================================
   CampusBite — Smart College Canteen
   A self-contained demo: menu, cart, coupons, wallet, orders
   and a live (simulated) pickup tracker.
   ============================================================ */

const store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage unavailable — demo still works in memory */
    }
  },
};

/* ---------------- Menu data ---------------- */
const MENU = [
  {
    id: "masala-dosa",
    name: "Masala Dosa",
    desc: "Crisp dosa with spiced potato, sambar and three chutneys.",
    price: 60,
    img: "assets/img/masala-dosa.jpg",
    cat: "breakfast",
    veg: true,
    rating: 4.8,
    reviews: 320,
    kcal: 380,
    prep: 12,
    tag: "South Indian",
    badge: "Bestseller",
  },
  {
    id: "idli-sambar",
    name: "Idli Sambar",
    desc: "Steamed rice cakes in hot sambar with fresh coconut chutney.",
    price: 45,
    img: "assets/img/idli-sambar.jpg",
    cat: "breakfast",
    veg: true,
    rating: 4.6,
    reviews: 210,
    kcal: 240,
    prep: 8,
    tag: "Light & healthy",
    badge: null,
  },
  {
    id: "poha",
    name: "Kanda Poha",
    desc: "Flattened rice with peanuts, curry leaves, lemon and coriander.",
    price: 35,
    img: "assets/img/poha.jpg",
    cat: "breakfast",
    veg: true,
    rating: 4.5,
    reviews: 140,
    kcal: 260,
    prep: 7,
    tag: "Quick bite",
    badge: null,
  },
  {
    id: "aloo-paratha",
    name: "Aloo Paratha",
    desc: "Two stuffed parathas with curd, pickle and white butter.",
    price: 50,
    img: "assets/img/aloo-paratha.jpg",
    cat: "breakfast",
    veg: true,
    rating: 4.7,
    reviews: 180,
    kcal: 480,
    prep: 10,
    tag: "Punjabi",
    badge: null,
  },
  {
    id: "veg-thali",
    name: "Veg Thali",
    desc: "Dal, seasonal sabzi, jeera rice, four rotis, salad and papad.",
    price: 95,
    img: "assets/img/veg-thali.jpg",
    cat: "meals",
    veg: true,
    rating: 4.9,
    reviews: 540,
    kcal: 620,
    prep: 15,
    tag: "North Indian",
    badge: "Chef's pick",
  },
  {
    id: "chicken-biryani",
    name: "Chicken Biryani",
    desc: "Basmati rice with tender chicken, raita and mirchi ka salan.",
    price: 140,
    img: "assets/img/chicken-biryani.jpg",
    cat: "meals",
    veg: false,
    rating: 4.9,
    reviews: 890,
    kcal: 720,
    prep: 18,
    tag: "Hyderabadi",
    badge: "Bestseller",
  },
  {
    id: "rajma-chawal",
    name: "Rajma Chawal",
    desc: "Slow-cooked kidney beans over rice with onion salad.",
    price: 80,
    img: "assets/img/rajma-chawal.jpg",
    cat: "meals",
    veg: true,
    rating: 4.6,
    reviews: 260,
    kcal: 520,
    prep: 12,
    tag: "Comfort food",
    badge: null,
  },
  {
    id: "paneer-butter-masala",
    name: "Paneer Butter Masala",
    desc: "Creamy tomato paneer curry with three butter rotis.",
    price: 110,
    img: "assets/img/paneer-butter-masala.jpg",
    cat: "meals",
    veg: true,
    rating: 4.8,
    reviews: 420,
    kcal: 650,
    prep: 16,
    tag: "Rich & creamy",
    badge: null,
  },
  {
    id: "chole-bhature",
    name: "Chole Bhature",
    desc: "Spicy chickpeas with two fluffy bhature and pickled onion.",
    price: 70,
    img: "assets/img/chole-bhature.jpg",
    cat: "meals",
    veg: true,
    rating: 4.7,
    reviews: 300,
    kcal: 580,
    prep: 14,
    tag: "Delhi style",
    badge: null,
  },
  {
    id: "egg-curry-rice",
    name: "Egg Curry Rice",
    desc: "Home-style egg curry with steamed rice and a side salad.",
    price: 85,
    img: "assets/img/egg-curry-rice.jpg",
    cat: "meals",
    veg: false,
    rating: 4.6,
    reviews: 170,
    kcal: 540,
    prep: 12,
    tag: "Homely",
    badge: null,
  },
  {
    id: "butter-chicken",
    name: "Butter Chicken",
    desc: "Smoky tomato-butter chicken with jeera rice and onion.",
    price: 150,
    img: "assets/img/butter-chicken.jpg",
    cat: "meals",
    veg: false,
    rating: 4.8,
    reviews: 380,
    kcal: 680,
    prep: 18,
    tag: "Dhaba style",
    badge: "New",
  },
  {
    id: "veg-fried-rice",
    name: "Veg Fried Rice",
    desc: "Wok-tossed rice with peas, carrot, spring onion and soy.",
    price: 80,
    img: "assets/img/veg-fried-rice.jpg",
    cat: "meals",
    veg: true,
    rating: 4.5,
    reviews: 220,
    kcal: 450,
    prep: 10,
    tag: "Indo-Chinese",
    badge: null,
  },
  {
    id: "margherita-pizza",
    name: "Margherita Pizza",
    desc: "Thin crust, tomato sauce, mozzarella and fresh basil. 8 inch.",
    price: 120,
    img: "assets/img/margherita-pizza.jpg",
    cat: "fastfood",
    veg: true,
    rating: 4.7,
    reviews: 410,
    kcal: 560,
    prep: 12,
    tag: "Wood-fired style",
    badge: "New",
  },
  {
    id: "veg-burger",
    name: "Veg Burger",
    desc: "Crunchy veg patty, lettuce, tomato and house mayo in a soft bun.",
    price: 90,
    img: "assets/img/veg-burger.jpg",
    cat: "fastfood",
    veg: true,
    rating: 4.6,
    reviews: 350,
    kcal: 480,
    prep: 9,
    tag: "Campus classic",
    badge: null,
  },
  {
    id: "chicken-burger",
    name: "Crispy Chicken Burger",
    desc: "Fried chicken thigh, slaw and chipotle mayo. Served hot.",
    price: 120,
    img: "assets/img/chicken-burger.jpg",
    cat: "fastfood",
    veg: false,
    rating: 4.7,
    reviews: 290,
    kcal: 540,
    prep: 10,
    tag: "Crispy fried",
    badge: null,
  },
  {
    id: "peri-peri-fries",
    name: "Peri-Peri Fries",
    desc: "Crispy fries tossed in peri-peri masala with a mayo dip.",
    price: 50,
    img: "assets/img/peri-peri-fries.jpg",
    cat: "fastfood",
    veg: true,
    rating: 4.6,
    reviews: 340,
    kcal: 310,
    prep: 8,
    tag: "Shareable",
    badge: null,
  },
  {
    id: "grilled-sandwich",
    name: "Grilled Sandwich",
    desc: "Triple-layer cheese and veggie sandwich, grilled to order.",
    price: 70,
    img: "assets/img/grilled-sandwich.jpg",
    cat: "fastfood",
    veg: true,
    rating: 4.5,
    reviews: 220,
    kcal: 380,
    prep: 9,
    tag: "Cafe classic",
    badge: null,
  },
  {
    id: "penne-alfredo",
    name: "Penne Alfredo",
    desc: "Penne in a slow-cooked parmesan cream sauce with herbs.",
    price: 110,
    img: "assets/img/penne-alfredo.jpg",
    cat: "fastfood",
    veg: true,
    rating: 4.6,
    reviews: 190,
    kcal: 520,
    prep: 11,
    tag: "Creamy",
    badge: null,
  },
  {
    id: "veg-momos",
    name: "Veg Momos",
    desc: "Six steamed momos with cabbage-carrot filling and chilli sauce.",
    price: 60,
    img: "assets/img/veg-momos.jpg",
    cat: "fastfood",
    veg: true,
    rating: 4.7,
    reviews: 460,
    kcal: 320,
    prep: 8,
    tag: "Steamed",
    badge: "Popular",
  },
  {
    id: "garlic-bread",
    name: "Cheese Garlic Bread",
    desc: "Toasted garlic bread with melted cheese and oregano.",
    price: 60,
    img: "assets/img/garlic-bread.jpg",
    cat: "fastfood",
    veg: true,
    rating: 4.5,
    reviews: 180,
    kcal: 340,
    prep: 6,
    tag: "Cheesy",
    badge: null,
  },
  {
    id: "samosa",
    name: "Samosa (2 pc)",
    desc: "Two crisp samosas with tamarind and mint chutney.",
    price: 30,
    img: "assets/img/samosa.jpg",
    cat: "snacks",
    veg: true,
    rating: 4.8,
    reviews: 610,
    kcal: 290,
    prep: 5,
    tag: "Evening snack",
    badge: "Value pick",
  },
  {
    id: "veg-puff",
    name: "Veg Puff",
    desc: "Flaky golden puff stuffed with spiced potatoes and peas.",
    price: 25,
    img: "assets/img/veg-puff.jpg",
    cat: "snacks",
    veg: true,
    rating: 4.4,
    reviews: 190,
    kcal: 210,
    prep: 4,
    tag: "Quick bite",
    badge: null,
  },
  {
    id: "masala-maggi",
    name: "Masala Maggi",
    desc: "Noodles with crunchy veggies and an extra kick of masala.",
    price: 40,
    img: "assets/img/masala-maggi.jpg",
    cat: "snacks",
    veg: true,
    rating: 4.7,
    reviews: 780,
    kcal: 340,
    prep: 7,
    tag: "Hostel favourite",
    badge: "Late-night",
  },
  {
    id: "chicken-roll",
    name: "Chicken Roll",
    desc: "Chicken tikka wrapped in flaky paratha with onion and chutney.",
    price: 90,
    img: "assets/img/chicken-roll.jpg",
    cat: "snacks",
    veg: false,
    rating: 4.7,
    reviews: 210,
    kcal: 460,
    prep: 10,
    tag: "Street style",
    badge: null,
  },
  {
    id: "paneer-tikka",
    name: "Paneer Tikka",
    desc: "Char-grilled paneer with peppers, onion rings and mint chutney.",
    price: 95,
    img: "assets/img/paneer-tikka.jpg",
    cat: "snacks",
    veg: true,
    rating: 4.7,
    reviews: 260,
    kcal: 380,
    prep: 10,
    tag: "Char-grilled",
    badge: null,
  },
  {
    id: "vada-pav",
    name: "Vada Pav",
    desc: "Mumbai classic — spiced potato vada, dry garlic chutney, pav.",
    price: 25,
    img: "assets/img/vada-pav.jpg",
    cat: "snacks",
    veg: true,
    rating: 4.8,
    reviews: 520,
    kcal: 290,
    prep: 5,
    tag: "Mumbai classic",
    badge: null,
  },
  {
    id: "chocolate-brownie",
    name: "Chocolate Brownie",
    desc: "Fudgy cocoa brownie with a crackly top. Baked this morning.",
    price: 70,
    img: "assets/img/chocolate-brownie.jpg",
    cat: "desserts",
    veg: true,
    rating: 4.7,
    reviews: 210,
    kcal: 360,
    prep: 5,
    tag: "Baked fresh",
    badge: null,
  },
  {
    id: "vanilla-ice-cream",
    name: "Vanilla Ice Cream",
    desc: "Two scoops of vanilla bean ice cream with chocolate sauce.",
    price: 50,
    img: "assets/img/vanilla-ice-cream.jpg",
    cat: "desserts",
    veg: true,
    rating: 4.6,
    reviews: 320,
    kcal: 210,
    prep: 3,
    tag: "Two scoops",
    badge: null,
  },
  {
    id: "jalebi",
    name: "Jalebi (100 g)",
    desc: "Crisp spirals soaked in saffron syrup, served warm.",
    price: 40,
    img: "assets/img/jalebi.jpg",
    cat: "desserts",
    veg: true,
    rating: 4.5,
    reviews: 160,
    kcal: 280,
    prep: 5,
    tag: "Saffron syrup",
    badge: null,
  },
  {
    id: "choco-lava-cake",
    name: "Choco Lava Cake",
    desc: "Warm chocolate cake with a molten centre. Best shared.",
    price: 80,
    img: "assets/img/choco-lava-cake.jpg",
    cat: "desserts",
    veg: true,
    rating: 4.8,
    reviews: 270,
    kcal: 420,
    prep: 6,
    tag: "Warm centre",
    badge: "Bestseller",
  },
  {
    id: "cold-coffee",
    name: "Cold Coffee",
    desc: "Creamy cold coffee with a chocolate drizzle and crushed ice.",
    price: 55,
    img: "assets/img/cold-coffee.jpg",
    cat: "beverages",
    veg: true,
    rating: 4.8,
    reviews: 450,
    kcal: 180,
    prep: 5,
    tag: "Cafe style",
    badge: "Bestseller",
  },
  {
    id: "masala-chai",
    name: "Masala Chai",
    desc: "Kadak chai brewed with ginger, cardamom and a hint of clove.",
    price: 15,
    img: "assets/img/masala-chai.jpg",
    cat: "beverages",
    veg: true,
    rating: 4.9,
    reviews: 980,
    kcal: 80,
    prep: 3,
    tag: "Fresh brew",
    badge: null,
  },
  {
    id: "lime-soda",
    name: "Fresh Lime Soda",
    desc: "Fresh lime with a fizzy kick — sweet or salted.",
    price: 35,
    img: "assets/img/lime-soda.jpg",
    cat: "beverages",
    veg: true,
    rating: 4.6,
    reviews: 260,
    kcal: 90,
    prep: 4,
    tag: "Refreshing",
    badge: null,
  },
  {
    id: "mango-smoothie",
    name: "Mango Smoothie",
    desc: "Alphonso mango blended with curd and a drizzle of honey.",
    price: 65,
    img: "assets/img/mango-smoothie.jpg",
    cat: "beverages",
    veg: true,
    rating: 4.7,
    reviews: 150,
    kcal: 210,
    prep: 6,
    tag: "Seasonal",
    badge: null,
  },
  {
    id: "oreo-milkshake",
    name: "Oreo Milkshake",
    desc: "Thick vanilla shake blended with Oreo crumble and cream.",
    price: 80,
    img: "assets/img/oreo-milkshake.jpg",
    cat: "beverages",
    veg: true,
    rating: 4.7,
    reviews: 240,
    kcal: 360,
    prep: 6,
    tag: "Thick shake",
    badge: null,
  },
  {
    id: "iced-lemon-tea",
    name: "Iced Lemon Tea",
    desc: "Chilled black tea with lemon, mint and a little sugar.",
    price: 45,
    img: "assets/img/iced-lemon-tea.jpg",
    cat: "beverages",
    veg: true,
    rating: 4.4,
    reviews: 130,
    kcal: 70,
    prep: 4,
    tag: "Iced",
    badge: null,
  },
  {
    id: "fruit-bowl",
    name: "Fruit Bowl",
    desc: "Seasonal fruit with chaat masala, lemon and fresh mint.",
    price: 60,
    img: "assets/img/fruit-bowl.jpg",
    cat: "healthy",
    veg: true,
    rating: 4.8,
    reviews: 130,
    kcal: 140,
    prep: 5,
    tag: "Fresh-cut",
    badge: null,
  },
  {
    id: "sprout-salad",
    name: "Sprout Salad",
    desc: "Moong sprouts, tomato, onion and a bright lemon dressing.",
    price: 45,
    img: "assets/img/sprout-salad.jpg",
    cat: "healthy",
    veg: true,
    rating: 4.5,
    reviews: 90,
    kcal: 120,
    prep: 4,
    tag: "High protein",
    badge: "Healthy",
  },
  {
    id: "grilled-chicken-salad",
    name: "Grilled Chicken Salad",
    desc: "Grilled chicken, greens, cherry tomato and a mustard vinaigrette.",
    price: 110,
    img: "assets/img/grilled-chicken-salad.jpg",
    cat: "healthy",
    veg: false,
    rating: 4.6,
    reviews: 110,
    kcal: 320,
    prep: 10,
    tag: "Protein packed",
    badge: null,
  },
  {
    id: "dosa-combo",
    name: "Dosa + Cold Coffee",
    desc: "Crisp masala dosa paired with our signature cold coffee.",
    price: 99,
    img: "assets/img/dosa-combo.jpg",
    cat: "combos",
    veg: true,
    rating: 4.9,
    reviews: 320,
    kcal: 560,
    prep: 12,
    tag: "Save ₹16",
    badge: "Combo",
  },
  {
    id: "burger-combo",
    name: "Burger Meal",
    desc: "Veg burger, peri-peri fries and a soft drink. Save ₹20.",
    price: 140,
    img: "assets/img/burger-combo.jpg",
    cat: "combos",
    veg: true,
    rating: 4.7,
    reviews: 230,
    kcal: 760,
    prep: 12,
    tag: "Save ₹20",
    badge: "Combo",
  },
];

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "breakfast", label: "Breakfast" },
  { id: "meals", label: "Meals" },
  { id: "fastfood", label: "Fast food" },
  { id: "snacks", label: "Snacks" },
  { id: "desserts", label: "Desserts" },
  { id: "beverages", label: "Beverages" },
  { id: "healthy", label: "Healthy" },
  { id: "combos", label: "Combos" },
];

const COUPONS = {
  CAMPUS20: { percent: 20, max: 40, label: "20% off up to ₹40" },
};

/* ---------------- State ---------------- */
const state = {
  category: "all",
  search: "",
  sort: "recommended",
  vegOnly: store.get("cb_veg", false) === true,
  cart: sanitizeCart(store.get("cb_cart", {})),
  favs: new Set(Array.isArray(store.get("cb_favs", [])) ? store.get("cb_favs", []) : []),
  wallet: clampMoney(store.get("cb_wallet", 250), 250),
  points: clampMoney(store.get("cb_points", 320), 320),
  orders: Array.isArray(store.get("cb_orders", [])) ? store.get("cb_orders", []) : [],
  coupon: null,
  useWallet: false,
  slot: "asap",
  slots: [],
  slotsAt: 0,
  theme:
    store.get("cb_theme", null) ||
    (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"),
  activeOrderId: null,
  celebratedOrders: new Set(),
};

let trackerTimer = null;

/* ---------------- Helpers ---------------- */
function clampMoney(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : fallback;
}

function sanitizeCart(raw) {
  const out = {};
  if (!raw || typeof raw !== "object") return out;
  for (const [id, qty] of Object.entries(raw)) {
    const n = Number(qty);
    if (MENU.some((m) => m.id === id) && Number.isFinite(n) && n > 0) {
      out[id] = Math.min(Math.floor(n), 20);
    }
  }
  return out;
}

function money(n) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

function cartEntries() {
  return Object.entries(state.cart)
    .map(([id, qty]) => ({ item: MENU.find((m) => m.id === id), qty }))
    .filter((entry) => entry.item && entry.qty > 0);
}

function cartQty() {
  return Object.values(state.cart).reduce((sum, n) => sum + n, 0);
}

function itemQty(id) {
  return state.cart[id] || 0;
}

function persistCart() {
  store.set("cb_cart", state.cart);
}

function saveOrders() {
  store.set("cb_orders", state.orders);
}

function saveWallet() {
  store.set("cb_wallet", state.wallet);
  store.set("cb_points", state.points);
}

function saveFavs() {
  store.set("cb_favs", [...state.favs]);
}

function nowLabel() {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function dateLabel(ts) {
  return new Date(ts).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/* ---------------- DOM ---------------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const els = {
  topbar: $("#topbar"),
  themeToggle: $("#themeToggle"),
  walletChip: $("#walletChip"),
  walletAmount: $("#walletAmount"),
  cartButton: $("#cartButton"),
  cartCount: $("#cartCount"),
  navCartCount: $("#navCartCount"),
  ordersButton: $("#ordersButton"),
  allOrdersButton: $("#allOrdersButton"),
  profileButton: $("#profileButton"),

  searchInput: $("#searchInput"),
  searchClear: $("#searchClear"),
  vegOnly: $("#vegOnly"),
  sortSelect: $("#sortSelect"),
  categoryChips: $("#categoryChips"),
  resultCount: $("#resultCount"),
  menu: $("#menu"),
  menuGrid: $("#menuGrid"),
  emptyState: $("#emptyState"),
  emptyReset: $("#emptyReset"),
  todayLabel: $("#todayLabel"),

  heroOrder: $("#heroOrder"),
  heroReorder: $("#heroReorder"),
  specialAdd: $("#specialAdd"),

  recentSection: $("#recentSection"),
  recentGrid: $("#recentGrid"),

  cartDialog: $("#cartDialog"),
  cartEmpty: $("#cartEmpty"),
  cartContent: $("#cartContent"),
  cartItems: $("#cartItems"),
  cartFoot: $("#cartFoot"),
  cartBrowse: $("#cartBrowse"),
  slotChips: $("#slotChips"),
  slotHint: $("#slotHint"),
  couponInput: $("#couponInput"),
  applyCoupon: $("#applyCoupon"),
  couponHint: $("#couponHint"),
  walletToggle: $("#walletToggle"),
  walletBalance: $("#walletBalance"),
  billSubtotal: $("#billSubtotal"),
  billDiscountRow: $("#billDiscountRow"),
  billDiscount: $("#billDiscount"),
  billPackaging: $("#billPackaging"),
  billGst: $("#billGst"),
  walletAppliedRow: $("#walletAppliedRow"),
  billWallet: $("#billWallet"),
  billTotal: $("#billTotal"),
  footTotal: $("#footTotal"),
  placeOrder: $("#placeOrder"),

  trackerDialog: $("#trackerDialog"),
  trackerContent: $("#trackerContent"),
  confetti: $("#confetti"),

  ordersDialog: $("#ordersDialog"),
  ordersList: $("#ordersList"),

  profileDialog: $("#profileDialog"),
  prefVeg: $("#prefVeg"),
  prefDark: $("#prefDark"),
  prefSms: $("#prefSms"),
  profileWallet: $("#profileWallet"),
  profilePoints: $("#profilePoints"),
  profileOrders: $("#profileOrders"),

  toastStack: $("#toastStack"),
  bottomNav: $(".bottom-nav"),
};

/* ---------------- Theme ---------------- */
function setTheme(theme, persist = true) {
  state.theme = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = state.theme;
  const meta = $('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", state.theme === "dark" ? "#121411" : "#F5F0E6");
  els.themeToggle.setAttribute(
    "aria-label",
    state.theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
  );
  els.prefDark.checked = state.theme === "dark";
  if (persist) store.set("cb_theme", state.theme);
}

/* ---------------- Menu ---------------- */
function matchesSearch(item) {
  const q = state.search.trim().toLowerCase();
  if (!q) return true;
  const haystack = `${item.name} ${item.desc} ${item.tag} ${item.cat}`.toLowerCase();
  return haystack.includes(q);
}

function matchesFilters(item) {
  if (!matchesSearch(item)) return false;
  if (state.vegOnly && !item.veg) return false;
  return true;
}

function filteredMenu() {
  const list = MENU.filter(
    (item) => (state.category === "all" || item.cat === state.category) && matchesFilters(item),
  );

  const sorters = {
    recommended: (a, b) =>
      b.rating * 10 + b.reviews / 100 - (a.rating * 10 + a.reviews / 100),
    rating: (a, b) => b.rating - a.rating,
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
  };

  return list.sort(sorters[state.sort] || sorters.recommended);
}

function renderChips() {
  els.categoryChips.innerHTML = CATEGORIES.map((cat) => {
    const count = MENU.filter(
      (item) => (cat.id === "all" || item.cat === cat.id) && matchesFilters(item),
    ).length;
    const active = state.category === cat.id;
    return `
      <button class="chip${active ? " active" : ""}" type="button" role="tab"
        aria-selected="${active}" data-cat="${cat.id}">
        ${cat.label}
        <span class="chip-count">${count}</span>
      </button>`;
  }).join("");
}

function dishCard(item, index) {
  const qty = itemQty(item.id);
  const fav = state.favs.has(item.id);
  const badge = item.badge
    ? `<span class="badge${item.badge === "Bestseller" ? " hot" : ""}">${item.badge}</span>`
    : "";

  return `
    <article class="dish${qty ? " has-qty" : ""}" data-id="${item.id}" style="--i:${Math.min(index, 11)}">
      <div class="dish-media media-${item.cat}">
        <img src="${item.img}" alt="${item.name}" width="600" height="450" loading="lazy" decoding="async" />
        ${badge}
        <button class="fav-btn${fav ? " active" : ""}" type="button" data-fav="${item.id}"
          aria-pressed="${fav}" aria-label="${fav ? "Remove from favourites" : "Save to favourites"}: ${item.name}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8Z"/>
          </svg>
        </button>
        <span class="diet-mark ${item.veg ? "veg" : "nonveg"}" role="img"
          title="${item.veg ? "Vegetarian" : "Non-vegetarian"}"
          aria-label="${item.veg ? "Vegetarian" : "Non-vegetarian"}"></span>
      </div>
      <div class="dish-body">
        <div class="dish-top">
          <h3>${item.name}</h3>
          <span class="price">${money(item.price)}</span>
        </div>
        <p class="dish-desc">${item.desc}</p>
        <div class="dish-meta">
          <span class="rating">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1Z"/>
            </svg>
            ${item.rating.toFixed(1)}
          </span>
          <span class="dot" aria-hidden="true">·</span>
          <span>${item.prep} min</span>
          <span class="dot" aria-hidden="true">·</span>
          <span>${item.kcal} kcal</span>
        </div>
        <div class="dish-foot">
          <span class="tag">${item.tag}</span>
          <div class="qty-slot">
            <button class="add-btn" type="button" data-add="${item.id}"
              aria-label="Add ${item.name} to tray">Add <span aria-hidden="true">+</span></button>
            <div class="qty-stepper" role="group" aria-label="Quantity for ${item.name}">
              <button type="button" data-dec="${item.id}" aria-label="Remove one ${item.name}">−</button>
              <span aria-live="polite">${qty || 1}</span>
              <button type="button" data-inc="${item.id}" aria-label="Add one more ${item.name}">+</button>
            </div>
          </div>
        </div>
      </div>
    </article>`;
}

function renderMenu() {
  const list = filteredMenu();
  els.menuGrid.innerHTML = list.map((item, i) => dishCard(item, i)).join("");
  els.emptyState.hidden = list.length > 0;
  els.resultCount.textContent = `${list.length} ${list.length === 1 ? "dish" : "dishes"}`;
}

function syncQuantityUI(id) {
  const qty = itemQty(id);
  $$(`.dish[data-id="${id}"]`).forEach((card) => {
    card.classList.toggle("has-qty", qty > 0);
    const value = $(".qty-stepper span", card);
    if (value) value.textContent = qty || 1;
  });
}

function toggleFav(id) {
  const button = $(`.dish[data-id="${id}"] [data-fav]`);
  if (state.favs.has(id)) {
    state.favs.delete(id);
    if (button) {
      button.classList.remove("active");
      button.setAttribute("aria-pressed", "false");
      button.setAttribute("aria-label", `Save to favourites: ${itemName(id)}`);
    }
    toast("Removed from favourites");
  } else {
    state.favs.add(id);
    if (button) {
      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");
      button.setAttribute("aria-label", `Remove from favourites: ${itemName(id)}`);
    }
    toast("Saved to favourites");
  }
  saveFavs();
}

function itemName(id) {
  return (MENU.find((m) => m.id === id) || {}).name || "dish";
}

function itemImage(id, img) {
  if (img) return img;
  const found = MENU.find((m) => m.id === id);
  return found ? found.img : "assets/img/veg-thali.jpg";
}

/* ---------------- Cart ---------------- */
function addItem(id, qty = 1, silent = false) {
  const item = MENU.find((m) => m.id === id);
  if (!item) return;

  state.cart[id] = Math.min((state.cart[id] || 0) + qty, 20);
  persistCart();
  syncQuantityUI(id);
  renderCart();
  updateBadges();
  pulseCart();

  if (!silent) {
    toast(`${item.name} added to your tray`);
  }
}

function changeQty(id, delta) {
  const next = (state.cart[id] || 0) + delta;
  if (next <= 0) {
    delete state.cart[id];
  } else {
    state.cart[id] = Math.min(next, 20);
  }
  persistCart();
  syncQuantityUI(id);
  renderCart();
  updateBadges();
}

function pulseCart() {
  els.cartButton.classList.remove("pulse");
  void els.cartButton.offsetWidth;
  els.cartButton.classList.add("pulse");
  setTimeout(() => els.cartButton.classList.remove("pulse"), 500);
}

function updateBadges() {
  const count = cartQty();
  els.cartCount.hidden = count === 0;
  els.cartCount.textContent = count;
  els.navCartCount.hidden = count === 0;
  els.navCartCount.textContent = count;
  els.cartButton.setAttribute(
    "aria-label",
    count === 0 ? "Open cart, empty" : `Open cart, ${count} item${count === 1 ? "" : "s"}`,
  );
  els.walletAmount.textContent = money(state.wallet);
}

function buildSlots() {
  const slots = [{ id: "asap", label: "ASAP", sub: "10–15 min" }];
  const start = new Date(Date.now() + 15 * 60000);
  start.setSeconds(0, 0);
  start.setMinutes(Math.ceil(start.getMinutes() / 15) * 15);
  for (let i = 0; i < 4; i += 1) {
    const time = new Date(start.getTime() + i * 15 * 60000);
    slots.push({
      id: "t" + time.getTime(),
      label: time.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      sub: "Pickup slot",
    });
  }
  return slots;
}

function ensureSlots() {
  if (!state.slots.length || Date.now() - state.slotsAt > 10 * 60000) {
    state.slots = buildSlots();
    state.slotsAt = Date.now();
  }
  if (!state.slots.some((slot) => slot.id === state.slot)) state.slot = "asap";
}

function currentSlot() {
  ensureSlots();
  return state.slots.find((slot) => slot.id === state.slot) || state.slots[0];
}

function currentSlotText() {
  const slot = currentSlot();
  return slot.id === "asap" ? "ASAP pickup · 10–15 min" : `${slot.label} pickup`;
}

function computeBill() {
  const entries = cartEntries();
  const subtotal = entries.reduce((sum, { item, qty }) => sum + item.price * qty, 0);

  let discount = 0;
  if (state.coupon && COUPONS[state.coupon]) {
    const coupon = COUPONS[state.coupon];
    discount = Math.min(Math.round((subtotal * coupon.percent) / 100), coupon.max);
  }

  const taxable = Math.max(0, subtotal - discount);
  const gst = Math.round(taxable * 0.05);
  const packaging = entries.length ? 5 : 0;
  const payableBeforeWallet = taxable + gst + packaging;
  const walletUsed = state.useWallet ? Math.min(state.wallet, payableBeforeWallet) : 0;
  const total = Math.max(0, payableBeforeWallet - walletUsed);

  return {
    entries,
    subtotal,
    discount,
    gst,
    packaging,
    walletUsed,
    total,
    count: entries.reduce((sum, { qty }) => sum + qty, 0),
  };
}

function cartRow({ item, qty }) {
  return `
    <div class="cart-item" data-id="${item.id}">
      <div class="ci-thumb" aria-hidden="true">
        <img src="${item.img}" alt="" width="54" height="54" loading="lazy" decoding="async" />
      </div>
      <div class="ci-info">
        <h4>${item.name}</h4>
        <p>${money(item.price)} each · ${item.kcal} kcal</p>
      </div>
      <div class="ci-right">
        <span class="ci-price">${money(item.price * qty)}</span>
        <div class="qty-stepper small" role="group" aria-label="Quantity for ${item.name}">
          <button type="button" data-dec="${item.id}" aria-label="Remove one ${item.name}">−</button>
          <span aria-live="polite">${qty}</span>
          <button type="button" data-inc="${item.id}" aria-label="Add one more ${item.name}">+</button>
        </div>
      </div>
    </div>`;
}

function renderSlots() {
  ensureSlots();
  els.slotChips.innerHTML = state.slots
    .map(
      (slot) => `
      <button class="slot-chip${state.slot === slot.id ? " active" : ""}" type="button"
        data-slot="${slot.id}" aria-pressed="${state.slot === slot.id}">
        <strong>${slot.label}</strong>
        <small>${slot.sub}</small>
      </button>`,
    )
    .join("");
}

function renderBill() {
  const bill = computeBill();

  els.billSubtotal.textContent = money(bill.subtotal);
  els.billPackaging.textContent = money(bill.packaging);
  els.billGst.textContent = money(bill.gst);
  els.billTotal.textContent = money(bill.total);
  els.footTotal.textContent = money(bill.total);

  els.billDiscountRow.hidden = bill.discount <= 0;
  els.billDiscount.textContent = "−" + money(bill.discount);

  els.walletAppliedRow.hidden = bill.walletUsed <= 0;
  els.billWallet.textContent = "−" + money(bill.walletUsed);

  els.walletBalance.textContent = money(state.wallet);
  els.walletToggle.checked = state.useWallet;
  els.walletToggle.disabled = state.wallet <= 0;
  els.walletBalance.closest("small").style.opacity = state.wallet <= 0 ? "0.5" : "1";
}

function renderCart() {
  const entries = cartEntries();
  const empty = entries.length === 0;

  els.cartEmpty.hidden = !empty;
  els.cartContent.hidden = empty;
  els.cartFoot.hidden = empty;

  if (empty) {
    els.cartItems.innerHTML = "";
    return;
  }

  els.cartItems.innerHTML = entries.map(cartRow).join("");
  renderSlots();
  renderBill();
}

/* ---------------- Coupons ---------------- */
function defaultHint() {
  els.couponHint.className = "hint";
  els.couponHint.textContent = "CAMPUS20 · 20% off up to ₹40";
}

function showCouponHint(text, kind) {
  els.couponHint.className = "hint " + kind;
  els.couponHint.textContent = text;
}

function applyCoupon() {
  if (state.coupon) {
    state.coupon = null;
    els.couponInput.value = "";
    els.applyCoupon.textContent = "Apply";
    defaultHint();
    renderBill();
    toast("Coupon removed");
    return;
  }

  const code = els.couponInput.value.trim().toUpperCase();
  if (!code) {
    showCouponHint("Enter a coupon code to unlock savings.", "error");
    els.couponInput.focus();
    return;
  }

  if (!COUPONS[code]) {
    showCouponHint("That code isn't valid. Try CAMPUS20.", "error");
    return;
  }

  state.coupon = code;
  els.couponInput.value = code;
  els.applyCoupon.textContent = "Remove";
  const bill = computeBill();
  showCouponHint(
    `${code} applied — you saved ${money(bill.discount)}.`,
    "success",
  );
  renderBill();
  toast("Campus coupon applied");
}

/* ---------------- Orders ---------------- */
function stageOf(order) {
  const elapsed = (Date.now() - order.placedAt) / 1000;
  if (elapsed > 45) return 3;
  if (elapsed > 14) return 2;
  if (elapsed > 5) return 1;
  return 0;
}

function orderStatus(order) {
  const elapsed = (Date.now() - order.placedAt) / 1000;
  if (elapsed > 1800) return { label: "Completed", cls: "completed", stage: 3 };
  if (elapsed > 45) return { label: "Ready for pickup", cls: "ready", stage: 3 };
  if (elapsed > 14) return { label: "Preparing", cls: "preparing", stage: 2 };
  if (elapsed > 5) return { label: "Confirmed", cls: "confirmed", stage: 1 };
  return { label: "Order placed", cls: "placed", stage: 0 };
}

function placeOrder() {
  const bill = computeBill();
  if (!bill.entries.length) {
    toast("Add something to your tray first");
    return;
  }

  const now = Date.now();
  const order = {
    id: "CG-" + String(now).slice(-6),
    token: String(Math.floor(100 + Math.random() * 900)),
    items: bill.entries.map(({ item, qty }) => ({
      id: item.id,
      name: item.name,
      img: item.img,
      qty,
      price: item.price,
    })),
    subtotal: bill.subtotal,
    discount: bill.discount,
    gst: bill.gst,
    packaging: bill.packaging,
    walletUsed: bill.walletUsed,
    total: bill.total,
    slot: currentSlotText(),
    placedAt: now,
    coupon: state.coupon,
  };

  state.orders.unshift(order);
  state.orders = state.orders.slice(0, 12);
  state.wallet = Math.max(0, state.wallet - bill.walletUsed);
  state.points += Math.floor(bill.subtotal / 10);

  state.cart = {};
  state.coupon = null;
  state.useWallet = false;

  persistCart();
  saveOrders();
  saveWallet();

  els.couponInput.value = "";
  els.applyCoupon.textContent = "Apply";
  defaultHint();

  els.cartDialog.close();

  renderMenu();
  renderCart();
  updateBadges();
  renderRecent();
  updateHeroReorder();
  renderProfile();

  openTracker(order);
}

function renderRecent() {
  const orders = state.orders.slice(0, 3);
  els.recentSection.hidden = orders.length === 0;
  if (!orders.length) {
    els.recentGrid.innerHTML = "";
    return;
  }

  els.recentGrid.innerHTML = orders
    .map((order) => {
      const names = order.items.map((item) => item.name);
      const title = names.slice(0, 2).join(" + ") + (names.length > 2 ? ` +${names.length - 2} more` : "");
      const thumbs = order.items
        .slice(0, 3)
        .map(
          (item) =>
            `<img src="${itemImage(item.id, item.img)}" alt="" width="38" height="38" loading="lazy" />`,
        )
        .join("");
      return `
        <div class="recent-card">
          <div class="recent-thumbs" aria-hidden="true">${thumbs}</div>
          <div class="recent-info">
            <h4>${title}</h4>
            <p>${money(order.total)} · ${dateLabel(order.placedAt)}</p>
          </div>
          <button class="btn btn-soft" type="button" data-reorder="${order.id}">Reorder</button>
        </div>`;
    })
    .join("");
}

function renderOrders() {
  if (!state.orders.length) {
    els.ordersList.innerHTML = `
      <div class="empty-orders">
        <div class="empty-icon" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 3h12v18l-3-2-3 2-3-2-3 2Z"/><path d="M9 8h6M9 12h6M9 16h4"/>
          </svg>
        </div>
        <h3>No orders yet</h3>
        <p>Your first queue-free meal is waiting on the menu.</p>
        <button class="btn btn-primary" type="button" data-open-menu>Browse the menu</button>
      </div>`;
    return;
  }

  els.ordersList.innerHTML = state.orders
    .map((order) => {
      const status = orderStatus(order);
      const names = order.items.map((item) => item.name);
      const title =
        names.slice(0, 2).join(", ") + (names.length > 2 ? ` +${names.length - 2} more` : "");
      const count = order.items.reduce((sum, item) => sum + item.qty, 0);
      return `
        <div class="order-card">
          <div class="order-top">
            <div class="order-id">
              <strong>#${order.id}</strong>
              <span>${dateLabel(order.placedAt)} · Token #${order.token}</span>
            </div>
            <span class="status ${status.cls}">${status.label}</span>
          </div>
          <div class="order-body">
            <div class="order-items" aria-hidden="true">
              ${order.items
                .slice(0, 4)
                .map(
                  (item) =>
                    `<img src="${itemImage(item.id, item.img)}" alt="" width="34" height="34" loading="lazy" />`,
                )
                .join("")}
            </div>
            <div class="order-names">${title}</div>
          </div>
          <div class="order-foot">
            <span class="order-total">${money(order.total)}</span>
            <span class="order-meta">${count} item${count === 1 ? "" : "s"}</span>
            <div class="order-actions">
              <button class="btn btn-ghost" type="button" data-track="${order.id}">Track</button>
              <button class="btn btn-soft" type="button" data-reorder="${order.id}">Reorder</button>
            </div>
          </div>
        </div>`;
    })
    .join("");
}

function reorder(orderId) {
  const order = state.orders.find((entry) => entry.id === orderId);
  if (!order) {
    toast("Couldn't find that order");
    return;
  }

  order.items.forEach((saved) => {
    if (MENU.some((item) => item.id === saved.id)) {
      state.cart[saved.id] = Math.min((state.cart[saved.id] || 0) + saved.qty, 20);
    }
  });

  persistCart();
  renderMenu();
  renderCart();
  updateBadges();

  if (els.ordersDialog.open) els.ordersDialog.close();
  openCart();
  toast("Previous tray added back");
}

/* ---------------- Tracker ---------------- */
const TRACK_STEPS = [
  { title: "Order placed", desc: "We received your order and sent it to the kitchen." },
  { title: "Kitchen confirmed", desc: "Annapurna Canteen accepted your order." },
  { title: "Preparing your meal", desc: "Chef is cooking everything fresh, just for you." },
  { title: "Ready for pickup", desc: "Show your token at Counter 2." },
];

const STAGE_META = [
  { icon: "01", message: "Sending your order to the kitchen…" },
  { icon: "02", message: "Kitchen confirmed. Your meal is next in the queue." },
  { icon: "03", message: "Chef is cooking your meal fresh right now." },
  { icon: "04", message: "Your meal is ready — head to Counter 2." },
];

function etaTextFor(order) {
  const elapsed = Math.floor((Date.now() - order.placedAt) / 1000);
  const remain = Math.max(0, 45 - elapsed);
  return remain > 0 ? `Ready in 0:${String(remain).padStart(2, "0")}` : "Ready for pickup";
}

function stepMarkup(index, stage, order) {
  const done = stage === 3 ? index <= stage : index < stage;
  const current = index === stage && stage < 3;
  const cls = `track-step${done ? " done" : ""}${current ? " current" : ""}`;
  const desc = index === 3 ? `Show token #${order.token} at Counter 2.` : TRACK_STEPS[index].desc;
  return `
    <li class="${cls}">
      <span class="ts-dot" aria-hidden="true">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 6 9 17l-5-5"/>
        </svg>
      </span>
      <div class="ts-content">
        <h4>${TRACK_STEPS[index].title}</h4>
        <p>${desc}</p>
      </div>
    </li>`;
}

function openTracker(order) {
  state.activeOrderId = order.id;

  if (els.ordersDialog.open) els.ordersDialog.close();

  const stage = stageOf(order);
  const meta = STAGE_META[stage];
  const walletNote =
    order.walletUsed > 0
      ? `${money(order.walletUsed)} wallet + ${money(order.total)} at pickup`
      : `${money(order.total)} pay at pickup`;

  els.trackerContent.innerHTML = `
    <button class="icon-btn tracker-close" type="button" data-close-dialog aria-label="Close tracker">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
    </button>

    <div class="tracker-top">
      <div class="tracker-token">
        <span>Pickup token</span>
        <strong>#${order.token}</strong>
      </div>
      <div class="tracker-eta${stage === 3 ? " ready" : ""}" id="trackerEta">
        <span class="live-dot" aria-hidden="true"></span>
        <span id="etaText">${etaTextFor(order)}</span>
      </div>
    </div>

    <p class="tracker-sub">Order <b>#${order.id}</b> · <b>${order.slot}</b> · ${dateLabel(order.placedAt)}</p>

    <ol class="track-steps" id="trackSteps">
      ${TRACK_STEPS.map((_, index) => stepMarkup(index, stage, order)).join("")}
    </ol>

    <div class="tracker-banner${stage === 3 ? " ready" : ""}" id="trackerBanner">
      <span class="spark" aria-hidden="true">${meta.icon}</span>
      <span id="trackerStatus">${meta.message}</span>
    </div>

    <div class="track-summary">
      <div class="ts-head">
        <span>Order summary</span>
        <b>${money(order.total)}</b>
      </div>
      <ul class="ts-items">
        ${order.items
          .map(
            (item) =>
              `<li><span class="ts-item"><img src="${itemImage(item.id, item.img)}" alt="" width="28" height="28" loading="lazy" /> ${item.name} × ${item.qty}</span><span>${money(
                item.price * item.qty,
              )}</span></li>`,
          )
          .join("")}
      </ul>
      <div class="ts-foot">Token #${order.token} · ${order.slot} · ${walletNote}</div>
    </div>

    <div class="tracker-actions">
      <button class="btn btn-soft" type="button" data-tracker-menu>Order something else</button>
      <button class="btn btn-primary" type="button" data-close-dialog>Got it</button>
    </div>`;

  if (!els.trackerDialog.open) els.trackerDialog.showModal();

  clearInterval(trackerTimer);
  trackerTimer = setInterval(updateTracker, 1000);
  updateTracker();
}

function updateTracker() {
  if (!els.trackerDialog.open || !state.activeOrderId) return;
  const order = state.orders.find((entry) => entry.id === state.activeOrderId);
  if (!order) return;

  const stage = stageOf(order);
  const steps = $$(".track-step", els.trackerContent);

  steps.forEach((step, index) => {
    const done = stage === 3 ? index <= stage : index < stage;
    step.classList.toggle("done", done);
    step.classList.toggle("current", index === stage && stage < 3);
  });

  const eta = $("#etaText", els.trackerContent);
  const etaWrap = $("#trackerEta", els.trackerContent);
  const banner = $("#trackerBanner", els.trackerContent);
  const status = $("#trackerStatus", els.trackerContent);
  const spark = banner ? $(".spark", banner) : null;

  if (eta) eta.textContent = etaTextFor(order);
  if (etaWrap) etaWrap.classList.toggle("ready", stage === 3);
  if (banner) banner.classList.toggle("ready", stage === 3);
  if (status) status.textContent = STAGE_META[stage].message;
  if (spark) spark.textContent = STAGE_META[stage].icon;

  if (
    stage === 3 &&
    Date.now() - order.placedAt < 5 * 60000 &&
    !state.celebratedOrders.has(order.id)
  ) {
    state.celebratedOrders.add(order.id);
    setTimeout(confettiBurst, 120);
    clearInterval(trackerTimer);
  }
}

function confettiBurst() {
  const box = els.confetti;
  if (!box) return;
  const colors = ["#FF7A1A", "#F5A524", "#22C55E", "#3B82F6", "#E11D48", "#A855F7"];

  for (let i = 0; i < 38; i += 1) {
    const piece = document.createElement("span");
    piece.style.left = Math.random() * 100 + "%";
    piece.style.background = colors[i % colors.length];
    piece.style.setProperty("--dx", Math.random() * 180 - 90 + "px");
    piece.style.animationDuration = 1.1 + Math.random() * 1.2 + "s";
    piece.style.animationDelay = Math.random() * 0.25 + "s";
    piece.style.width = 5 + Math.random() * 5 + "px";
    piece.style.height = 9 + Math.random() * 9 + "px";
    box.appendChild(piece);
    setTimeout(() => piece.remove(), 2700);
  }
}

/* ---------------- Panels ---------------- */
function openCart() {
  ensureSlots();
  renderCart();
  if (!els.cartDialog.open) els.cartDialog.showModal();
}

function openOrders() {
  renderOrders();
  if (!els.ordersDialog.open) els.ordersDialog.showModal();
}

function renderProfile() {
  els.profileWallet.textContent = money(state.wallet);
  els.profilePoints.textContent = state.points.toLocaleString("en-IN");
  els.profileOrders.textContent = state.orders.length;
  els.prefVeg.checked = state.vegOnly;
  els.prefDark.checked = state.theme === "dark";
}

function openProfile() {
  renderProfile();
  if (!els.profileDialog.open) els.profileDialog.showModal();
}

function updateHeroReorder() {
  els.heroReorder.hidden = state.orders.length === 0;
}

function scrollToMenu() {
  els.menu.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeDialogAndScroll(button) {
  const dialog = button.closest("dialog");
  if (dialog) dialog.close();
  setTimeout(() => scrollToMenu(), 120);
}

/* ---------------- Toasts ---------------- */
function toast(message) {
  const el = document.createElement("div");
  el.className = "toast";
  el.innerHTML = `<span class="toast-ico" aria-hidden="true"></span><span></span>`;
  el.lastElementChild.textContent = message;
  els.toastStack.appendChild(el);

  setTimeout(() => {
    el.classList.add("out");
    setTimeout(() => el.remove(), 260);
  }, 2400);
}

/* ---------------- Events ---------------- */
function bindEvents() {
  els.themeToggle.addEventListener("click", () => {
    setTheme(state.theme === "dark" ? "light" : "dark");
  });

  els.cartButton.addEventListener("click", openCart);
  els.ordersButton.addEventListener("click", openOrders);
  els.allOrdersButton.addEventListener("click", openOrders);
  els.profileButton.addEventListener("click", openProfile);
  els.walletChip.addEventListener("click", openProfile);

  els.heroOrder.addEventListener("click", scrollToMenu);
  els.heroReorder.addEventListener("click", () => {
    if (state.orders[0]) reorder(state.orders[0].id);
  });

  els.specialAdd.addEventListener("click", () => {
    addItem("dosa-combo");
    const original = "Add combo +";
    els.specialAdd.textContent = "Added to tray ✓";
    els.specialAdd.disabled = true;
    setTimeout(() => {
      els.specialAdd.textContent = original;
      els.specialAdd.disabled = false;
    }, 1500);
  });

  /* Search & filters */
  els.searchInput.addEventListener("input", () => {
    state.search = els.searchInput.value;
    els.searchClear.hidden = !state.search;
    renderMenu();
    renderChips();
  });

  els.searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && els.searchInput.value) {
      event.stopPropagation();
      state.search = "";
      els.searchInput.value = "";
      els.searchClear.hidden = true;
      renderMenu();
      renderChips();
    }
  });

  els.searchClear.addEventListener("click", () => {
    state.search = "";
    els.searchInput.value = "";
    els.searchClear.hidden = true;
    renderMenu();
    renderChips();
    els.searchInput.focus();
  });

  els.vegOnly.addEventListener("change", () => {
    state.vegOnly = els.vegOnly.checked;
    store.set("cb_veg", state.vegOnly);
    els.prefVeg.checked = state.vegOnly;
    renderMenu();
    renderChips();
  });

  els.sortSelect.addEventListener("change", () => {
    state.sort = els.sortSelect.value;
    renderMenu();
  });

  els.categoryChips.addEventListener("click", (event) => {
    const chip = event.target.closest("[data-cat]");
    if (!chip) return;
    state.category = chip.dataset.cat;
    renderChips();
    renderMenu();
  });

  els.emptyReset.addEventListener("click", () => {
    state.category = "all";
    state.search = "";
    state.vegOnly = false;
    state.sort = "recommended";
    els.searchInput.value = "";
    els.searchClear.hidden = true;
    els.vegOnly.checked = false;
    els.prefVeg.checked = false;
    store.set("cb_veg", false);
    els.sortSelect.value = "recommended";
    renderChips();
    renderMenu();
  });

  /* Menu interactions (delegated) */
  els.menuGrid.addEventListener("click", (event) => {
    const add = event.target.closest("[data-add]");
    const inc = event.target.closest("[data-inc]");
    const dec = event.target.closest("[data-dec]");
    const fav = event.target.closest("[data-fav]");

    if (add) addItem(add.dataset.add);
    else if (inc) addItem(inc.dataset.inc, 1, true);
    else if (dec) changeQty(dec.dataset.dec, -1);
    else if (fav) toggleFav(fav.dataset.fav);
  });

  /* Recent orders */
  els.recentGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-reorder]");
    if (button) reorder(button.dataset.reorder);
  });

  /* Cart interactions */
  els.cartItems.addEventListener("click", (event) => {
    const inc = event.target.closest("[data-inc]");
    const dec = event.target.closest("[data-dec]");
    if (inc) addItem(inc.dataset.inc, 1, true);
    else if (dec) changeQty(dec.dataset.dec, -1);
  });

  els.slotChips.addEventListener("click", (event) => {
    const chip = event.target.closest("[data-slot]");
    if (!chip) return;
    state.slot = chip.dataset.slot;
    renderSlots();
  });

  els.applyCoupon.addEventListener("click", applyCoupon);

  els.couponInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      applyCoupon();
    }
  });

  els.walletToggle.addEventListener("change", () => {
    if (state.wallet <= 0) {
      els.walletToggle.checked = false;
      state.useWallet = false;
      toast("Your campus wallet is empty");
      return;
    }
    state.useWallet = els.walletToggle.checked;
    renderBill();
  });

  els.placeOrder.addEventListener("click", placeOrder);

  els.cartBrowse.addEventListener("click", () => {
    els.cartDialog.close();
    setTimeout(scrollToMenu, 120);
  });

  /* Orders panel */
  els.ordersList.addEventListener("click", (event) => {
    const track = event.target.closest("[data-track]");
    const again = event.target.closest("[data-reorder]");
    const menuButton = event.target.closest("[data-open-menu]");

    if (track) {
      const order = state.orders.find((entry) => entry.id === track.dataset.track);
      if (order) openTracker(order);
    } else if (again) {
      reorder(again.dataset.reorder);
    } else if (menuButton) {
      closeDialogAndScroll(menuButton);
    }
  });

  /* Tracker */
  els.trackerContent.addEventListener("click", (event) => {
    if (event.target.closest("[data-tracker-menu]")) {
      els.trackerDialog.close();
      setTimeout(scrollToMenu, 120);
    }
  });

  els.trackerDialog.addEventListener("close", () => {
    clearInterval(trackerTimer);
  });

  /* Profile preferences */
  els.prefVeg.addEventListener("change", () => {
    state.vegOnly = els.prefVeg.checked;
    els.vegOnly.checked = state.vegOnly;
    store.set("cb_veg", state.vegOnly);
    renderChips();
    renderMenu();
  });

  els.prefDark.addEventListener("change", () => {
    setTheme(els.prefDark.checked ? "dark" : "light");
  });

  els.prefSms.addEventListener("change", () => {
    toast(els.prefSms.checked ? "Order updates turned on" : "Order updates turned off");
  });

  /* Bottom navigation */
  els.bottomNav.addEventListener("click", (event) => {
    const button = event.target.closest("[data-nav]");
    if (!button) return;
    const nav = button.dataset.nav;

    $$(".nav-item", els.bottomNav).forEach((item) => item.classList.toggle("active", item === button));

    if (nav === "menu") scrollToMenu();
    else if (nav === "cart") openCart();
    else if (nav === "orders") openOrders();
    else if (nav === "profile") openProfile();
  });

  /* Footer info */
  document.addEventListener("click", (event) => {
    const info = event.target.closest("[data-info]");
    if (info) toast(`${info.dataset.info} — coming soon in this demo`);
  });

  /* Close buttons inside any dialog */
  document.addEventListener("click", (event) => {
    const closer = event.target.closest("[data-close-dialog]");
    if (closer) {
      const dialog = closer.closest("dialog");
      if (dialog) dialog.close();
    }
  });

  /* Backdrop click to dismiss */
  [els.cartDialog, els.trackerDialog, els.ordersDialog, els.profileDialog].forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
  });

  /* Keyboard shortcut: "/" focuses search */
  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const typing =
      target instanceof HTMLElement &&
      (target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable);

    if (event.key === "/" && !typing) {
      event.preventDefault();
      scrollToMenu();
      setTimeout(() => els.searchInput.focus(), 250);
    }
  });

  /* Topbar shadow on scroll */
  window.addEventListener(
    "scroll",
    () => {
      els.topbar.classList.toggle("scrolled", window.scrollY > 8);
    },
    { passive: true },
  );
}

/* ---------------- Init ---------------- */
function init() {
  setTheme(state.theme, false);
  els.todayLabel.textContent = `${nowLabel()} · Kitchen open`;
  els.vegOnly.checked = state.vegOnly;

  const boardDate = $("#boardDate");
  if (boardDate) boardDate.textContent = nowLabel();

  const dishCount = $("#dishCount");
  if (dishCount) dishCount.textContent = String(MENU.length);

  renderChips();
  renderMenu();
  renderCart();
  updateBadges();
  renderRecent();
  renderProfile();
  updateHeroReorder();

  els.searchInput.value = state.search;
  els.searchClear.hidden = !state.search;
  els.sortSelect.value = state.sort;

  bindEvents();
}

init();
