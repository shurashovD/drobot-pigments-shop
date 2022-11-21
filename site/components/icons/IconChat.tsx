import { FC } from "react"

interface IProps {
	width?: number
	height?: number
	stroke: string
	strokeWidth?: number
}

const IconChat: FC<IProps> = ({ height = 30, width = 30, stroke, strokeWidth = 0 }) => {
    return (
		<svg
			width={width}
			height={height}
			viewBox="0 0 30 30"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
		>
			<path 
				d="M2 28L2 10C2 2 2 2 10 2L20 2C28 2 28 2 28 10L28 20C28 28 28 28 20 28Z"
				stroke={stroke}
				strokeWidth={0.6}
			/>
		</svg>
	)
}

export default IconChat


