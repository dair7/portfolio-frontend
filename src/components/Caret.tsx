import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * Block cursor: terminals draw a filled cell, not a hairline.
 * It owns its blink so it keeps pulsing when it jumps to the next prompt.
 */
export default function Caret({ on }: { on: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!on || !el) return
    // A cursor that never stops is still a repeating animation.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const blink = gsap.to(el, {
      autoAlpha: 0,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: 'steps(1)',
    })
    return () => {
      blink.kill()
      gsap.set(el, { autoAlpha: 1 })
    }
  }, [on])

  if (!on) return null
  return (
    <span
      ref={ref}
      aria-hidden
      className="ml-[1px] inline-block h-[1.05em] w-[0.55em] translate-y-[0.18em] bg-amber"
    />
  )
}
