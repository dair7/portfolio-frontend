import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SKILL_CATEGORIES } from '../types'
import { SKILLS, CATEGORY_NOTES } from '../data/skills'

gsap.registerPlugin(ScrollTrigger)

/**
 * The stack as a spec sheet: one row per category, hairline rules between them,
 * the names set large. There is no bar, no percentage and no seniority label —
 * see `src/data/skills.ts` for why. With the fake metric gone the names are all
 * that is left, so the typography carries the row instead of a chart.
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
  const rootRef = useRef<HTMLElement>(null)

  // Layout effect, not effect: the initial hidden state has to land before the
  // browser paints, or a visitor deep-linking to #skills sees the whole sheet
  // flash into place and then hide itself to animate in.
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      // Hidden from JS rather than from the markup, so a failed bundle leaves a
      // readable section behind instead of a blank one.
      gsap.set('.spec-rule', { scaleX: 0 })
      gsap.set(['.spec-head', '.spec-key'], { autoAlpha: 0 })
      gsap.set('.spec-name', { autoAlpha: 0, y: 12 })

      if (reduced) {
        gsap.set('.spec-rule', { scaleX: 1 })
        gsap.set(['.spec-head', '.spec-key'], { autoAlpha: 1 })
        gsap.set('.spec-name', { autoAlpha: 1, y: 0 })
        return
      }

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: 'top 70%', once: true },
      })

      tl.to('.spec-head', {
        autoAlpha: 1,
        duration: 0.35,
        stagger: 0.1,
        ease: 'none',
      })

      if (GROUPED.length > 0) {
        const rows = gsap.utils.toArray<HTMLElement>('.spec-row')

        rows.forEach((row, i) => {
          // Absolute positions, so the rows overlap instead of queueing: the
          // sheet prints in one pass rather than as four separate reveals.
          const at = 0.35 + i * 0.14

          tl.to(
            row.querySelector('.spec-rule'),
            { scaleX: 1, duration: 0.5, ease: 'power2.out' },
            at
          )
            .to(
              row.querySelectorAll('.spec-key'),
              { autoAlpha: 1, duration: 0.3, ease: 'none' },
              at + 0.12
            )
            .to(
              row.querySelectorAll('.spec-name'),
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.45,
                stagger: 0.07,
                ease: 'power2.out',
              },
              at + 0.18
            )
        })

        tl.to(
          '.spec-rule-close',
          { scaleX: 1, duration: 0.5, ease: 'power2.out' },
          0.35 + rows.length * 0.14
        )
      }
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    /* No frame and no status bar: a second frame would read as a second
       monitor. This is the hero's screen, scrolled — same background, same
       scanlines, same amber. */
    <section
      ref={rootRef}
      id="skills"
      className="relative isolate overflow-hidden bg-bg py-24 font-terminal selection:bg-amber selection:text-bg md:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 opacity-[0.32]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to bottom, rgba(0,0,0,0.6) 0px, rgba(0,0,0,0.6) 1px, transparent 1px, transparent 3px)',
        }}
      />

      {/* 6vw gutter — the same one the navbar and the hero terminal sit on. */}
      <div className="relative z-10 px-[6vw]">
        {/* Header. The kicker borrows the status-bar treatment from the hero. */}
        <div className="mb-[6vh]">
          <p className="spec-head text-[clamp(10px,0.78vw,13px)] tracking-[0.12em] text-amber-dim uppercase">
            skills
          </p>
          <h2 className="spec-head mt-2 text-[clamp(28px,3.5vw,48px)] leading-tight font-bold tracking-tight text-amber-bright">
            My stack
          </h2>
        </div>

        {GROUPED.length === 0 && (
          <p className="spec-head text-amber-faint">No skills listed yet.</p>
        )}

        {GROUPED.map((group) => (
          <div key={group.value} className="spec-row">
            <div className="spec-rule h-px w-full origin-left bg-amber-faint" />

            <div className="grid gap-x-[3vw] gap-y-[1.2vh] py-[3.5vh] md:grid-cols-[minmax(8rem,13vw)_1fr]">
              {/* Left: the key. Small and dim — it labels the row, it is not
                  the content of the row. */}
              <div>
                <p className="spec-key text-[clamp(10px,0.78vw,13px)] tracking-[0.12em] text-amber-dim uppercase">
                  {group.label}
                </p>
                {group.note && (
                  <p className="spec-key mt-[0.9vh] text-[clamp(11px,0.85vw,14px)] leading-relaxed text-amber-faint">
                    {group.note}
                  </p>
                )}
              </div>

              {/* Right: the names, at full size. */}
              <div className="flex flex-wrap items-baseline gap-x-[2.5vw] gap-y-[0.8vh]">
                {group.items.map((skill) => (
                  /* Hover inverts to amber-on-black. It reads as the terminal
                     selection idiom (`selection:bg-amber` above), not as a
                     button — nothing here is clickable, so it must not promise
                     that it is. No pointer cursor for the same reason. */
                  <span
                    key={skill.id}
                    className="spec-name -mx-2 px-2 text-[clamp(24px,2.8vw,42px)] leading-[1.15] tracking-tight text-amber-bright transition-colors hover:bg-amber hover:text-bg motion-reduce:transition-none"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}

        {GROUPED.length > 0 && (
          <div className="spec-rule spec-rule-close h-px w-full origin-left bg-amber-faint" />
        )}
      </div>
    </section>
  )
}
