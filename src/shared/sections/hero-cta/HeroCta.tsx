import React from 'react'
import './hero-cta.scss'

type HeroCtaProps = {
  text: React.ReactNode
  ctaLabel: string

  /** опціональні параметри, які можна міняти при вставці */
  gradient?: string
  textColor?: string
  btnTextSizePx?: number
  btnTextColor?: string
  btnBg?: string
}

export default function HeroCta({
  text,
  ctaLabel,
  gradient,
  textColor,
  btnTextSizePx,
  btnTextColor,
  btnBg,
}: HeroCtaProps) {
  type HeroCtaCssVars = React.CSSProperties & {
    '--talk-bg'?: string
    '--talk-text-color'?: string
    '--talk-btn-size'?: string
    '--talk-btn-color'?: string
    '--talk-btn-bg'?: string
  }

  const style: HeroCtaCssVars = {
    ...(gradient ? { '--talk-bg': gradient } : {}),
    ...(textColor ? { '--talk-text-color': textColor } : {}),
    ...(btnTextSizePx ? { '--talk-btn-size': `${btnTextSizePx}px` } : {}),
    ...(btnTextColor ? { '--talk-btn-color': btnTextColor } : {}),
    ...(btnBg ? { '--talk-btn-bg': btnBg } : {}),
  }

  return (
    <div className="talk-container">
      <div className="talk-body" style={style}>
        <p className="talk-text">{text}</p>
        <button className="talk-btn">{ctaLabel}</button>
      </div>
    </div>
  )
}
