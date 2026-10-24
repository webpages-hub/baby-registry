import { HugeiconsIcon } from "@hugeicons/react"
import { GridViewIcon, HeartIcon } from "@hugeicons/core-free-icons"

import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { CATEGORIES, ITEMS } from "@/data/items"
import { CATEGORY_ICON } from "@/lib/icons"

export type Sort = "wanted" | "low" | "high"

type Props = {
  cat: string
  onCat: (v: string) => void
  availOnly: boolean
  onAvail: (v: boolean) => void
  sort: Sort
  onSort: (v: Sort) => void
}

const chip =
  "h-10 gap-2 rounded-full border-border bg-card px-4 text-sm font-semibold text-brown shadow-none " +
  "hover:bg-accent data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"

export function Filters({ cat, onCat, availOnly, onAvail, sort, onSort }: Props) {
  const most = ITEMS.filter((i) => i.priority === "most").length
  const count = (c: string) => ITEMS.filter((i) => i.category === c).length

  return (
    <div className="sticky top-0 z-30 -mx-4 bg-background/90 px-4 pt-3 pb-2 backdrop-blur-md md:rounded-b-3xl">
      <div className="-mx-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <ToggleGroup
          type="single"
          value={cat}
          onValueChange={(v) => onCat(v || "all")}
          variant="outline"
          spacing={2}
          className="w-max"
          aria-label="Filter by category"
        >
          <ToggleGroupItem value="all" className={chip}>
            <HugeiconsIcon icon={GridViewIcon} size={18} strokeWidth={2} />
            All
            <Count n={ITEMS.length} />
          </ToggleGroupItem>
          <ToggleGroupItem value="most" className={chip}>
            <HugeiconsIcon icon={HeartIcon} size={18} strokeWidth={2} />
            Most wanted
            <Count n={most} />
          </ToggleGroupItem>
          {CATEGORIES.map((c) => (
            <ToggleGroupItem key={c} value={c} className={chip}>
              <HugeiconsIcon icon={CATEGORY_ICON[c]} size={18} strokeWidth={2} />
              {c}
              <Count n={count(c)} />
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2.5">
          <Switch id="avail" checked={availOnly} onCheckedChange={onAvail} />
          <Label htmlFor="avail" className="cursor-pointer text-sm font-semibold whitespace-nowrap text-brown">
            Still needed only
          </Label>
        </div>
        <Select value={sort} onValueChange={(v) => onSort(v as Sort)}>
          <SelectTrigger className="h-10 w-[10.5rem] bg-card text-sm font-semibold text-brown sm:w-[11.5rem]" aria-label="Sort by">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="wanted">Most wanted first</SelectItem>
            <SelectItem value="low">Price: low to high</SelectItem>
            <SelectItem value="high">Price: high to low</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

function Count({ n }: { n: number }) {
  return (
    <Badge variant="secondary" className="h-5 min-w-5 px-1.5 text-xs">
      {n}
    </Badge>
  )
}
