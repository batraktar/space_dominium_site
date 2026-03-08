import { useId } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  thickness?: number
}

const IconRetailTesting: React.FC<IconProps> = ({ thickness = 0, ...props }) => {
  const filterId = `filter-${useId().replace(/:/g, '')}`

  return (
    <svg
      width="70"
      height="70"
      viewBox="0 0 70 70"
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
          d="M50.3125 20.125L44.625 14.4375L41.5625 17.5L50.3125 26.25L65.625 10.9375L62.5625 7.875L50.3125 20.125ZM26.25 11.8125L23.1875 8.75L17.5 14.4375L11.8125 8.75L8.75 11.8125L14.4375 17.5L8.75 23.1875L11.8125 26.25L17.5 20.5625L23.1875 26.25L26.25 23.1875L20.5625 17.5L26.25 11.8125ZM26.25 46.8125L23.1875 43.75L17.5 49.4375L11.8125 43.75L8.75 46.8125L14.4375 52.5L8.75 58.1875L11.8125 61.25L17.5 55.5625L23.1875 61.25L26.25 58.1875L20.5625 52.5L26.25 46.8125Z"
          fill="currentColor"
        />
        <path
          d="M37.1875 32.8125V4.375H32.8125V32.8125H4.375V37.1875H32.8125V65.625H37.1875V37.1875H65.625V32.8125H37.1875Z"
          fill="currentColor"
        />
      </g>
    </svg>
  )
}

export default IconRetailTesting
