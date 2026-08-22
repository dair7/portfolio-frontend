import { SKILL_CATEGORIES } from '../types'
import { SKILLS, CATEGORY_NOTES } from '../data/skills'
import TechBadge from '../components/TechBadge'
import { useSectionReveal } from '../hooks/useSectionReveal'

/**
 * The stack as a spec sheet, rebuilt on the page system: one row per category,
 * hairline rules between them, the names as tags.
 *
 * The rows survived from the amber version; the console did not. Names set at
 * 42px in mono made this a second hero — it out-shouted the one at the top of
 * the page and turned a list of six words into the loudest thing on the site.
 * Tags are the honest size for what this is: an index, not a headline.
 *
 * There is still no bar, no percentage and no seniority label — see
 * `src/data/skills.ts` for why.
 *
 * TODO — revisit "used in N projects", derived from PROJECTS in
 * `src/data/projects.ts`: unlike a percentage it IS objective, and a reader can
 * click through and check it. It has to wait, because three of the four entries
 * in the catalog are still marked ⚠️ PLACEHOLDER, and counting invented
 * projects would just be the progress bars again with better manners.
 */
const GROUPED = SKILL_CATEGORIES.map((cat) => ({
  value: cat.value,
  label: cat.label,
  note: CATEGORY_NOTES[cat.value],
  items: SKILLS.filter((s) => s.category === cat.value),
})).filter((g) => g.items.length > 0)

export default function Skills() {
  const ref = useSectionReveal<HTMLElement>()

  return (
    /* No frame, no scanlines and no background of its own — it inherits the
       page like every other section. */
    <section ref={ref} id="skills" className="py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-14">
          <p className="reveal-item font-terminal text-xs tracking-[0.18em] text-amber uppercase">
            Skills
          </p>
          <h2 className="reveal-item mt-3 text-[clamp(30px,4vw,44px)] leading-tight font-semibold tracking-[-0.02em] text-cream">
            My stack
          </h2>
        </div>

        {GROUPED.length === 0 && (
          <p className="reveal-item text-muted">No skills listed yet.</p>
        )}

        {GROUPED.length > 0 && (
          /* The sheet: a rule opens it, one closes each row. Structure comes
             from the rules and the two-column split, not from color.

             The measurements are not chosen here — they are copied from the
             rows in `src/sections/OpenSource.tsx`, the other hairline list on
             the page: 11rem key column, 1.5rem gutter, py-5. They used to
             differ (14rem, 2.5rem, py-10), which left a hand's width of empty
             page between a label and the two tags belonging to it and made
             two lists built on the same idea look unrelated. */
          <div className="border-t border-line">
            {GROUPED.map((group) => (
              <div
                key={group.value}
                className="reveal-item grid gap-x-6 gap-y-3 border-b border-line py-5 md:grid-cols-[11rem_minmax(0,1fr)]"
              >
                {/* Left: the key. Mono and dim — it labels the row, it is not
                    the content of the row. */}
                <div className="md:pt-1.5">
                  <p className="font-terminal text-xs tracking-[0.18em] text-muted uppercase">
                    {group.label}
                  </p>
                  {group.note && (
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {group.note}
                    </p>
                  )}
                </div>

                {/* Right: the names. Nothing here is clickable, so nothing here
                    behaves like a button — no hover, no pointer cursor. */}
                <div className="flex flex-wrap items-start gap-2">
                  {group.items.map((skill) => (
                    <TechBadge key={skill.id} name={skill.name} size="md" tone="strong" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
