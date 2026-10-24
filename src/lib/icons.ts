import {
  Baby01Icon,
  BabyBedIcon,
  BabyBottleIcon,
  Bathtub01Icon,
  BreastPumpIcon,
  BrushCleaningIcon,
  Car01Icon,
  DiaperIcon,
  PillowIcon,
  Shirt01Icon,
  ShoppingBag01Icon,
  SparklesIcon,
  SyringeIcon,
  ToyBrickIcon,
} from "@hugeicons/core-free-icons"

import type { Category } from "@/data/items"

type IconData = typeof Baby01Icon

export const CATEGORY_ICON: Record<Category, IconData> = {
  Diapering: DiaperIcon,
  Nursery: BabyBedIcon,
  "Out & About": Car01Icon,
  "Bath & Care": Bathtub01Icon,
  Clothing: Shirt01Icon,
  Feeding: BabyBottleIcon,
  "Play & Books": ToyBrickIcon,
}

// Shown on the card for items that don't have a photo yet.
export const ITEM_ICON: Record<string, IconData> = {
  "nappy-bags": ShoppingBag01Icon,
  steriliser: SparklesIcon,
  "bottle-brush": BrushCleaningIcon,
  "nursing-pillow": PillowIcon,
  "breast-pump": BreastPumpIcon,
  "nasal-aspirator": SyringeIcon,
}

export const BABY_ICON = Baby01Icon
