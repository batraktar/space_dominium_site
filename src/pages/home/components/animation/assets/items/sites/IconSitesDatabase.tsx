import { useId } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  thickness?: number
}

const IconSitesDatabase: React.FC<IconProps> = ({ thickness = 0, ...props }) => {
  const filterId = `filter-${useId().replace(/:/g, '')}`

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
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
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M4 6a8 3 0 1 0 16 0a8 3 0 1 0 -16 0" />
        <path d="M4 6v6a8 3 0 0 0 16 0v-6" />
        <path d="M4 12v6a8 3 0 0 0 16 0v-6" />
      </g>
    </svg>
  )
}

export default IconSitesDatabase
