/**
 * Payload mínimo que se serializa a Base64 para compartir via URL (?cfg=).
 * Formato: btoa(JSON.stringify(payload))
 *
 * Campo `s` — esquema:
 *   - Preset: "24x48" | "12x36" | "12x24" | "48x48"
 *   - Custom: "C{workHours}:{restHours}" (ej: "C12:24")
 */
export interface SharedConfigPayload {
  s: string // scheme
  e: string // entryTime "HH:mm"
  d: string // cycleStartDate "YYYY-MM-DD"
  c: string // color "#RRGGBB"
}
