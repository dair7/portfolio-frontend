import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Caret from '../components/Caret'

gsap.registerPlugin(ScrollTrigger)

const CMD_ABOUT = 'cat -n about.md'

/**
 * The section is a single file dumped to the terminal, so the highlights are
 * this file's YAML frontmatter rather than a second command: one `cat`, one
 * continuous set of line numbers. `blank` lines are numbered too — `cat -n`
 * numbers every line, and skipping them would give the gutter away.
 */
type Line =
  | { kind: 'rule' }
  | { kind: 'meta'; key: string; value: string }
  | { kind: 'blank' }
  | { kind: 'text'; text: string }

const ABOUT_MD: Line[] = [
  { kind: 'rule' },
  { kind: 'meta', key: 'backend', value: 'Java & Spring Boot' },
  { kind: 'meta', key: 'frontend', value: 'React & TypeScript' },
  { kind: 'meta', key: 'database', value: 'PostgreSQL' },
  { kind: 'meta', key: 'focus', value: 'Clean Code & REST APIs' },
  { kind: 'rule' },
  { kind: 'blank' },
  {
    kind: 'text',
    text: "I'm a full stack developer who enjoys building products that pair a solid backend with modern, fast interfaces.",
  },
  { kind: 'blank' },
  {
    kind: 'text',
    text: 'I specialize in the Java ecosystem with Spring Boot for REST APIs, and on the frontend I work with React and TypeScript to build clean, functional user experiences.',
  },
  { kind: 'blank' },
  {
    kind: 'text',
    text: "When I'm not coding, I'm usually learning something new or figuring out how to improve code I've already written.",
  },
]

export default function About() {
  const rootRef = useRef<HTMLElement>(null)

  const [typed, setTyped] = useState('')
  const [caret, setCaret] = useState<'cmd' | 'none' | 'idle'>('cmd')

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      // The output is in the DOM from the start so the block never reflows
      // while it paints; the timeline only uncovers it.
      gsap.set(['.file-line', '.about-reveal'], { autoAlpha: 0 })

      if (reduced) {
        setTyped(CMD_ABOUT)
        setCaret('idle')
        gsap.set(['.file-line', '.about-reveal'], { autoAlpha: 1 })
        return
      }

      const type = (text: string, setter: (value: string) => void, cps = 26) => {
        const cursor = { at: 0 }
        return gsap.to(cursor, {
          at: text.length,
          duration: text.length / cps,
          ease: 'none',
          onUpdate: () => setter(text.slice(0, Math.floor(cursor.at))),
          onComplete: () => setter(text),
        })
      }

      gsap
        .timeline({
          scrollTrigger: { trigger: root, start: 'top 65%', once: true },
        })
        .add(type(CMD_ABOUT, setTyped))
        // The command has run: the cursor leaves the prompt until it returns.
        .call(() => setCaret('none'), undefined, '+=0.2')
        .to('.file-line', {
          autoAlpha: 1,
          duration: 0.1,
          stagger: 0.055,
          ease: 'none',
        })
        .to('.about-cta', { autoAlpha: 1, duration: 0.15, ease: 'none' }, '+=0.25')
        .to('.about-prompt', { autoAlpha: 1, duration: 0.15, ease: 'none' })
        .call(() => setCaret('idle'))
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    /* No frame and no status bar on purpose: a second frame would read as a
       second screen. This is the hero's screen, scrolled — same background,
       same scanlines, same 6vw gutter as the navbar. */
    <section
      ref={rootRef}
      id="about"
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

      <div className="relative z-10 px-[6vw] text-[clamp(14px,1.05vw,17px)] leading-[1.9]">
        {/* The heading is the command. Screen readers get the plain label. */}
        <h2 className="mb-[3vh] text-[clamp(16px,1.5vw,22px)] leading-[1.6]">
          <span className="sr-only">About me</span>
          <span aria-hidden className="break-all text-amber">
            <span className="mr-2 text-amber-faint select-none">$</span>
            {typed}
            <Caret on={caret === 'cmd'} />
          </span>
        </h2>

        {/* --- file dump: frontmatter and prose share one numbering run --- */}
        <div className="max-w-[76ch]">
          {ABOUT_MD.map((line, i) => (
            <div key={i} className="file-line flex gap-4">
              {/* Gutter is decoration: hidden from AT and from copied text. */}
              <span
                aria-hidden
                className="w-[3ch] shrink-0 text-right tabular-nums text-amber-faint select-none"
              >
                {i + 1}
              </span>

              {/* Wrapped text gets no number, exactly like a real terminal. */}
              <div className="min-w-0 flex-1">
                {line.kind === 'rule' && <p className="text-amber-faint">---</p>}

                {line.kind === 'meta' && (
                  <p className="text-amber-dim">
                    <span className="inline-block w-[11ch]">{line.key}:</span>
                    <span className="text-amber-bright">{line.value}</span>
                  </p>
                )}

                {line.kind === 'text' && (
                  <p className="text-amber-dim">{line.text}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* --- the prompt returns: CTA as a runnable command --- */}
        <div className="mt-[4vh] flex flex-col items-start">
          <a
            href="#contact"
            className="about-reveal about-cta group -mx-2 flex items-center px-2 text-amber outline-none hover:bg-amber hover:text-bg focus-visible:bg-amber focus-visible:text-bg"
          >
            <span className="mr-2 text-amber-faint select-none group-hover:text-bg group-focus-visible:text-bg">
              $
            </span>
            ./contact
          </a>

          <p className="about-reveal about-prompt mt-1 text-amber">
            <span className="mr-2 text-amber-faint select-none">$</span>
            <Caret on={caret === 'idle'} />
          </p>
        </div>
      </div>
    </section>
  )
}
