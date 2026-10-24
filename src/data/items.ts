/*
  The registry list. Edit freely.
  - qty:      how many times the item can be reserved (1 = single reserve).
  - priority: "most" shows the "Most wanted" badge and floats the item to the top.
  - vendor:   Instagram handle without the @.
  - price:    in your currency (set in src/config.ts), per unit.
  - image:    photo in public/images (optional). Photos come as <name>.webp (800px) and
              <name>-400.webp (400px for phones). Items without a photo show an icon.
*/
export type Category =
  | "Diapering"
  | "Nursery"
  | "Out & About"
  | "Bath & Care"
  | "Clothing"
  | "Feeding"
  | "Play & Books"

export type Item = {
  id: string
  name: string
  desc: string
  category: Category
  price: number
  vendor: string
  qty: number
  priority?: "most"
  image?: string
}

export const CATEGORIES: Category[] = ["Diapering","Nursery","Out & About","Bath & Care","Clothing","Feeding","Play & Books"]

export const ITEMS: Item[] = [
  {
    "id": "diapers-1",
    "name": "Diapers (size 1)",
    "desc": "Every pack helps. We will go through a lot!",
    "category": "Diapering",
    "price": 18000,
    "vendor": "topnotch_babyshop2",
    "qty": 10,
    "priority": "most",
    "image": "/images/diapers-1.webp"
  },
  {
    "id": "baby-wipes",
    "name": "Baby wipes",
    "desc": "Gentle, fragrance-free packs.",
    "category": "Diapering",
    "price": 3500,
    "vendor": "topnotch_babyshop2",
    "qty": 5,
    "image": "/images/baby-wipes.webp"
  },
  {
    "id": "changing-mat",
    "name": "Changing mat",
    "desc": "Waterproof mat with washable covers.",
    "category": "Diapering",
    "price": 15000,
    "vendor": "topnotch_babyshop2",
    "qty": 1,
    "image": "/images/changing-mat.webp"
  },
  {
    "id": "nappy-bags",
    "image": "/images/nappy-bags.webp",
    "name": "Disposable nappy bags",
    "desc": "Scented bags for tidy changes.",
    "category": "Diapering",
    "price": 2000,
    "vendor": "topnotch_babyshop2",
    "qty": 5
  },
  {
    "id": "cotton-wool",
    "name": "Cotton wool rolls",
    "desc": "For gentle cleaning at changes and bath time.",
    "category": "Diapering",
    "price": 2500,
    "vendor": "st.marystore",
    "qty": 5,
    "image": "/images/cotton-wool.webp"
  },
  {
    "id": "baby-cot",
    "name": "Baby cot",
    "desc": "A sturdy wooden cot with adjustable height.",
    "category": "Nursery",
    "price": 150000,
    "vendor": "jennysbabycrib_ng",
    "qty": 1,
    "priority": "most",
    "image": "/images/baby-cot.webp"
  },
  {
    "id": "cot-mattress",
    "name": "Cot mattress",
    "desc": "Firm, breathable mattress sized to fit the cot.",
    "category": "Nursery",
    "price": 45000,
    "vendor": "jennysbabycrib_ng",
    "qty": 1,
    "priority": "most",
    "image": "/images/cot-mattress.webp"
  },
  {
    "id": "mosquito-net",
    "name": "Mosquito net",
    "desc": "A fitted net for undisturbed naps.",
    "category": "Nursery",
    "price": 8000,
    "vendor": "jennysbabycrib_ng",
    "qty": 1,
    "priority": "most",
    "image": "/images/mosquito-net.webp"
  },
  {
    "id": "moses-basket",
    "name": "Moses basket",
    "desc": "A small portable bed for the early weeks.",
    "category": "Nursery",
    "price": 55000,
    "vendor": "jennysbabycrib_ng",
    "qty": 1,
    "image": "/images/moses-basket.webp"
  },
  {
    "id": "cot-sheets",
    "name": "Cot sheets",
    "desc": "Soft cotton fitted sheets, set of two.",
    "category": "Nursery",
    "price": 20000,
    "vendor": "st.marystore",
    "qty": 1,
    "image": "/images/cot-sheets.webp"
  },
  {
    "id": "receiving-blankets",
    "name": "Receiving blankets",
    "desc": "Light cotton blankets, set of three.",
    "category": "Nursery",
    "price": 9000,
    "vendor": "st.marystore",
    "qty": 3,
    "image": "/images/receiving-blankets.webp"
  },
  {
    "id": "rechargeable-fan",
    "name": "Rechargeable fan",
    "desc": "Keeps the room cool through power cuts.",
    "category": "Nursery",
    "price": 30000,
    "vendor": "topnotch_babyshop2",
    "qty": 1,
    "image": "/images/rechargeable-fan.webp"
  },
  {
    "id": "night-light",
    "name": "Night light",
    "desc": "A soft glow for night feeds.",
    "category": "Nursery",
    "price": 12000,
    "vendor": "topnotch_babyshop2",
    "qty": 1,
    "image": "/images/night-light.webp"
  },
  {
    "id": "stroller",
    "name": "Stroller",
    "desc": "A sturdy stroller that folds easily.",
    "category": "Out & About",
    "price": 120000,
    "vendor": "topnotch_babyshop2",
    "qty": 1,
    "priority": "most",
    "image": "/images/stroller.webp"
  },
  {
    "id": "car-seat",
    "name": "Infant car seat",
    "desc": "Rear-facing seat for the ride home.",
    "category": "Out & About",
    "price": 95000,
    "vendor": "topnotch_babyshop2",
    "qty": 1,
    "priority": "most",
    "image": "/images/car-seat.webp"
  },
  {
    "id": "baby-carrier",
    "name": "Baby carrier",
    "desc": "Ergonomic carrier for newborn to toddler.",
    "category": "Out & About",
    "price": 35000,
    "vendor": "topnotch_babyshop2",
    "qty": 1,
    "image": "/images/baby-carrier.webp"
  },
  {
    "id": "diaper-bag",
    "name": "Diaper bag",
    "desc": "Roomy bag with a changing mat.",
    "category": "Out & About",
    "price": 25000,
    "vendor": "topnotch_babyshop2",
    "qty": 1,
    "image": "/images/diaper-bag.webp"
  },
  {
    "id": "bathtub",
    "name": "Baby bathtub",
    "desc": "Supportive tub with a newborn insert.",
    "category": "Bath & Care",
    "price": 22000,
    "vendor": "topnotch_babyshop2",
    "qty": 1,
    "image": "/images/bathtub.webp"
  },
  {
    "id": "hooded-towels",
    "name": "Hooded towels",
    "desc": "Soft cotton hooded towels, set of two.",
    "category": "Bath & Care",
    "price": 12000,
    "vendor": "st.marystore",
    "qty": 1,
    "image": "/images/hooded-towels.webp"
  },
  {
    "id": "bath-lotion",
    "name": "Baby bath & lotion set",
    "desc": "Mild wash, lotion and powder.",
    "category": "Bath & Care",
    "price": 15000,
    "vendor": "st.marystore",
    "qty": 2,
    "image": "/images/bath-lotion.webp"
  },
  {
    "id": "grooming-kit",
    "name": "Grooming kit",
    "desc": "Nail clippers, brush and comb.",
    "category": "Bath & Care",
    "price": 10000,
    "vendor": "st.marystore",
    "qty": 1,
    "image": "/images/grooming-kit.webp"
  },
  {
    "id": "thermometer",
    "name": "Digital thermometer",
    "desc": "Quick, gentle readings.",
    "category": "Bath & Care",
    "price": 8000,
    "vendor": "topnotch_babyshop2",
    "qty": 1,
    "image": "/images/thermometer.webp"
  },
  {
    "id": "nasal-aspirator",
    "image": "/images/nasal-aspirator.webp",
    "name": "Nasal aspirator",
    "desc": "Helps with stuffy noses.",
    "category": "Bath & Care",
    "price": 6000,
    "vendor": "topnotch_babyshop2",
    "qty": 1
  },
  {
    "id": "sleepers",
    "name": "Newborn sleepers",
    "desc": "Footed rompers in 0 to 3 months, set of three.",
    "category": "Clothing",
    "price": 12000,
    "vendor": "st.marystore",
    "qty": 1,
    "image": "/images/sleepers.webp"
  },
  {
    "id": "bodysuits",
    "name": "Cotton bodysuits",
    "desc": "Short- and long-sleeve basics, 3 to 6 months.",
    "category": "Clothing",
    "price": 9000,
    "vendor": "st.marystore",
    "qty": 1,
    "image": "/images/bodysuits.webp"
  },
  {
    "id": "caps-socks",
    "name": "Caps, socks & mittens",
    "desc": "A soft set for cooler evenings.",
    "category": "Clothing",
    "price": 5000,
    "vendor": "st.marystore",
    "qty": 5,
    "image": "/images/caps-socks.webp"
  },
  {
    "id": "wrappers",
    "name": "Baby wrappers",
    "desc": "Light shawls for carrying and cuddling.",
    "category": "Clothing",
    "price": 10000,
    "vendor": "st.marystore",
    "qty": 3,
    "image": "/images/wrappers.webp"
  },
  {
    "id": "bottles",
    "name": "Anti-colic bottles",
    "desc": "Starter set of three.",
    "category": "Feeding",
    "price": 18000,
    "vendor": "topnotch_babyshop2",
    "qty": 1,
    "image": "/images/bottles.webp"
  },
  {
    "id": "steriliser",
    "image": "/images/steriliser.webp",
    "name": "Bottle steriliser",
    "desc": "Electric steriliser and warmer.",
    "category": "Feeding",
    "price": 35000,
    "vendor": "topnotch_babyshop2",
    "qty": 1
  },
  {
    "id": "bottle-brush",
    "image": "/images/bottle-brush.webp",
    "name": "Bottle brush & drying rack",
    "desc": "Fits bottles and pump parts.",
    "category": "Feeding",
    "price": 9000,
    "vendor": "topnotch_babyshop2",
    "qty": 1
  },
  {
    "id": "nursing-pillow",
    "image": "/images/nursing-pillow.webp",
    "name": "Nursing pillow",
    "desc": "Supportive pillow with a washable cover.",
    "category": "Feeding",
    "price": 20000,
    "vendor": "topnotch_babyshop2",
    "qty": 1
  },
  {
    "id": "breast-pump",
    "image": "/images/breast-pump.webp",
    "name": "Breast pump",
    "desc": "A quiet electric pump.",
    "category": "Feeding",
    "price": 55000,
    "vendor": "topnotch_babyshop2",
    "qty": 1
  },
  {
    "id": "bibs-burp",
    "name": "Bibs & burp cloths",
    "desc": "Soft cotton set.",
    "category": "Feeding",
    "price": 6000,
    "vendor": "st.marystore",
    "qty": 5,
    "image": "/images/bibs-burp.webp"
  },
  {
    "id": "high-chair",
    "name": "High chair",
    "desc": "Easy-clean chair for the first solid meals.",
    "category": "Feeding",
    "price": 65000,
    "vendor": "topnotch_babyshop2",
    "qty": 1,
    "image": "/images/high-chair.webp"
  },
  {
    "id": "play-gym",
    "name": "Play gym",
    "desc": "Activity mat with hanging toys for tummy time.",
    "category": "Play & Books",
    "price": 30000,
    "vendor": "topnotch_babyshop2",
    "qty": 1,
    "image": "/images/play-gym.webp"
  },
  {
    "id": "bouncer",
    "name": "Baby bouncer",
    "desc": "A gentle rocker for short breaks.",
    "category": "Play & Books",
    "price": 45000,
    "vendor": "topnotch_babyshop2",
    "qty": 1,
    "image": "/images/bouncer.webp"
  },
  {
    "id": "rattle-set",
    "name": "Soft rattle set",
    "desc": "Gentle first toys for tiny hands.",
    "category": "Play & Books",
    "price": 8000,
    "vendor": "st.marystore",
    "qty": 3,
    "image": "/images/rattle-set.webp"
  },
  {
    "id": "board-books",
    "name": "Board book bundle",
    "desc": "Your favorite childhood stories. Add a note inside!",
    "category": "Play & Books",
    "price": 12000,
    "vendor": "st.marystore",
    "qty": 3,
    "image": "/images/board-books.webp"
  }
]
