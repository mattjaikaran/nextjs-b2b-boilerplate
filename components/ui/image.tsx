import NextImage from "next/image"
import {
  useState,
  useRef,
  type ReactNode,
  type SyntheticEvent,
  type CSSProperties,
  type ImgHTMLAttributes,
} from "react"
import { cn } from "@/lib/utils"

type ImageLayout = "responsive" | "fill" | "fixed" | "intrinsic"
type ImagePlaceholder = "skeleton" | "blur" | "none"
type ImageRounded = false | "sm" | "md" | "lg" | "full"
type LoadStatus = "loading" | "loaded" | "error"

interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "placeholder"> {
  src: string
  alt: string
  layout?: ImageLayout
  aspectRatio?: string
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down"
  objectPosition?: string
  placeholder?: ImagePlaceholder
  blurDataURL?: string
  priority?: boolean
  fallbackSrc?: string
  fallback?: ReactNode
  rounded?: ImageRounded
  wrapperClassName?: string
}

const roundedMap: Record<Exclude<ImageRounded, false>, string> = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
}

function Image({
  src,
  alt,
  layout = "responsive",
  aspectRatio,
  objectFit = "cover",
  objectPosition = "center",
  placeholder = "none",
  blurDataURL,
  priority = false,
  fallbackSrc,
  fallback,
  rounded = false,
  wrapperClassName,
  className,
  width,
  height,
  style,
  onLoad,
  onError,
  ...props
}: ImageProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  // Track whether we've fallen back to fallbackSrc on error
  const [usedFallback, setUsedFallback] = useState(false)
  const [status, setStatus] = useState<LoadStatus>("loading")

  // Compute currentSrc at render time — no derived useState
  const currentSrc = usedFallback && fallbackSrc ? fallbackSrc : src

  // Reset fallback state when src changes
  const prevSrcRef = useRef(src)
  if (src !== prevSrcRef.current) {
    prevSrcRef.current = src
    setUsedFallback(false)
    const nextStatus = imgRef.current?.complete ? "loaded" : "loading"
    setStatus(nextStatus)
  }

  function handleLoad(e: SyntheticEvent<HTMLImageElement>) {
    setStatus("loaded")
    onLoad?.(e)
  }

  function handleError(e: SyntheticEvent<HTMLImageElement>) {
    if (fallbackSrc && !usedFallback) {
      setUsedFallback(true)
    } else {
      setStatus("error")
    }
    onError?.(e)
  }

  const isLoading = status === "loading"
  const isError = status === "error"
  const roundedClass = rounded ? roundedMap[rounded] : ""

  if (isError && fallback) {
    return <>{fallback}</>
  }

  const wrapperStyle: CSSProperties = {}
  const imgStyle: CSSProperties = { objectFit, objectPosition, ...style }

  if (layout === "fill") {
    wrapperStyle.position = "absolute"
    wrapperStyle.inset = 0
    imgStyle.width = "100%"
    imgStyle.height = "100%"
  } else if (layout === "fixed") {
    wrapperStyle.display = "inline-block"
    wrapperStyle.position = "relative"
    if (width) wrapperStyle.width = width
    if (height) wrapperStyle.height = height
    imgStyle.width = width
    imgStyle.height = height
  } else if (layout === "intrinsic") {
    wrapperStyle.display = "inline-block"
    wrapperStyle.position = "relative"
    wrapperStyle.maxWidth = "100%"
    if (width) imgStyle.width = width
    if (height) imgStyle.height = height
  } else {
    wrapperStyle.position = "relative"
    wrapperStyle.width = "100%"
    if (aspectRatio) {
      wrapperStyle.aspectRatio = aspectRatio
    } else if (width && height) {
      wrapperStyle.aspectRatio = `${width}/${height}`
    }
    imgStyle.width = "100%"
    imgStyle.height = "100%"
  }

  const showSkeleton = isLoading && placeholder === "skeleton"
  const showBlur = isLoading && placeholder === "blur" && Boolean(blurDataURL)

  return (
    <span
      className={cn("block overflow-hidden", roundedClass, wrapperClassName)}
      style={wrapperStyle}
    >
      {showSkeleton && (
        <span
          className={cn("absolute inset-0 animate-pulse bg-muted", roundedClass)}
        />
      )}
      {showBlur && blurDataURL && (
        <NextImage
          src={blurDataURL}
          aria-hidden
          alt=""
          fill
          unoptimized
          className={cn("absolute inset-0 scale-110 blur-xl", roundedClass)}
          style={{ objectFit }}
        />
      )}
      <NextImage
        ref={imgRef as React.Ref<HTMLImageElement>}
        src={currentSrc}
        alt={alt}
        width={width ? Number(width) : undefined}
        height={height ? Number(height) : undefined}
        fill={!width && !height}
        priority={priority}
        unoptimized
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          roundedClass,
          className,
        )}
        style={imgStyle}
        {...(props as object)}
      />
    </span>
  )
}

interface AvatarImageProps extends Omit<ImageProps, "layout" | "rounded" | "objectFit"> {
  size?: number
}

function AvatarImage({ size = 40, width, height, ...props }: AvatarImageProps) {
  return (
    <Image
      layout="fixed"
      rounded="full"
      objectFit="cover"
      width={width ?? size}
      height={height ?? size}
      {...props}
    />
  )
}

function HeroImage(
  props: Omit<ImageProps, "layout" | "aspectRatio" | "priority" | "objectFit">,
) {
  return (
    <Image
      layout="responsive"
      aspectRatio="16/9"
      priority
      objectFit="cover"
      {...props}
    />
  )
}

function ThumbnailImage(
  props: Omit<ImageProps, "layout" | "aspectRatio" | "rounded" | "objectFit">,
) {
  return (
    <Image
      layout="responsive"
      aspectRatio="16/9"
      rounded="md"
      objectFit="cover"
      {...props}
    />
  )
}

export { Image, AvatarImage, HeroImage, ThumbnailImage }
export type { ImageProps, AvatarImageProps }
