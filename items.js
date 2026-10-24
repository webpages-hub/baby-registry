/*
  The registry list. Edit freely.
  - qty:      how many times the item can be reserved (1 = single reserve).
  - image:    photo in the images folder (optional). Items without one show a drawn illustration.
  - priority: "most" shows the "Most wanted" badge and floats the item to the top.
  - vendor:   Instagram handle without the @.
  - price:    in your currency (set in config.js), per unit.
*/
window.REGISTRY_CATEGORIES = [
  { name: "Diapering",    icon: "i-diaper"  },
  { name: "Nursery",      icon: "i-moon"    },
  { name: "Out & About",  icon: "i-stroller"},
  { name: "Bath & Care",  icon: "i-duck"    },
  { name: "Clothing",     icon: "i-onesie"  },
  { name: "Feeding",      icon: "i-bottle"  },
  { name: "Play & Books", icon: "i-rattle"  }
];

const TN = "topnotch_babyshop2", JB = "jennysbabycrib_ng", SM = "st.marystore";

window.REGISTRY_ITEMS = [
  // Diapering
  { id: "diapers-1", image: "images/diapers-1.webp",     name: "Diapers (size 1)",       category: "Diapering", price: 18000, vendor: TN, qty: 10, priority: "most", desc: "Every pack helps. We will go through a lot!" },
  { id: "baby-wipes", image: "images/baby-wipes.webp",    name: "Baby wipes",             category: "Diapering", price: 3500,  vendor: TN, qty: 5, desc: "Gentle, fragrance-free packs." },
  { id: "changing-mat", image: "images/changing-mat.webp",  name: "Changing mat",           category: "Diapering", price: 15000, vendor: TN, qty: 1, desc: "Waterproof mat with washable covers." },
  { id: "nappy-bags",    name: "Disposable nappy bags",  category: "Diapering", price: 2000,  vendor: TN, qty: 5, desc: "Scented bags for tidy changes." },
  { id: "cotton-wool", image: "images/cotton-wool.webp",   name: "Cotton wool rolls",      category: "Diapering", price: 2500,  vendor: SM, qty: 5, desc: "For gentle cleaning at changes and bath time." },

  // Nursery
  { id: "baby-cot", image: "images/baby-cot.webp",      name: "Baby cot",               category: "Nursery", price: 150000, vendor: JB, qty: 1, priority: "most", desc: "A sturdy wooden cot with adjustable height." },
  { id: "cot-mattress", image: "images/cot-mattress.webp",  name: "Cot mattress",           category: "Nursery", price: 45000,  vendor: JB, qty: 1, priority: "most", desc: "Firm, breathable mattress sized to fit the cot." },
  { id: "mosquito-net", image: "images/mosquito-net.webp",  name: "Mosquito net",           category: "Nursery", price: 8000,   vendor: JB, qty: 1, priority: "most", desc: "A fitted net for undisturbed naps." },
  { id: "moses-basket", image: "images/moses-basket.webp",  name: "Moses basket",           category: "Nursery", price: 55000,  vendor: JB, qty: 1, desc: "A small portable bed for the early weeks." },
  { id: "cot-sheets", image: "images/cot-sheets.webp",    name: "Cot sheets",             category: "Nursery", price: 20000,  vendor: SM, qty: 1, desc: "Soft cotton fitted sheets, set of two." },
  { id: "receiving-blankets", image: "images/receiving-blankets.webp", name: "Receiving blankets", category: "Nursery", price: 9000,  vendor: SM, qty: 3, desc: "Light cotton blankets, set of three." },
  { id: "rechargeable-fan", image: "images/rechargeable-fan.webp", name: "Rechargeable fan",    category: "Nursery", price: 30000,  vendor: TN, qty: 1, desc: "Keeps the room cool through power cuts." },
  { id: "night-light", image: "images/night-light.webp",   name: "Night light",            category: "Nursery", price: 12000,  vendor: TN, qty: 1, desc: "A soft glow for night feeds." },

  // Out & About
  { id: "stroller", image: "images/stroller.webp",      name: "Stroller",               category: "Out & About", price: 120000, vendor: TN, qty: 1, priority: "most", desc: "A sturdy stroller that folds easily." },
  { id: "car-seat", image: "images/car-seat.webp",      name: "Infant car seat",        category: "Out & About", price: 95000,  vendor: TN, qty: 1, priority: "most", desc: "Rear-facing seat for the ride home." },
  { id: "baby-carrier", image: "images/baby-carrier.webp",  name: "Baby carrier",           category: "Out & About", price: 35000,  vendor: TN, qty: 1, desc: "Ergonomic carrier for newborn to toddler." },
  { id: "diaper-bag", image: "images/diaper-bag.webp",    name: "Diaper bag",             category: "Out & About", price: 25000,  vendor: TN, qty: 1, desc: "Roomy bag with a changing mat." },

  // Bath & Care
  { id: "bathtub", image: "images/bathtub.webp",       name: "Baby bathtub",           category: "Bath & Care", price: 22000, vendor: TN, qty: 1, desc: "Supportive tub with a newborn insert." },
  { id: "hooded-towels", image: "images/hooded-towels.webp", name: "Hooded towels",          category: "Bath & Care", price: 12000, vendor: SM, qty: 1, desc: "Soft cotton hooded towels, set of two." },
  { id: "bath-lotion", image: "images/bath-lotion.webp",   name: "Baby bath & lotion set", category: "Bath & Care", price: 15000, vendor: SM, qty: 2, desc: "Mild wash, lotion and powder." },
  { id: "grooming-kit", image: "images/grooming-kit.webp",  name: "Grooming kit",           category: "Bath & Care", price: 10000, vendor: SM, qty: 1, desc: "Nail clippers, brush and comb." },
  { id: "thermometer", image: "images/thermometer.webp",   name: "Digital thermometer",    category: "Bath & Care", price: 8000,  vendor: TN, qty: 1, desc: "Quick, gentle readings." },
  { id: "nasal-aspirator", name: "Nasal aspirator",      category: "Bath & Care", price: 6000,  vendor: TN, qty: 1, desc: "Helps with stuffy noses." },

  // Clothing
  { id: "sleepers", image: "images/sleepers.webp",      name: "Newborn sleepers",       category: "Clothing", price: 12000, vendor: SM, qty: 1, desc: "Footed rompers in 0 to 3 months, set of three." },
  { id: "bodysuits", image: "images/bodysuits.webp",     name: "Cotton bodysuits",       category: "Clothing", price: 9000,  vendor: SM, qty: 1, desc: "Short- and long-sleeve basics, 3 to 6 months." },
  { id: "caps-socks", image: "images/caps-socks.webp",    name: "Caps, socks & mittens",  category: "Clothing", price: 5000,  vendor: SM, qty: 5, desc: "A soft set for cooler evenings." },
  { id: "wrappers", image: "images/wrappers.webp",      name: "Baby wrappers",          category: "Clothing", price: 10000, vendor: SM, qty: 3, desc: "Light shawls for carrying and cuddling." },

  // Feeding
  { id: "bottles", image: "images/bottles.webp",       name: "Anti-colic bottles",     category: "Feeding", price: 18000, vendor: TN, qty: 1, desc: "Starter set of three." },
  { id: "steriliser",    name: "Bottle steriliser",      category: "Feeding", price: 35000, vendor: TN, qty: 1, desc: "Electric steriliser and warmer." },
  { id: "bottle-brush",  name: "Bottle brush & drying rack", category: "Feeding", price: 9000, vendor: TN, qty: 1, desc: "Fits bottles and pump parts." },
  { id: "nursing-pillow", name: "Nursing pillow",        category: "Feeding", price: 20000, vendor: TN, qty: 1, desc: "Supportive pillow with a washable cover." },
  { id: "breast-pump",   name: "Breast pump",            category: "Feeding", price: 55000, vendor: TN, qty: 1, desc: "A quiet electric pump." },
  { id: "bibs-burp", image: "images/bibs-burp.webp",     name: "Bibs & burp cloths",     category: "Feeding", price: 6000,  vendor: SM, qty: 5, desc: "Soft cotton set." },
  { id: "high-chair", image: "images/high-chair.webp",    name: "High chair",             category: "Feeding", price: 65000, vendor: TN, qty: 1, desc: "Easy-clean chair for the first solid meals." },

  // Play & Books
  { id: "play-gym", image: "images/play-gym.webp",      name: "Play gym",               category: "Play & Books", price: 30000, vendor: TN, qty: 1, desc: "Activity mat with hanging toys for tummy time." },
  { id: "bouncer", image: "images/bouncer.webp",       name: "Baby bouncer",           category: "Play & Books", price: 45000, vendor: TN, qty: 1, desc: "A gentle rocker for short breaks." },
  { id: "rattle-set", image: "images/rattle-set.webp",    name: "Soft rattle set",        category: "Play & Books", price: 8000,  vendor: SM, qty: 3, desc: "Gentle first toys for tiny hands." },
  { id: "board-books", image: "images/board-books.webp",   name: "Board book bundle",      category: "Play & Books", price: 12000, vendor: SM, qty: 3, desc: "Your favorite childhood stories. Add a note inside!" }
];
