interface Props {
  name: string
  iconUrl?: string | null
  size?: 'sm' | 'md'
}

export default function TechBadge({ name, iconUrl, size = 'sm' }: Props) {
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs text-gray-300 bg-gray-800 px-2.5 py-1 rounded-full border border-gray-700`}>
      {iconUrl && (
        <img
          src={iconUrl}
          alt={name}
          className={`${iconSize} object-contain`}
          loading="lazy"
        />
      )}
      {name}
    </span>
  )
}
