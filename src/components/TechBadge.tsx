interface Props {
  name: string
  iconUrl?: string | null
  size?: 'sm' | 'md'
  /** `muted` for metadata on a card, `strong` when the tag *is* the content. */
  tone?: 'muted' | 'strong'
}

/**
 * The tag primitive — shared by the project cards, the project modal and the
 * skills sheet, so a technology name is printed the same way everywhere.
 *
 * Mono here is deliberate and narrow: a tag is a label, like the section
 * kickers and the card labels in About. Reading text stays in sans.
 */
export default function TechBadge({
  name,
  iconUrl,
  size = 'sm',
  tone = 'muted',
}: Props) {
  const box =
    size === 'sm'
      ? 'gap-1.5 px-2.5 py-1 text-[11px]'
      : 'gap-2 px-3 py-1.5 text-[13px]'
  const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'
  const text = tone === 'strong' ? 'text-cream' : 'text-muted'

  return (
    <span
      className={`inline-flex items-center rounded-md border border-line bg-raised font-terminal tracking-[0.02em] ${box} ${text}`}
    >
      {/* Decorative: the name is right there as text, so the icon must not be
          announced a second time. */}
      {iconUrl && (
        <img
          src={iconUrl}
          alt=""
          className={`${iconSize} object-contain`}
          loading="lazy"
        />
      )}
      {name}
    </span>
  )
}
