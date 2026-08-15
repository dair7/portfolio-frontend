import rawData from '../data/opensource.json'
import type { OpenSourceData } from '../types'
import { useSectionReveal } from '../hooks/useSectionReveal'

/**
 * Merged pull requests against other people's repositories.
 *
 * Nothing here is written by hand. `scripts/fetch-prs.ts` queries the GitHub
 * Search API during `prebuild` and regenerates `src/data/opensource.json`, and
 * a weekly GitHub Action redeploys so the list keeps up on its own. That is
 * also why the counts below are derived rather than typed: a hardcoded "14 PRs"
 * would be a lie the first time a new one lands.
 *
 * Rows are hairline-separated like Skills, not carded. These are links out —
 * fourteen cards would out-weigh the project grid above them, which is the part
 * of the page that should be heaviest.
 */
const DATA = rawData as OpenSourceData

// The list arrives sorted newest-first from the script; the API cannot sort by
// merge date, so that ordering is decided there and simply trusted here.
const { pullRequests, count } = DATA

const ORGANIZATION_COUNT = new Set(pullRequests.map((pr) => pr.organization)).size

// Both numbers move on their own every week, so the sentence has to survive
// landing on 1 without reading as a bug.
const SUMMARY =
  `${count} ${count === 1 ? 'PR' : 'PRs'} en ` +
  `${ORGANIZATION_COUNT} ${ORGANIZATION_COUNT === 1 ? 'organización' : 'organizaciones'}`

/** `2026-07-30T05:39:56Z` → `2026-07-30`, without touching the timezone. */
function toIsoDay(mergedAt: string): string {
  return mergedAt.slice(0, 10)
}

export default function OpenSource() {
  const ref = useSectionReveal<HTMLElement>()

  return (
    <section ref={ref} id="opensource" className="py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header — same three-part shape as every other section. */}
        <div className="mb-14">
          <p className="reveal-item font-terminal text-xs tracking-[0.18em] text-amber uppercase">
            Open Source
          </p>
          <h2 className="reveal-item mt-3 text-[clamp(30px,4vw,44px)] leading-tight font-semibold tracking-[-0.02em] text-cream">
            Contribuciones
          </h2>
          {count > 0 && (
            <p className="reveal-item mt-3 text-sm text-muted">{SUMMARY}</p>
          )}
        </div>

        {count === 0 && (
          <p className="reveal-item text-muted">No merged contributions yet.</p>
        )}

        {count > 0 && (
          /* A rule opens the list, one closes each row — the Skills sheet. */
          <div className="border-t border-line">
            {pullRequests.map((pr) => (
              <a
                key={pr.url}
                href={pr.url}
                target="_blank"
                rel="noopener noreferrer"
                className="reveal-item group grid grid-cols-[1fr_auto] items-baseline gap-x-4 gap-y-2 border-b border-line py-5 md:grid-cols-[6rem_1fr_auto] md:gap-x-6"
              >
                {/* The key of the row, not its content — mono and dim, exactly
                    like the category label in Skills. */}
                <span className="order-1 font-terminal text-[11px] tracking-[0.14em] text-amber-dim uppercase md:order-none">
                  {pr.organization}
                </span>

                {/* The row's actual content. On mobile it drops to its own line
                    and spans the full width: a PR title is far too long to
                    share a row with anything at that size. */}
                <span className="order-3 col-span-2 text-sm leading-snug text-cream transition-colors group-hover:text-amber-bright md:order-none md:col-span-1">
                  {pr.title}
                </span>

                {/* Date and the outbound marker travel together, so the right
                    edge of every row lines up on both layouts. */}
                <span className="order-2 flex items-center justify-end gap-2 md:order-none">
                  <time
                    dateTime={pr.mergedAt}
                    className="font-terminal text-[11px] text-muted tabular-nums"
                  >
                    {toIsoDay(pr.mergedAt)}
                  </time>
                  <svg
                    className="h-3.5 w-3.5 shrink-0 text-amber"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.75}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M14 5h5v5" />
                    <path d="M19 5l-7 7" />
                    <path d="M18 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4" />
                  </svg>
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
