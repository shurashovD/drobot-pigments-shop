import { FC } from "react"

interface IProps {
	stroke: string
	width?: string
	height?: string
}

const IconAccount: FC<IProps> = ({ stroke, width = "30", height = "30" }) => {
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
				fillRule="evenodd"
				clipRule="evenodd"
				d="M9.74995 8.94729C9.74995 6.07691 12.0769 3.75 14.9472 3.75C17.8176 3.75 20.1445 6.07691 20.1445 8.94729C20.1445 11.8177 17.8176 14.1446 14.9472 14.1446C12.0769 14.1446 9.74995 11.8177 9.74995 8.94729ZM14.9472 3C11.6626 3 8.99995 5.66269 8.99995 8.94729C8.99995 12.2319 11.6626 14.8946 14.9472 14.8946C18.2318 14.8946 20.8945 12.2319 20.8945 8.94729C20.8945 5.66269 18.2318 3 14.9472 3ZM15 16.7047C8.88902 16.7047 4 21.6431 4 27.7048H4.70693C4.70693 22.0315 9.28149 17.4117 15 17.4117C20.6732 17.4117 25.2931 21.9862 25.2931 27.7048H26C26 21.5938 21.0616 16.7047 15 16.7047Z"
				fill={stroke}
			/>
		</svg>
	)
}

export default IconAccount


