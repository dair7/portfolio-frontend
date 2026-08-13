import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * The entrance animation for every section outside the hero — one
 * implementation, shared, so five sections cannot drift into five different
 * animations again.
 *
 * Put the returned ref on the <section> and the class `reveal-item` on each
 * element that should come in. They animate in DOM order.
 *
 * The hero is deliberately not a client of this hook: its boot sequence is a
 * one-off, and folding it in here would drag the console language back out
 * into the rest of the site.
 */
export function useSectionReveal<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null)

  // Layout effect, not effect: the hidden state has to land before the browser
  // paints, or deep-linking to a section flashes it in and then hides it.
  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('.reveal-item')
      if (items.length === 0) return

      // Hidden from JS rather than from the markup, so a bundle that fails to
      // run leaves a readable page behind instead of a blank one.
      gsap.set(items, { autoAlpha: 0, y: 16 })

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(items, { autoAlpha: 1, y: 0 })
        return
      }

      gsap.to(items, {
        autoAlpha: 1,
        y: 0,
        duration: 0.55,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: { trigger: root, start: 'top 75%', once: true },
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return ref
}
