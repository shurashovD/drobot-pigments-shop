import { FC } from "react"

interface IProps {
	stroke: string
	backStroke?: string
	width?: string
	height?: string
}

const IconFavourite: FC<IProps> = ({ stroke, backStroke = "transparent", width = "30", height = "30" }) => {
	return (
		<svg
			width={width}
			height={height}
			viewBox="0 0 30 30"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
		>
			<path d="M15 26C14 26, 2 15, 2 7C2 0, 15 0, 15 7M15 26C16 26, 28 15, 28 7C28 0, 15 0, 15 7" stroke={backStroke} strokeWidth={3} />
			<path d="M15 26C14 26, 2 15, 2 7C2 0, 15 0, 15 7M15 26C16 26, 28 15, 28 7C28 0, 15 0, 15 7" stroke={stroke} fill={backStroke} />
		</svg>
	)
}

export default IconFavourite


