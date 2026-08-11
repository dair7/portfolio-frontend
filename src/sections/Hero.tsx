import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import Caret from '../components/Caret'
import AsciiRuntime from '../components/AsciiRuntime'

const CMD_PROFILE = 'curl -s api.dair.dev/v1/profile | jq'
const CMD_NAME = "curl -s api.dair.dev/v1/profile | jq -r '.name, .role'"

const PROFILE = {
  name: 'Dair Guerrero',
  role: 'Full Stack Developer',
  stack: ['Java', 'Spring Boot', 'React', 'TypeScript'],
  basedIn: 'remote',
  available: true,
}

const COMMANDS = [
  { label: './view-projects', href: '#projects', external: false },
  { label: './contact', href: '#contact', external: false },
  { label: './github', href: 'https://github.com/dair7', external: true },
]

const pad = (n: number) => String(n).padStart(2, '0')

const formatUptime = (total: number) =>
  `${pad(Math.floor(total / 3600))}:${pad(Math.floor(total / 60) % 60)}:${pad(total % 60)}`

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  const [typedProfile, setTypedProfile] = useState('')
  const [typedName, setTypedName] = useState('')
  const [caret, setCaret] = useState<'profile' | 'name' | 'idle'>('profile')
  const [uptime, setUptime] = useState(0)

  // Session clock, ticking from the moment the hero mounts.
  useEffect(() => {
    const id = window.setInterval(() => setUptime((s) => s + 1), 1000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      // Everything is in the DOM from the start so the terminal never reflows
      // mid-sequence; the timeline only reveals it.
      gsap.set(['.reveal', '.json-line', '.name-bloom'], { autoAlpha: 0 })

      if (reduced) {
        setTypedProfile(CMD_PROFILE)
        setTypedName(CMD_NAME)
        setCaret('idle')
        gsap.set(['.reveal', '.json-line'], { autoAlpha: 1 })
        gsap.set('.name-bloom', { autoAlpha: 0.45 })
        // The band only reads as a refresh artifact while it travels.
        gsap.set('.crt-sweep', { autoAlpha: 0 })
        return
      }

      // Continuous CRT ambience, independent of the boot sequence.
      gsap.to('.crt-screen', {
        opacity: 0.965,
        duration: 0.09,
        repeat: -1,
        repeatDelay: 3.2,
        yoyo: true,
        ease: 'steps(1)',
      })

      // Driven in percentages of the screen, so the band crosses the whole
      // viewport at any height instead of stalling partway down.
      gsap.fromTo(
        '.crt-sweep',
        { top: '-15%' },
        { top: '115%', duration: 7.5, repeat: -1, ease: 'none' }
      )

      const type = (text: string, setter: (value: string) => void, cps = 30) => {
        const cursor = { at: 0 }
        return gsap.to(cursor, {
          at: text.length,
          duration: text.length / cps,
          ease: 'none',
          onUpdate: () => setter(text.slice(0, Math.floor(cursor.at))),
          onComplete: () => setter(text),
        })
      }

      const tl = gsap.timeline({ delay: 0.4 })
      timelineRef.current = tl

      tl.add(type(CMD_PROFILE, setTypedProfile))
        .to('.json-line', {
          autoAlpha: 1,
          duration: 0.12,
          stagger: 0.07,
          ease: 'none',
        })
        .call(() => setCaret('name'), undefined, '+=0.35')
        .add(type(CMD_NAME, setTypedName))
        .call(() => setCaret('idle'))
        .to('.reveal-name', { autoAlpha: 1, duration: 0.18, ease: 'none' }, '+=0.15')
        // Phosphor flare: the glow overshoots, then settles into a steady burn.
        .fromTo(
          '.name-bloom',
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.14, ease: 'none' },
          '<'
        )
        .to('.name-bloom', { autoAlpha: 0.45, duration: 0.9, ease: 'power2.out' })
        .to('.reveal-role', { autoAlpha: 1, duration: 0.2, ease: 'none' }, '-=0.75')
        // The runner has been looping since mount; it only becomes visible here.
        .to('.reveal-ascii', { autoAlpha: 1, duration: 0.5, ease: 'none' }, '-=0.6')
        .to(
          '.reveal-cmd',
          { autoAlpha: 1, duration: 0.15, stagger: 0.09, ease: 'none' },
          '-=0.5'
        )
        .to('.reveal-prompt', { autoAlpha: 1, duration: 0.15, ease: 'none' })
        .to('.reveal-scroll', { autoAlpha: 1, duration: 0.4, ease: 'none' }, '-=0.1')
    }, root)

    // A visitor who starts interacting should not wait out the intro.
    const skip = () => timelineRef.current?.progress(1)
    root.addEventListener('pointerdown', skip)
    window.addEventListener('keydown', skip)

    return () => {
      root.removeEventListener('pointerdown', skip)
      window.removeEventListener('keydown', skip)
      ctx.revert()
    }
  }, [])

  return (
    /* `isolate` keeps the CRT layers in their own stacking context, so they can
       never outrank the fixed navbar or leak over the next section. */
    <section
      ref={rootRef}
      id="hero"
      className="relative isolate h-dvh overflow-hidden bg-bg font-terminal selection:bg-amber selection:text-bg"
    >
      {/* --- CRT glass: vignette, scanlines, drifting refresh band --- */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-30"
        style={{ boxShadow: 'inset 0 0 200px 50px rgba(0,0,0,0.95)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-30 opacity-[0.32]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to bottom, rgba(0,0,0,0.6) 0px, rgba(0,0,0,0.6) 1px, transparent 1px, transparent 3px)',
        }}
      />
      <div
        aria-hidden
        className="crt-sweep pointer-events-none absolute inset-x-0 top-0 z-20 h-24 bg-amber opacity-[0.035] blur-2xl"
      />

      {/* The screen fills the viewport; the frame is inset, not floated.
          Frame at 2vw + inner 4vw puts every line of text on the same 6vw
          gutter the navbar uses. `pt-16` clears the navbar, `pb` the scroll hint. */}
      <div className="crt-screen relative z-10 flex h-full flex-col px-[2vw] pt-16 pb-10">
        <div className="flex min-h-0 flex-1 flex-col border border-amber-faint">
          {/* Status bar — no macOS traffic lights on purpose */}
          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-amber-faint px-[4vw] py-2.5 text-[clamp(10px,0.78vw,13px)] tracking-[0.12em] text-amber-dim uppercase">
            <span className="truncate">dair@portfolio:~</span>
            <span className="shrink-0 tabular-nums">
              uptime <span className="text-amber">{formatUptime(uptime)}</span>
            </span>
          </div>

          {/* Output area. Four blocks pushed apart by `justify-between`, so the
              sequence owns the full height instead of huddling at the top.
              Every size clamps on width AND height, so the whole boot sequence
              still fits a short window — no inner scrollbar, ever. */}
          <div className="grid min-h-0 flex-1 gap-[3vw] overflow-hidden px-[4vw] py-[3vh] text-[clamp(13px,min(1.05vw,2.35vh),17px)] leading-[1.7] min-[1000px]:grid-cols-[1fr_auto]">
            {/* Left column: the boot sequence, still four blocks pushed apart. */}
            <div className="flex min-h-0 flex-col justify-between">
              {/* --- 1. live-typed request + its payload --- */}
              <div>
                <p className="break-all text-amber">
                  <span className="mr-2 text-amber-faint select-none">$</span>
                  {typedProfile}
                  <Caret on={caret === 'profile'} />
                </p>

                {/* --- 2. JSON payload, highlighted in amber tints only --- */}
                <div className="mt-[1.4vh] text-amber-dim">
                  <p className="json-line text-amber-faint">{'{'}</p>
                  <p className="json-line pl-4">
                    "role"<span className="text-amber-faint">: </span>
                    <span className="text-amber-bright">"{PROFILE.role}"</span>
                    <span className="text-amber-faint">,</span>
                  </p>
                  <p className="json-line pl-4">
                    "stack"<span className="text-amber-faint">: [</span>
                    {PROFILE.stack.map((tech, i) => (
                      <span key={tech}>
                        <span className="text-amber-bright">"{tech}"</span>
                        {i < PROFILE.stack.length - 1 && (
                          <span className="text-amber-faint">, </span>
                        )}
                      </span>
                    ))}
                    <span className="text-amber-faint">],</span>
                  </p>
                  <p className="json-line pl-4">
                    "based_in"<span className="text-amber-faint">: </span>
                    <span className="text-amber-bright">"{PROFILE.basedIn}"</span>
                    <span className="text-amber-faint">,</span>
                  </p>
                  <p className="json-line pl-4">
                    "available"<span className="text-amber-faint">: </span>
                    <span className="text-amber">{String(PROFILE.available)}</span>
                  </p>
                  <p className="json-line text-amber-faint">{'}'}</p>
                </div>
              </div>

              {/* --- 3. second request --- */}
              <p className="break-all text-amber">
                <span className="mr-2 text-amber-faint select-none">$</span>
                {typedName}
                <Caret on={caret === 'name'} />
              </p>

              {/* --- 4. raw output: the payoff. Driven by viewport width so it
                  dominates instead of tracking the body copy; the 11.5vh term only
                  kicks in on short windows, where 8vw would overflow. --- */}
              <div>
                <div className="relative">
                  <span
                    aria-hidden
                    className="name-bloom pointer-events-none absolute inset-0 text-[clamp(48px,min(8vw,11.5vh),96px)] leading-[1.02] font-bold tracking-tight text-amber blur-[28px]"
                  >
                    {PROFILE.name}
                  </span>
                  <h1
                    className="reveal reveal-name relative text-[clamp(48px,min(8vw,11.5vh),96px)] leading-[1.02] font-bold tracking-tight text-amber-bright"
                    style={{
                      textShadow:
                        '0 0 30px rgba(255,179,0,0.65), 0 0 90px rgba(255,179,0,0.3)',
                    }}
                  >
                    {PROFILE.name}
                  </h1>
                </div>
                <h2 className="reveal reveal-role mt-[1.2vh] text-[clamp(15px,min(1.5vw,3.4vh),22px)] text-amber-dim">
                  {PROFILE.role}
                </h2>
              </div>

              {/* --- 5. CTAs as runnable commands; hover = reverse video --- */}
              <div className="flex flex-col items-start">
                {COMMANDS.map(({ label, href, external }) => (
                  <a
                    key={label}
                    href={href}
                    {...(external
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    className="reveal reveal-cmd group -mx-2 flex items-center px-2 text-amber outline-none hover:bg-amber hover:text-bg focus-visible:bg-amber focus-visible:text-bg"
                  >
                    <span className="mr-2 text-amber-faint select-none group-hover:text-bg group-focus-visible:text-bg">
                      $
                    </span>
                    {label}
                  </a>
                ))}

                {/* Prompt left waiting for the next command */}
                <p className="reveal reveal-prompt mt-1 text-amber">
                  <span className="mr-2 text-amber-faint select-none">$</span>
                  <Caret on={caret === 'idle'} />
                </p>
              </div>
            </div>

            {/* Right column: the idle half of the screen, running a character
                buffer. `auto` so it claims only the width its 40 cols need. */}
            <AsciiRuntime className="reveal reveal-ascii hidden self-center min-[1000px]:block" />
          </div>
        </div>
      </div>

      {/* Scroll indicator — anchored to the section, not to the content block */}
      <a
        href="#about"
        aria-label="Scroll to about"
        className="reveal reveal-scroll absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1.5 text-amber-faint transition-colors hover:text-amber"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase">scroll</span>
        <svg
          className="h-4 w-4 animate-bounce"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </a>
    </section>
  )
}
