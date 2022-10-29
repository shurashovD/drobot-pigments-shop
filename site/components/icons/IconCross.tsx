import { FC } from "react"

interface IProps {
	stroke: string
	width?: string
	height?: string
}

const IconCross: FC<IProps> = ({ stroke, width = "18", height = "18" }) => {
	return (
		<svg width={width} height={height} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
			<path d="M9 1.96875V16.0312" stroke={stroke} strokeWidth="0.9"/>
			<path d="M1.96875 9H16.0312" stroke={stroke} strokeWidth="0.9"/>
		</svg>
	)
}

export default IconCross


