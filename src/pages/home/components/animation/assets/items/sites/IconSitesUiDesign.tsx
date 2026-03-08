import { useId } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  thickness?: number
}

const IconSitesUiDesign: React.FC<IconProps> = ({ thickness = 0, ...props }) => {
  const filterId = `filter-${useId().replace(/:/g, '')}`

  return (
    <svg
      width="55"
      height="61"
      viewBox="0 0 55 61"
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
        <path d="M53.5 1H1V59.3333H53.5V1Z" stroke="currentColor" strokeWidth="2" />
        <path
          d="M1 53.3367L16.7004 40.9233L42.8338 59.3333M28.0346 9.75H9.74708M44.75 19.5033H9.75M53.5 28.8921H1M40.8271 36.4579C42.1073 36.4579 43.3351 36.9665 44.2403 37.8717C45.1456 38.777 45.6542 40.0048 45.6542 41.285C45.6542 42.5652 45.1456 43.793 44.2403 44.6983C43.3351 45.6035 42.1073 46.1121 40.8271 46.1121C39.5469 46.1121 38.3191 45.6035 37.4138 44.6983C36.5086 43.793 36 42.5652 36 41.285C36 40.0048 36.5086 38.777 37.4138 37.8717C38.3191 36.9665 39.5469 36.4579 40.8271 36.4579Z"
          stroke="currentColor"
          strokeWidth="2"
        />
      </g>
    </svg>
  )
}

export default IconSitesUiDesign
