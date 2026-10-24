import { config } from "@/config"

export const money = (n: number) => config.currency + n.toLocaleString("en-NG")
