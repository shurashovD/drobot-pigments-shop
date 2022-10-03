import { FC } from "react"

interface IProps {
	stroke: string
}

const IconAccountSign: FC<IProps> = () => {
    return (
		<svg width="32" height="35" viewBox="0 0 32 35" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
			<circle cx="16" cy="16" r="15" fill="#F7DFB1" />
			<circle cx="16" cy="13" r="5" stroke="#39261F" />
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M8 26C9 18, 24 18, 25 26"
				stroke="#39261F"
			/>
		</svg>
	)
}

export default IconAccountSign

/*M15 21.7048C9.88902 21.7048 5 26.6432 5 32.7048H5.70693C5.70693 27.0315 10.2815 22.4117 16 22.4117C21.6732 22.4117 26.2931 26.9863 26.2931 32.7048H27C27 26.5938 22.0616 21.7048 16 21.7048Z */


