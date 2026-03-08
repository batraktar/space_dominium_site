import { useId } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  thickness?: number
}

const IconSitesFrontendLayout: React.FC<IconProps> = ({ thickness = 0, ...props }) => {
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
          d="M31.6338 62.25V1M31.6338 31.625H60.8004M1 5.375V57.875C1 59.0353 1.46094 60.1481 2.28141 60.9686C3.10188 61.7891 4.21468 62.25 5.375 62.25H57.875C59.0353 62.25 60.1481 61.7891 60.9686 60.9686C61.7891 60.1481 62.25 59.0353 62.25 57.875V5.375C62.25 4.21468 61.7891 3.10188 60.9686 2.28141C60.1481 1.46094 59.0353 1 57.875 1H5.375C4.21468 1 3.10188 1.46094 2.28141 2.28141C1.46094 3.10188 1 4.21468 1 5.375Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  )
}

export default IconSitesFrontendLayout
