import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { HeartIcon } from "@hugeicons/core-free-icons"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Item } from "@/data/items"
import { CATEGORY_ICON, ITEM_ICON } from "@/lib/icons"
import { money } from "@/lib/format"
import { cn } from "@/lib/utils"

type Props = {
  item: Item
  left: number
  index: number
  onReserve: (item: Item) => void
}

export function ItemCard({ item, left, index, onReserve }: Props) {
  const [broken, setBroken] = useState(false)
  const done = left <= 0
  const taken = item.qty - left
  const Icon = ITEM_ICON[item.id] ?? CATEGORY_ICON[item.category]
  const small = item.image?.replace(/\.webp$/, "-400.webp")

  const CatIcon = CATEGORY_ICON[item.category]
  const tag = "h-6 gap-1 border-0 bg-background/90 px-2.5 text-xs font-semibold shadow-sm backdrop-blur-sm"

  return (
    <Card
      className="relative animate-pop gap-0 overflow-hidden pt-0 pb-0 shadow-sm transition-shadow hover:shadow-md"
      style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-accent to-secondary">
        <div className={cn("size-full", done && "opacity-60 grayscale-[40%]")}>
          {item.image && !broken ? (
            <img
              src={item.image}
              srcSet={small ? `${small} 400w, ${item.image} 800w` : undefined}
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 340px"
              width={800}
              height={600}
              alt={item.name}
              loading="lazy"
              decoding="async"
              onError={() => setBroken(true)}
              className="size-full object-cover transition-transform duration-500 group-hover/card:scale-105"
            />
          ) : (
            <div className="grid size-full place-items-center text-teal">
              <HugeiconsIcon icon={Icon} size={64} strokeWidth={1.3} />
            </div>
          )}
        </div>

        <Badge className={cn(tag, "absolute top-3 left-3 text-primary")}>
          <HugeiconsIcon icon={CatIcon} strokeWidth={2} />
          {item.category}
        </Badge>

        {done ? (
          <Badge className="absolute top-3 right-3 h-6 bg-primary px-3 text-xs text-primary-foreground shadow-sm">Reserved</Badge>
        ) : (
          item.priority === "most" && (
            <Badge className="absolute top-3 right-3 h-6 gap-1 bg-brown px-2.5 text-xs text-white shadow-sm">
              <HugeiconsIcon icon={HeartIcon} strokeWidth={2} className="text-rose-300" />
              Most wanted
            </Badge>
          )
        )}

        {item.qty > 1 && (
          <Badge className={cn(tag, "absolute right-3 bottom-3 text-sm text-brown tabular-nums")} aria-label={`${taken} of ${item.qty} reserved`}>
            {taken}/{item.qty}
          </Badge>
        )}
      </div>

      <CardHeader className="gap-1.5 pt-4">
        <CardTitle className="font-display text-xl leading-tight font-bold text-foreground">{item.name}</CardTitle>
        <CardDescription className="text-sm leading-snug">{item.desc}</CardDescription>
      </CardHeader>

      <CardContent className="mt-auto flex flex-col gap-3 pt-3">
        <div className="flex items-end justify-between gap-3">
          <span className="font-display text-2xl leading-none font-bold text-brown">{money(item.price)}</span>
          {(done || item.qty === 1) && (
            <span className={cn("text-xs font-semibold", done ? "text-muted-foreground" : "text-primary")}>
              {done ? "Fully reserved" : "Still needed"}
            </span>
          )}
        </div>
        {item.qty > 1 && <Progress value={(taken / item.qty) * 100} aria-label="Reserved so far" className="h-1.5" />}
        {item.vendor && (
          <p className="text-sm text-muted-foreground">
            See it on{" "}
            <a
              href={`https://www.instagram.com/${encodeURIComponent(item.vendor)}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary underline decoration-2 underline-offset-4 hover:text-brown"
            >
              @{item.vendor}
            </a>
          </p>
        )}
      </CardContent>

      <CardFooter className="pt-4 pb-5">
        <Button size="lg" className="h-11 w-full text-base" disabled={done} onClick={() => onReserve(item)}>
          {done ? "Reserved" : "Reserve"}
        </Button>
      </CardFooter>
    </Card>
  )
}
