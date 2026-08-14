import { useState, type FormEvent } from 'react'
import emailjs from '@emailjs/browser'
import { useSectionReveal } from '../hooks/useSectionReveal'

const SERVICE_ID  = 'TU_SERVICE_ID'
const TEMPLATE_ID = 'TU_TEMPLATE_ID'
const PUBLIC_KEY  = 'TU_PUBLIC_KEY'

// Shared by the three fields, so a border or a radius cannot drift on one of
// them. No `focus:outline-none`: the global :focus-visible ring in index.css is
// the only keyboard affordance these inputs have, and removing it left anyone
// tabbing through the form with nothing to follow.
const FIELD =
  'rounded-md border border-line bg-raised px-4 py-2.5 text-sm text-cream transition-colors duration-200 placeholder:text-muted/60 focus:border-amber/60'

const links = [
  {
    label: 'GitHub',
    href: 'https://github.com/dair7',
    description: 'See my code',
    icon: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    description: "Let's connect",
    icon: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Email',
    href: 'mailto:tu@email.com',
    description: 'Drop me a line',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
]

type Status = 'idle' | 'sending' | 'success' | 'error'

export default function Contact() {
  const [form, setForm] = useState({ from_name: '', from_email: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')
  const ref = useSectionReveal<HTMLElement>()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, form, { publicKey: PUBLIC_KEY })
      setStatus('success')
      setForm({ from_name: '', from_email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section ref={ref} id="contact" className="py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-14">
          <p className="reveal-item font-terminal text-xs tracking-[0.18em] text-amber uppercase">
            Contact
          </p>
          <h2 className="reveal-item mt-3 text-[clamp(30px,4vw,44px)] leading-tight font-semibold tracking-[-0.02em] text-cream">
            Let's talk
          </h2>
        </div>

        <div className="grid gap-14 md:grid-cols-2 md:gap-16">
          {/* Left: links, on the card pattern */}
          <div className="flex flex-col">
            <p className="reveal-item mb-8 text-[clamp(16px,1.1vw,18px)] leading-[1.7] text-cream">
              I'm open to freelance work, job opportunities, or just a chat about
              technology.
            </p>
            <div className="flex flex-col gap-4">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="reveal-item group flex items-center gap-4 rounded-xl border border-line bg-raised p-4 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-amber/40 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <span className="text-muted transition-colors group-hover:text-amber">
                    {link.icon}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-cream">{link.label}</p>
                    <p className="text-xs text-muted">{link.description}</p>
                  </div>
                  <svg className="ml-auto h-4 w-4 text-amber-faint transition-colors group-hover:text-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="reveal-item flex flex-col gap-1.5">
              <label htmlFor="contact-name" className="font-terminal text-xs tracking-[0.18em] text-muted uppercase">
                Name
              </label>
              <input
                id="contact-name"
                type="text"
                required
                value={form.from_name}
                onChange={(e) => setForm({ ...form, from_name: e.target.value })}
                placeholder="Your name"
                className={FIELD}
              />
            </div>

            <div className="reveal-item flex flex-col gap-1.5">
              <label htmlFor="contact-email" className="font-terminal text-xs tracking-[0.18em] text-muted uppercase">
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                required
                value={form.from_email}
                onChange={(e) => setForm({ ...form, from_email: e.target.value })}
                placeholder="you@email.com"
                className={FIELD}
              />
            </div>

            <div className="reveal-item flex flex-col gap-1.5">
              <label htmlFor="contact-message" className="font-terminal text-xs tracking-[0.18em] text-muted uppercase">
                Message
              </label>
              <textarea
                id="contact-message"
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="How can I help?"
                className={`${FIELD} resize-none`}
              />
            </div>

            {/* Confirmation is amber, not green: on this page amber already
                means "the thing you just did worked". A single cool green would
                be the only non-warm color on the site. */}
            {status === 'success' && (
              <p role="status" className="rounded-md border border-amber/30 bg-amber/10 px-4 py-2.5 text-sm text-amber">
                Message sent. I'll get back to you soon.
              </p>
            )}
            {status === 'error' && (
              <p role="alert" className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
                Something went wrong. Please try again.
              </p>
            )}

            {/* The page's one true primary action, so it is the one filled
                amber surface on the whole site. */}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="reveal-item mt-1 rounded-md bg-amber px-6 py-3 text-sm font-semibold text-bg transition-colors duration-200 hover:bg-amber-bright disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === 'sending' ? 'Sending…' : 'Send message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
