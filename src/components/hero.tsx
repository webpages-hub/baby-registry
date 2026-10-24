import { HugeiconsIcon } from "@hugeicons/react"
import {
  Baby01Icon,
  BalloonsIcon,
  HeartIcon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

type Props = { taken: number; total: number }

export function Hero({ taken, total }: Props) {
  const pct = total ? Math.round((taken / total) * 100) : 0

  return (
    <section className="relative mx-auto grid max-w-6xl gap-8 px-5 pt-[50px] pb-6 md:grid-cols-[1.05fr_.95fr] md:items-center md:gap-12 md:pt-[148px]">
      {/* a few gentle accents */}
      <HugeiconsIcon icon={BalloonsIcon} size={34} strokeWidth={1.4} aria-hidden className="absolute top-6 right-[6%] hidden animate-float text-teal/60 md:block" />
      <HugeiconsIcon icon={HeartIcon} size={22} strokeWidth={1.6} aria-hidden className="absolute top-24 right-[44%] hidden animate-float text-rose-300 [animation-delay:-2s] md:block" />
      <HugeiconsIcon icon={Baby01Icon} size={30} strokeWidth={1.4} aria-hidden className="absolute bottom-2 left-[3%] hidden animate-float text-brown/40 [animation-delay:-4s] md:block" />

      <div className="flex flex-col items-center text-center md:items-start md:text-left">
        <h1 className="text-[clamp(2rem,6.4vw,3.25rem)] leading-[1.1] font-extrabold tracking-tight [text-shadow:2px_2px_0_rgb(159_208_202/.55)]">
          <span className="block text-primary">A Tiny Heartbeat.</span>
          <span className="block text-brown">A Growing Family.</span>
          <span className="block text-primary">A Whole Lot of Love.</span>
        </h1>
        <p className="mt-5 max-w-[46ch] text-base leading-relaxed font-medium text-muted-foreground">
          We are so grateful for the love and support already surrounding our growing family. This list
          gathers the things we will reach for most in those first sleepy months. Thank you for being
          part of the welcome.
        </p>
        <Button asChild size="lg" className="mt-6 h-12 px-8 text-base">
          <a href="#list">Browse the registry</a>
        </Button>
      </div>

      <Card className="mx-auto w-full max-w-md gap-0 border-primary/15 py-0 shadow-lg shadow-primary/10 md:max-w-[440px]">
        <CardContent className="grid gap-4 p-6">
          <div className="flex items-center gap-3">
            <div className="flex flex-1 items-baseline justify-between gap-3">
              <span className="font-semibold text-primary">Gifts reserved</span>
              <span className="font-display text-3xl leading-none font-bold text-primary" aria-live="polite">
                {taken} of {total}
              </span>
            </div>
          </div>
          <div className="relative pt-3">
            <Progress value={pct} aria-label="Gifts reserved" className="h-4 bg-accent" />
            <div
              className="absolute top-0 -translate-x-1/2 transition-all duration-700"
              style={{ left: `clamp(14px, ${pct}%, calc(100% - 14px))` }}
              aria-hidden
            >
              <HugeiconsIcon icon={Baby01Icon} size={26} strokeWidth={1.8} className="rounded-full bg-card p-0.5 text-brown shadow" />
            </div>
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            {pct === 0
              ? "0% of the list is taken care of."
              : pct >= 100
                ? "Everything is taken care of. Thank you!"
                : `${pct}% of the list is taken care of.`}
          </p>
        </CardContent>
      </Card>
    </section>
  )
}
