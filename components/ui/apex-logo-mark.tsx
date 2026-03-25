import Image from 'next/image'
import { BRAND_IMAGE_SRC } from '@/lib/constants'
import { cn } from '@/lib/utils/cn'

type ApexLogoMarkProps = {
  className?: string
  priority?: boolean
}

export function ApexLogoMark({ className, priority = false }: ApexLogoMarkProps) {
  return (
    <span
      className={cn(
        'relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full shadow-glow-sm ring-1 ring-[rgba(var(--color-primary-rgb),0.15)]',
        className
      )}
    >
      <Image
        src={BRAND_IMAGE_SRC}
        alt="APEX"
        width={32}
        height={32}
        className="h-full w-full object-cover"
        priority={priority}
        sizes="32px"
      />
    </span>
  )
}
