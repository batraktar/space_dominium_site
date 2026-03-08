import { useId } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  thickness?: number
}

const IconAppsLandingAds: React.FC<IconProps> = ({ thickness = 0, ...props }) => {
  const filterId = `filter-${useId().replace(/:/g, '')}`

  return (
    <svg
      width="62"
      height="50"
      viewBox="0 0 62 50"
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
          d="M61.25 0L58.45 0.820312L8.33875 16.065H0V33.565H8.34094L12.6459 34.8644L12.5803 35.0678V35.1378C11.1759 39.7578 13.7769 44.8941 18.5959 46.3466C18.6178 46.3531 18.6441 46.34 18.6616 46.3466C23.3056 47.7575 28.4462 45.1872 29.8747 40.3309L29.9403 40.1253L58.45 48.8097L61.25 49.6278V0ZM56.875 5.88V43.75L9.3625 29.2556L9.09344 29.19H4.375V20.44H9.09125L9.36469 20.3744L56.875 5.88ZM16.8153 36.1616L25.7709 38.8303L25.7053 39.0337V39.0994C24.9528 41.6588 22.2359 42.91 19.8953 42.1772C17.3359 41.4269 16.0191 38.7778 16.7497 36.435V36.3694L16.8153 36.1616Z"
          fill="currentColor"
        />
      </g>
    </svg>
  )
}

export default IconAppsLandingAds
