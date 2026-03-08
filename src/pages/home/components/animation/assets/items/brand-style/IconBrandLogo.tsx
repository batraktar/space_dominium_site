import { useId } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  thickness?: number
}

const IconBrandLogo: React.FC<IconProps> = ({ thickness = 0, ...props }) => {
  const filterId = `filter-${useId().replace(/:/g, '')}`

  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {thickness > 0 && (
        <defs>
          <filter id={filterId}>
            <feMorphology operator="erode" radius={thickness} in="SourceGraphic" />
          </filter>
        </defs>
      )}
      <g filter={thickness > 0 ? `url(#${filterId})` : undefined}>
        <path
          d="M18.5 40.375C18.5 46.1766 20.8047 51.7406 24.907 55.843C29.0094 59.9453 34.5734 62.25 40.375 62.25C46.1766 62.25 51.7406 59.9453 55.843 55.843C59.9453 51.7406 62.25 46.1766 62.25 40.375C62.25 34.5734 59.9453 29.0094 55.843 24.907C51.7406 20.8047 46.1766 18.5 40.375 18.5C34.5734 18.5 29.0094 20.8047 24.907 24.907C20.8047 29.0094 18.5 34.5734 18.5 40.375Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M41.8333 1H1V41.8333H41.8333V1Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  )
}

export default IconBrandLogo
