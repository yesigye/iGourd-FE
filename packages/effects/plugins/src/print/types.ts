export type IdString = string

export type PrintStandard = 'strict' | 'loose' | 'html5'

export interface PrintOptions {
  /** Element selector (id or CSS selector). Example: '#printArea' */
  ids?: string
  /** Unique id for iframe or print area (auto if omitted) */
  id?: string
  /** HTML standards doctype */
  standard?: PrintStandard
  /** Additional <link rel="stylesheet"> hrefs or raw string of tags to include into <head> */
  extraCss?: string | string[]
  /** Raw HTML to append into <head> (e.g., meta, style links) */
  extraHead?: string
  /** Inline style string injected into <style> (in head) */
  styleString?: string
  /** Title used in <title> (and preview header when relevant) */
  popTitle?: string
  /** Higher overlay order for preview box */
  zIndex?: number
  /** Enable preview UI instead of printing immediately */
  preview?: boolean
  /** Preview panel title */
  previewTitle?: string
  /** Preview print button text */
  previewPrintBtnLabel?: string
  /** If provided, print content is loaded from this URL in the iframe */
  url?: string
  /** If provided, will be called to get async content (string HTML or URL) */
  asyncUrl?: (done: (content: string) => void) => void

  /** Pagination toggle: if false, no extra page breaks are enforced */
  paginate?: boolean
  /** Global break-inside control (fallback when no selectors provided) */
  breakInside?: 'auto' | 'avoid'
  /** Specific selectors to apply break-inside rule */
  breakInsideSelectors?: string | string[]
  /** Copy all <style> tags from current <head> into print head (default: true) */
  includeHeadStyles?: boolean

  /** Thermal receipt mode: roll paper (58/80mm). If true, auto sizes one long page */
  receipt?: boolean
  /** Paper width in mm (common: 58 or 80). Default 58 */
  paperWidthMm?: number
  /** Page height upper bound in mm to avoid browser limit (≈ 200in). Default 5000 */
  maxPageHeightMm?: number
  /** Page margins in mm (default 0 for receipts) */
  marginsMm?: { top:number; right:number; bottom:number; left:number }
  /** Add extra padding at bottom (px) to avoid last line being cut by drivers */
  bleedFixPx?: number
  /** Force single super-long page for PDF/print (otherwise browser paginates) */
  onePage?: boolean

  /** Lifecycle callbacks */
  beforeOpenCallback?: () => void
  openCallback?: () => void
  closeCallback?: () => void
  previewBeforeOpenCallback?: () => void
  previewOpenCallback?: () => void

  /** Reserved: Vue instance (injected by directive with binding.instance) */
  vue?: any
}
