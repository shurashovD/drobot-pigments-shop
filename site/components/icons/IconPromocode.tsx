import { FC } from "react"

interface IProps {
	width?: string
	height?: string
	stroke: string
}

const IconPromocode: FC<IProps> = ({ height = "30", width = "30", stroke }) => {
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
				d="M23.6157 15.3319L6.75227 22.1244L5.9682 19.9063C5.9682 19.9063 7.6257 19.041 7.08133 17.5338C6.53695 16.0266 4.56664 16.3556 4.56664 16.3556L3.79883 14.0725L20.7191 7.39783L21.556 9.37626C21.556 9.37626 19.7523 10.4772 20.3129 12.0372C20.8735 13.5972 22.852 13.2316 22.852 13.2316L23.6157 15.3319Z"
				stroke={stroke}
				strokeWidth="0.75"
			/>
			<path
				d="M7.51562 12.61L8.43781 14.6981"
				stroke={stroke}
				strokeWidth="0.75"
				strokeDasharray="9 4"
			/>
			<path
				d="M8.86914 15.7015L9.64914 17.4647"
				stroke={stroke}
				strokeWidth="0.75"
				strokeDasharray="9 4"
			/>
			<path
				d="M9.94141 18.2975L10.8677 20.3856"
				stroke={stroke}
				strokeWidth="0.75"
				strokeDasharray="9 4"
			/>
			<path
				d="M3.65625 13.8125L16.5212 4.46875L17.875 6.06068C17.875 6.06068 16.4852 7.58595 17.4745 8.86419"
				stroke={stroke}
				strokeWidth="0.75"
			/>
		</svg>
	)
}

export default IconPromocode


