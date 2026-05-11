'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface ScoreRingProps {
  score: number
  maxScore?: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  label?: string
  showPercentage?: boolean
  className?: string
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'destructive'
}

export function ScoreRing({
  score,
  maxScore = 100,
  size = 'md',
  label,
  showPercentage = true,
  className,
  color = 'primary',
}: ScoreRingProps | { score: number, size: number, strokeWidth?: number, showLabel?: boolean, className?: string, color?: any }) {
  const percentage = Math.round((score / (maxScore || 100)) * 100)
  
  const predefinedSizes: any = {
    sm: { container: 'w-16 h-16', stroke: 4, text: 'text-sm', label: 'text-[10px]' },
    md: { container: 'w-24 h-24', stroke: 6, text: 'text-xl', label: 'text-xs' },
    lg: { container: 'w-32 h-32', stroke: 8, text: 'text-2xl', label: 'text-sm' },
    xl: { container: 'w-40 h-40', stroke: 10, text: 'text-3xl', label: 'text-base' },
  }

  const isNumericSize = typeof size === 'number'
  const sizeStyles = isNumericSize 
    ? { container: '', stroke: (arguments[0] as any).strokeWidth || 4, text: 'text-lg', label: 'text-xs' }
    : predefinedSizes[size as string] || predefinedSizes.md

  const colors = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    success: 'text-success',
    warning: 'text-warning',
    destructive: 'text-destructive',
  }

  const strokeColors = {
    primary: 'stroke-primary',
    secondary: 'stroke-secondary',
    success: 'stroke-success',
    warning: 'stroke-warning',
    destructive: 'stroke-destructive',
  }

  const radius = 40
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div 
      className={cn('relative inline-flex items-center justify-center', sizeStyles.container, className)}
      style={isNumericSize ? { width: size, height: size } : {}}
    >
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth={sizeStyles.stroke}
          className="stroke-muted"
        />
        {/* Progress circle */}
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth={sizeStyles.stroke}
          strokeLinecap="round"
          className={strokeColors[color as keyof typeof strokeColors] || strokeColors.primary}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('font-bold', sizeStyles.text, colors[color as keyof typeof colors] || colors.primary)}>
          {showPercentage ? `${percentage}%` : score}
        </span>
        {label && (
          <span className={cn('text-muted-foreground', sizeStyles.label)}>
            {label}
          </span>
        )}
      </div>
    </div>
  )
}
