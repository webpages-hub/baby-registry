import { useEffect, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Add01Icon,
  Baby01Icon,
  HeartIcon,
  MinusSignIcon,
  SparklesIcon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Item } from "@/data/items"
import { NAME_KEY, TakenError } from "@/hooks/use-reservations"
import { money } from "@/lib/format"

type Props = {
  item: Item | null
  open: boolean
  session: number
  left: number
  onClose: () => void
  onReserve: (item: Item, name: string, qty: number) => Promise<void>
}

function useDesktop() {
  const q = "(min-width: 640px)"
  const [desktop, setDesktop] = useState(() => window.matchMedia(q).matches)
  useEffect(() => {
    const m = window.matchMedia(q)
    const on = () => setDesktop(m.matches)
    m.addEventListener("change", on)
    return () => m.removeEventListener("change", on)
  }, [])
  return desktop
}

export function ReserveDialog({ item, open, session, left, onClose, onReserve }: Props) {
  const desktop = useDesktop()
  const change = (o: boolean) => {
    if (!o) onClose()
  }

  // `session` changes every time Reserve is tapped, so the form starts fresh each time.
  const body = item ? (
    <ReserveBody key={session} item={item} left={left} onClose={onClose} onReserve={onReserve} desktop={desktop} />
  ) : null

  if (desktop) {
    return (
      <Dialog open={open} onOpenChange={change}>
        <DialogContent className="max-w-md gap-5 rounded-3xl p-7">{body}</DialogContent>
      </Dialog>
    )
  }
  return (
    <Drawer open={open} onOpenChange={change}>
      <DrawerContent className="px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">{body}</DrawerContent>
    </Drawer>
  )
}

function ReserveBody({
  item,
  left,
  onClose,
  onReserve,
  desktop,
}: Pick<Props, "left" | "onClose" | "onReserve"> & { item: Item; desktop: boolean }) {
  const [name, setName] = useState(() => {
    try {
      return localStorage.getItem(NAME_KEY) || ""
    } catch {
      return ""
    }
  })
  const [qty, setQty] = useState(1)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [done, setDone] = useState<{ first: string; qty: number } | null>(null)

  const Title = desktop ? DialogTitle : DrawerTitle
  const Description = desktop ? DialogDescription : DrawerDescription
  const Header = desktop ? DialogHeader : DrawerHeader
  const max = Math.max(1, left)
  const q = Math.min(qty, max)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const clean = name.trim().replace(/\s+/g, " ")
    if (clean.length < 3 || !clean.includes(" ")) {
      setError("Please enter your full name (first and last) so the parents know who to thank.")
      return
    }
    setError("")
    setBusy(true)
    try {
      await onReserve(item, clean, q)
      setDone({ first: clean.split(" ")[0], qty: q })
    } catch (err) {
      if (err instanceof TakenError) {
        setQty(1)
        setError(
          err.left <= 0
            ? "Someone just reserved the last one. Thank you for wanting to help!"
            : `Someone just reserved some of these. Only ${err.left} left now.`
        )
      } else {
        setError("We couldn't save that just now. Please check your connection and try again.")
      }
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    return (
      <div className="relative flex flex-col items-center gap-3 px-1 pt-2 pb-2 text-center">
        <HugeiconsIcon icon={HeartIcon} size={22} className="absolute top-4 left-[18%] animate-rise text-rose-400" />
        <HugeiconsIcon icon={SparklesIcon} size={20} className="absolute top-2 right-[20%] animate-rise text-teal [animation-delay:.2s]" />
        <HugeiconsIcon icon={HeartIcon} size={16} className="absolute top-12 right-[12%] animate-rise text-brown [animation-delay:.4s]" />
        <div className="grid size-20 place-items-center rounded-full bg-accent text-primary">
          <HugeiconsIcon icon={Baby01Icon} size={44} strokeWidth={1.5} />
        </div>
        <Header className="items-center gap-2 p-0 text-center">
          <Title className="font-display text-2xl font-bold text-brown">
            Thank you for the love, {done.first}!
          </Title>
          <Description className="text-base">
            You reserved {done.qty > 1 ? `${done.qty} × ` : ""}
            {item.name}. We&apos;re so grateful for your kindness and can&apos;t wait to celebrate with you.
          </Description>
        </Header>
        <Button size="lg" className="mt-2 h-11 w-full text-base" onClick={onClose}>
          Keep browsing
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-5">
      <Header className="items-center gap-1 p-0 text-center">
        <div className="mx-auto mb-1 grid size-14 place-items-center rounded-full bg-accent text-primary">
          <HugeiconsIcon icon={HeartIcon} size={28} strokeWidth={1.6} />
        </div>
        <Title className="font-display text-2xl font-bold text-brown">Reserve this gift</Title>
        <Description className="text-base font-semibold text-foreground">
          {item.name} · {money(item.price)}
        </Description>
      </Header>

      <div className="grid gap-2">
        <Label htmlFor="full-name" className="font-semibold">
          Your full name
        </Label>
        <Input
          id="full-name"
          autoComplete="name"
          placeholder="e.g. Ada Okafor"
          maxLength={80}
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setError("")
          }}
          aria-invalid={!!error}
          className="h-12 text-base"
        />
      </div>

      {left > 1 && (
        <div className="grid gap-2">
          <Label className="font-semibold">How many?</Label>
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1 rounded-full border bg-card p-1">
              <Button type="button" variant="secondary" size="icon" className="rounded-full" disabled={q <= 1} onClick={() => setQty(q - 1)} aria-label="One fewer">
                <HugeiconsIcon icon={MinusSignIcon} strokeWidth={2} />
              </Button>
              <output className="min-w-10 text-center font-display text-xl font-bold">{q}</output>
              <Button type="button" variant="secondary" size="icon" className="rounded-full" disabled={q >= max} onClick={() => setQty(q + 1)} aria-label="One more">
                <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
              </Button>
            </div>
            <span className="text-sm text-muted-foreground">{left} still needed</span>
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="rounded-2xl bg-destructive/10 px-4 py-2.5 text-sm font-semibold text-destructive">
          {error}
        </p>
      )}

      <div className="grid gap-2">
        <Button type="submit" size="lg" className="h-12 w-full text-base" disabled={busy}>
          {busy ? "Reserving…" : q > 1 ? `Reserve ${q}` : "Reserve"}
        </Button>
        <p className="text-center text-xs text-muted-foreground">The parents will see your name next to this gift.</p>
      </div>
    </form>
  )
}
