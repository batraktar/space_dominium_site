import React from 'react'
import type { CSSProperties, PropsWithChildren } from 'react'
import './dots-bg.scss'

type Props = PropsWithChildren<{
  bgColor?: string // фон під крапками
  dotColor?: string // колір крапок
  className?: string
  style?: CSSProperties
}>

const DotsBg: React.FC<Props> = ({
  bgColor = '#7E6AF6',
  dotColor = 'rgba(255,255,255,.5)',
  className = '',
  style,
  children,
}) => {
  // не фіксуємо розміри тут — усе у SCSS через змінні
  const base =
    'radial-gradient(circle at var(--r) var(--r), var(--dot) 0 var(--r), transparent calc(var(--r) + 0.1px))'

  type DotsBgCssVars = CSSProperties & {
    '--bg': string
    '--dot': string
  }

  const vars: DotsBgCssVars = {
    ...style,
    '--bg': bgColor,
    '--dot': dotColor,
  }

  return (
    <div className={`dots-bg ${className}`} style={vars}>
      {/* шар дрібних крапок */}
      <div
        className="dots-bg__layer"
        aria-hidden
        style={{
          backgroundColor: 'var(--bg)' as unknown as string,
          backgroundImage: `${base}, ${base}`,
          backgroundSize: 'var(--step-x) var(--step-y), var(--step-x) var(--step-y)',
          backgroundPosition: `
            var(--off-x) var(--off-y),
            calc(var(--off-x) + (var(--step-x)/2))
            calc(var(--off-y) + (var(--step-y)/2))
          `,
        }}
      />
      <div className="dots-bg__content">{children}</div>
    </div>
  )
}

export default DotsBg
