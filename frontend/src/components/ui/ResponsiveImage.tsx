interface ResponsiveImageProps {
  src: string
  alt: string
  className?: string
  loading?: 'lazy' | 'eager'
  sizes?: string
  onClick?: () => void
}

/**
 * Generates srcset for Unsplash images with multiple widths
 * Unsplash supports dynamic image resizing via URL parameters
 */
function generateUnsplashSrcSet(src: string): string | undefined {
  // Only generate srcset for Unsplash images
  if (!src.includes('images.unsplash.com')) {
    return undefined
  }

  // Remove existing width parameter to add our own
  const baseUrl = src.replace(/[?&]w=\d+/, '').replace(/&&/g, '&')
  const separator = baseUrl.includes('?') ? '&' : '?'

  const widths = [400, 600, 800, 1200, 1600]
  return widths
    .map(w => `${baseUrl}${separator}w=${w} ${w}w`)
    .join(', ')
}

export default function ResponsiveImage({
  src,
  alt,
  className = '',
  loading = 'lazy',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  onClick
}: ResponsiveImageProps) {
  const srcSet = generateUnsplashSrcSet(src)

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      loading={loading}
      className={className}
      onClick={onClick}
    />
  )
}
