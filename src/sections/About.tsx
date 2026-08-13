import { useSectionReveal } from '../hooks/useSectionReveal'

const highlights = [
  { label: 'Backend', value: 'Java & Spring Boot' },
  { label: 'Frontend', value: 'React & TypeScript' },
  { label: 'Database', value: 'PostgreSQL' },
  { label: 'Focus', value: 'Clean Code & REST APIs' },
]

/**
 * Pilot for the page system: single background, sans for reading, mono only in
 * the kicker and small labels, amber strictly as accent — never as body text
 * or as a heading, so it never competes with the hero's name.
 */
export default function About() {
  const ref = useSectionReveal<HTMLElement>()

  return (
    /* No background of its own: it inherits the page. Sections are separated
       by spacing, not by an alternating fill. */
    <section ref={ref} id="about" className="py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header. The kicker is the one place mono appears in a section. */}
        <div className="mb-14">
          <p className="reveal-item font-terminal text-xs tracking-[0.18em] text-amber uppercase">
            About
          </p>
          <h2 className="reveal-item mt-3 text-[clamp(30px,4vw,44px)] leading-tight font-semibold tracking-[-0.02em] text-cream">
            A bit about me
          </h2>
        </div>

        <div className="grid gap-14 md:grid-cols-2 md:gap-16">
          {/* Left: reading column. Hierarchy comes from size, not from color —
              body copy is cream, full stop. */}
          <div>
            <p className="reveal-item text-[clamp(18px,1.35vw,21px)] leading-[1.6] text-cream">
              I'm a full stack developer who enjoys building products that pair a
              solid backend with modern, fast interfaces.
            </p>
            <p className="reveal-item mt-5 text-[clamp(16px,1.1vw,18px)] leading-[1.7] text-cream">
              I specialize in the Java ecosystem with Spring Boot for REST APIs,
              and on the frontend I work with React and TypeScript to build clean,
              functional user experiences.
            </p>
            <p className="reveal-item mt-5 text-[clamp(16px,1.1vw,18px)] leading-[1.7] text-cream">
              When I'm not coding, I'm usually learning something new or figuring
              out how to improve code I've already written.
            </p>

            {/* Secondary button: the section's one actionable element, so it is
                the only amber the eye is offered on hover. */}
            <a
              href="#contact"
              className="reveal-item group mt-9 inline-flex items-center gap-2 rounded-md border border-line px-5 py-2.5 text-[15px] font-medium text-cream transition-colors duration-200 hover:border-amber hover:text-amber motion-reduce:transition-none"
            >
              Let's talk
              <svg
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>

          {/* Right: the card pattern — raised surface, hairline border, 12px
              radius. No colored shadow, no glow. */}
          <div className="grid gap-4 self-start sm:grid-cols-2">
            {highlights.map((item) => (
              <div
                key={item.label}
                className="reveal-item rounded-xl border border-line bg-raised p-6 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-amber/40 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <p className="font-terminal text-xs tracking-[0.18em] text-muted uppercase">
                  {item.label}
                </p>
                <p className="mt-2 text-lg font-semibold text-cream">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
