import { cn } from '@/lib/utils'
import Link from 'next/link'

interface LogoProps {
  className?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
  href?: string | null
}

export function Logo({ className, showText = true, size = 'md', href = '/' }: LogoProps) {
  const sizes = {
    sm: { icon: 'w-10 h-10', text: 'text-lg' },
    md: { icon: 'w-14 h-14', text: 'text-xl' },
    lg: { icon: 'w-20 h-20', text: 'text-2xl' },
  }

  const content = (
    <>
      <div className={cn('relative', sizes[size].icon)}>
        <div className={cn('relative', sizes[size].icon, 'scale-125')}>
          <img
            src="/icon-light-32x32.png"
            alt="AI Career Hub Logo"
            className="absolute inset-0 w-full h-full object-contain block dark:hidden"
          />
          <img
            src="/icon-dark-32x32.png"
            alt="AI Career Hub Logo"
            className="absolute inset-0 w-full h-full object-contain hidden dark:block"
          />
        </div>
      </div>
      {showText && (
        <span className={cn('font-semibold text-foreground', sizes[size].text)}>
          AI Career Hub
        </span>
      )}
    </>
  )

  if (href === null) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        {content}
      </div>
    )
  }

  return (
    <Link href={href} className={cn('flex items-center gap-2', className)}>
      {content}
    </Link>
  )
}
