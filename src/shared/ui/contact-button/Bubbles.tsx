import React from 'react'
import './bubbles.scss'

export type BubbleKeys = `b${1 | 2 | 3 | 4 | 5}`

type Props = {
  bubbleContent?: Partial<Record<BubbleKeys, React.ReactNode>>
}

const Bubbles: React.FC<Props> = ({ bubbleContent = {} }) => {
  return (
    <div className="fg-bubbles" aria-hidden={false}>
      {Array.from({ length: 5 }, (_, i) => {
        const key = `b${i + 1}` as BubbleKeys
        return (
          <div key={key} className={`bubble ${key}`}>
            <div className="bubble__content">{bubbleContent[key]}</div>
          </div>
        )
      })}
    </div>
  )
}

export default Bubbles
