import { useCallback, useEffect, useState } from "react"

import { config } from "@/config"
import type { Item } from "@/data/items"

type Counts = Record<string, number>
type Local = Record<string, { base: number; n: number; at?: number }>

const LOCAL_KEY = "registry_local"
// A reservation made on this device is counted straight away, but only until the shared sheet has had time
// to publish it. After that the sheet is the single source of truth (so cleared rows stay cleared).
const LOCAL_TTL_MS = 10 * 60 * 1000
export const NAME_KEY = "registry_name"

export class TakenError extends Error {
  left: number
  constructor(left: number) {
    super("taken")
    this.left = left
  }
}

const norm = (s: string) => s.trim().toLowerCase()
const withBust = (url: string) => url + (url.includes("?") ? "&" : "?") + "t=" + Date.now()
export const formConnected = !!(config.formResponseUrl && config.nameEntry && config.itemEntry)
const sheetConnected = !!(config.countsUrl || config.sheetCsvUrl)

function prune(local: Local): Local {
  const now = Date.now()
  const kept: Local = {}
  for (const [id, l] of Object.entries(local)) {
    if (l.at && now - l.at < LOCAL_TTL_MS) kept[id] = l
  }
  return Object.keys(kept).length === Object.keys(local).length ? local : kept
}

function save(local: Local) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(local))
  } catch {
    /* private mode: ignore */
  }
}

function readLocal(): Local {
  try {
    const stored = JSON.parse(localStorage.getItem(LOCAL_KEY) || "{}") || {}
    const kept = prune(stored)
    if (kept !== stored) save(kept)
    return kept
  } catch {
    return {}
  }
}

function parseCSV(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let cell = ""
  let q = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (q) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cell += '"'
          i++
        } else q = false
      } else cell += c
    } else if (c === '"') q = true
    else if (c === ",") {
      row.push(cell)
      cell = ""
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++
      row.push(cell)
      cell = ""
      rows.push(row)
      row = []
    } else cell += c
  }
  if (cell !== "" || row.length) {
    row.push(cell)
    rows.push(row)
  }
  return rows
}

// Live counts from the Apps Script web app (instant).
async function loadLive(): Promise<Counts> {
  const r = await fetch(withBust(config.countsUrl), { cache: "no-store" })
  if (!r.ok) throw new Error("counts " + r.status)
  const d = await r.json()
  if (!d || typeof d.counts !== "object") throw new Error("unexpected counts reply")
  const counts: Counts = {}
  for (const k of Object.keys(d.counts)) counts[norm(k)] = d.counts[k]
  return counts
}

// Fallback: the published CSV (Google can take a few minutes to refresh it).
async function loadCsv(): Promise<Counts> {
  const r = await fetch(withBust(config.sheetCsvUrl), { cache: "no-store" })
  if (!r.ok) throw new Error("sheet " + r.status)
  const rows = parseCSV(await r.text())
  if (!rows.length) return {}
  let col = rows[0].findIndex((h) => /item|gift/i.test(h))
  if (col < 0) col = Math.min(2, rows[0].length - 1)
  const counts: Counts = {}
  for (const row of rows.slice(1)) {
    const k = norm(row[col] || "")
    if (k) counts[k] = (counts[k] || 0) + 1
  }
  return counts
}

// Live counts first, then the published sheet; null if neither can be read.
async function fetchCounts(): Promise<Counts | null> {
  if (!sheetConnected) return null
  try {
    return config.countsUrl
      ? await loadLive().catch((e) => {
          console.warn("Live counts unavailable, using the published sheet:", e)
          if (!config.sheetCsvUrl) throw e
          return loadCsv()
        })
      : await loadCsv()
  } catch (e) {
    console.warn("Could not read reservations:", e)
    return null
  }
}

async function postToForm(item: Item, name: string) {
  if (!formConnected) return new Promise((res) => setTimeout(res, 700))
  const body = new URLSearchParams()
  body.append(config.nameEntry, name)
  body.append(config.itemEntry, item.name)
  // no-cors: Google Forms sends no CORS headers, so the reply is opaque but the response is saved.
  return fetch(config.formResponseUrl, { method: "POST", mode: "no-cors", body })
}

export function useReservations(items: Item[]) {
  const [sheet, setSheet] = useState<Counts>({})
  const [local, setLocal] = useState<Local>(readLocal)

  const sync = useCallback(async (): Promise<Counts | null> => {
    const counts = await fetchCounts()
    if (counts) setSheet(counts)
    return counts
  }, [])

  useEffect(() => {
    let alive = true
    const poll = () =>
      void fetchCounts().then((counts) => {
        if (!alive) return
        if (counts) setSheet(counts)
        setLocal((prev) => {
          const kept = prune(prev)
          if (kept !== prev) save(kept)
          return kept
        })
      })
    poll()
    const id = setInterval(poll, Math.max(15, config.refreshSeconds || 30) * 1000)
    return () => {
      alive = false
      clearInterval(id)
    }
  }, [])

  const reservedOf = useCallback(
    (item: Item, counts: Counts = sheet) => {
      const l = local[item.id]
      const fromLocal = l ? l.base + l.n : 0
      return Math.min(item.qty, Math.max(counts[norm(item.name)] ?? 0, fromLocal))
    },
    [sheet, local]
  )

  const remaining = useCallback((item: Item) => item.qty - reservedOf(item), [reservedOf])

  const reserve = useCallback(
    async (item: Item, name: string, qty: number) => {
      const fresh = (await sync()) ?? sheet
      const left = item.qty - reservedOf(item, fresh)
      if (left < qty) throw new TakenError(left)
      await Promise.all(Array.from({ length: qty }, () => postToForm(item, name)))
      // Count it right away; the shared sheet may take a moment to catch up.
      const next = { ...local, [item.id]: { base: reservedOf(item, fresh), n: qty, at: Date.now() } }
      setLocal(next)
      save(next)
      try {
        localStorage.setItem(NAME_KEY, name)
      } catch {
        /* private mode: ignore */
      }
    },
    [sync, sheet, local, reservedOf]
  )

  const total = items.reduce((a, i) => a + i.qty, 0)
  const taken = items.reduce((a, i) => a + reservedOf(i), 0)

  return { remaining, reservedOf, reserve, total, taken }
}
