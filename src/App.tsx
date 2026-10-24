import { lazy, Suspense, useMemo, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  BabyBottleIcon,
  GiftIcon,
  HeartIcon,
  ShoppingBag01Icon,
  Tag01Icon,
  Baby01Icon,
} from "@hugeicons/core-free-icons"

import { Filters, type Sort } from "@/components/filters"
import { Hero } from "@/components/hero"
import { ItemCard } from "@/components/item-card"
import { Card } from "@/components/ui/card"
import { config } from "@/config"
import { ITEMS, type Item } from "@/data/items"
import { formConnected, useReservations } from "@/hooks/use-reservations"

// Loaded the first time someone taps Reserve, so the first page load stays light.
const ReserveDialog = lazy(() =>
  import("@/components/reserve-dialog").then((m) => ({ default: m.ReserveDialog }))
)

const STEPS = [
  { icon: GiftIcon, title: "Pick & reserve", text: "Choose something that speaks to you and reserve it so nothing gets doubled up." },
  { icon: ShoppingBag01Icon, title: "Buy it anywhere", text: "The Instagram shops are just suggestions. Get it wherever you like." },
  { icon: Tag01Icon, title: "Prices are estimates", text: "They may differ from the shop." },
]

export function App() {
  const { remaining, reserve, total, taken } = useReservations(ITEMS)
  const [cat, setCat] = useState("all")
  const [availOnly, setAvailOnly] = useState(false)
  const [sort, setSort] = useState<Sort>("wanted")
  const [selected, setSelected] = useState<Item | null>(null)
  const [open, setOpen] = useState(false)
  const [session, setSession] = useState(0)
  const [dialogUsed, setDialogUsed] = useState(false)
  const pick = (item: Item) => {
    setDialogUsed(true)
    setSelected(item)
    setSession((n) => n + 1)
    setOpen(true)
  }

  const list = useMemo(() => {
    const order = new Map(ITEMS.map((i, idx) => [i.id, idx]))
    return ITEMS.filter((i) => {
      if (cat === "most" && i.priority !== "most") return false
      if (cat !== "all" && cat !== "most" && i.category !== cat) return false
      if (availOnly && remaining(i) <= 0) return false
      return true
    }).sort((a, b) => {
      const ra = remaining(a) <= 0 ? 1 : 0
      const rb = remaining(b) <= 0 ? 1 : 0
      if (ra !== rb) return ra - rb // fully reserved go last
      if (sort === "low") return a.price - b.price
      if (sort === "high") return b.price - a.price
      const pa = a.priority === "most" ? 0 : 1
      const pb = b.priority === "most" ? 0 : 1
      if (pa !== pb) return pa - pb // most wanted first
      return (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0)
    })
  }, [cat, availOnly, sort, remaining])

  return (
    <div className="min-h-svh overflow-x-clip">
      <main>
        <Hero taken={taken} total={total} />

        <section id="list" className="mx-auto max-w-6xl px-4 pt-10">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold text-brown [text-shadow:2px_2px_0_rgb(159_208_202/.55)] md:text-5xl">
              The wish list
            </h2>
            <ul className="mt-6 grid gap-3 text-left md:grid-cols-3">
              {STEPS.map((s) => (
                <li key={s.title}>
                  <Card className="h-full flex-row items-start gap-3 rounded-3xl p-4 shadow-none">
                    <HugeiconsIcon icon={s.icon} size={34} strokeWidth={1.4} className="mt-0.5 shrink-0 text-brown" />
                    <div>
                      <p className="font-display text-lg leading-tight font-bold text-primary">{s.title}</p>
                      <p className="mt-0.5 text-sm leading-snug text-muted-foreground">{s.text}</p>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          </div>

          <Filters cat={cat} onCat={setCat} availOnly={availOnly} onAvail={setAvailOnly} sort={sort} onSort={setSort} />

          <p className="mt-3 mb-4 text-sm text-muted-foreground" aria-live="polite">
            {list.length} {list.length === 1 ? "gift" : "gifts"}
          </p>

          {list.length === 0 ? (
            <div className="grid place-items-center gap-3 py-16 text-center text-muted-foreground">
              <HugeiconsIcon icon={Baby01Icon} size={56} strokeWidth={1.3} className="text-teal" />
              <p>Nothing here with those filters. Try another category.</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((item, i) => (
                <ItemCard key={item.id} item={item} left={remaining(item)} index={i} onReserve={pick} />
              ))}
            </div>
          )}
        </section>

        <section className="mx-auto mt-14 max-w-xl px-4">
          <Card className="items-center gap-2 rounded-[2rem] border-dashed border-primary/30 px-6 py-8 text-center shadow-none">
            <HugeiconsIcon icon={HeartIcon} size={28} strokeWidth={1.6} className="text-rose-400" />
            <h3 className="text-2xl font-bold text-brown">Sending a gift</h3>
            <p className="text-muted-foreground">
              Gifts can be brought along to the shower. Reach out if you have any questions.
            </p>
            <p className="mt-2 font-display text-lg font-semibold text-primary">With love, {config.parents}</p>
          </Card>
        </section>
      </main>

      <footer className="px-4 pt-10 pb-12 text-center text-sm text-muted-foreground">
        <div className="mb-3 flex justify-center gap-4 text-teal/70" aria-hidden>
          <HugeiconsIcon icon={Baby01Icon} size={22} strokeWidth={1.5} />
          <HugeiconsIcon icon={HeartIcon} size={22} strokeWidth={1.5} />
          <HugeiconsIcon icon={BabyBottleIcon} size={22} strokeWidth={1.5} />
        </div>
        <p>
          Photos from{" "}
          <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline underline-offset-4">
            Unsplash
          </a>
          .
        </p>
        {!formConnected && (
          <p className="mt-1">Preview mode: the Google Form is not connected yet, so reservations are only saved on this device.</p>
        )}
      </footer>

      {dialogUsed && (
        <Suspense fallback={null}>
          <ReserveDialog
            item={selected}
            open={open}
            session={session}
            left={selected ? remaining(selected) : 0}
            onClose={() => setOpen(false)}
            onReserve={reserve}
          />
        </Suspense>
      )}
    </div>
  )
}

export default App
