import { useId } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  thickness?: number
}

const IconAppsCreativeConcepts: React.FC<IconProps> = ({ thickness = 0, ...props }) => {
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
          d="M43.75 30.625H8.75V8.75H43.75V30.625ZM39.375 13.125H13.125V26.25H39.375V13.125ZM70 21.875V56.875H30.625V52.5H65.625V26.25H52.5V39.375H26.25V48.125L21.875 43.75V39.375H0V0H52.5V21.875H70ZM48.125 4.375H4.375V35H48.125V4.375ZM15.8594 48.3301L26.626 59.0625L15.7227 69.9316L13.1934 67.4023L19.3115 61.25H13.125C11.3021 61.25 9.60449 60.9082 8.03223 60.2246C6.45996 59.541 5.06999 58.6068 3.8623 57.4219C2.65462 56.237 1.70898 54.847 1.02539 53.252C0.341797 51.6569 0 49.9479 0 48.125H4.375C4.375 49.3327 4.60286 50.4606 5.05859 51.5088C5.51432 52.557 6.14095 53.4912 6.93848 54.3115C7.736 55.1318 8.65885 55.7585 9.70703 56.1914C10.7552 56.6243 11.8945 56.8522 13.125 56.875H19.3115L13.3301 50.8594L15.8594 48.3301Z"
          fill="currentColor"
        />
      </g>
    </svg>
  )
}

export default IconAppsCreativeConcepts
