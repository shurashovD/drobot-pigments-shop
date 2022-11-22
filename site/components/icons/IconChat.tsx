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
			<g stroke={stroke}>
				<path d="M2 28L2 15C2 6 2 6 10 6L20 6C28 6 28 6 28 15L28 20C28 24 28 24 20 24L13 24C4 24 4 24 2 28" />
				<circle cx="7" cy="15" r="1" />
				<circle cx="15" cy="15" r="1" />
				<circle cx="23" cy="15" r="1" />
			</g>
		</svg>
	)
}

export default IconChat


