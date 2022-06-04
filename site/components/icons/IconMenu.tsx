import { FC } from "react"

interface IProps {
	stroke: string
}

const IconMenu: FC<IProps> = ({ stroke }) => {
    return (
		<svg
			width="33"
			height="22"
			viewBox="0 0 33 22"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M11 2.23077H0.615356V0.230774H11H21.3846V2.23077H11ZM11 8.32693H0.615356V6.82693H11H21.3846V8.32693H11ZM0.615356 13.0231V13.9231H21.3846V13.0231H0.615356Z"
				fill={stroke}
			/>
		</svg>
	)
}

export default IconMenu


