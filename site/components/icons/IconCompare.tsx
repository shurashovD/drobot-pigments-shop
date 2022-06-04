import { FC } from "react"

interface IProps {
	stroke: string
}

const IconCompare: FC<IProps> = ({ stroke }) => {
    return (
		<svg
			width="30"
			height="30"
			viewBox="0 0 30 30"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
		>
			<path
				d="M12.9371 25.9999L12.9371 3H12.0314L12.0314 25.9999L12.9371 25.9999Z"
				fill={stroke}
			/>
			<path
				d="M7.90566 26L7.90566 16.5294H7V26L7.90566 26Z"
				fill={stroke}
			/>
			<path
				d="M17.9686 12.4705L17.9686 25.9999H17.0629V12.4705H17.9686Z"
				fill={stroke}
			/>
			<path
				d="M23 25.9998L23 7.05873H22.0943L22.0943 25.9998H23Z"
				fill={stroke}
			/>
		</svg>
	)
}

export default IconCompare


