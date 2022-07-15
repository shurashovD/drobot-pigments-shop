import { FC } from "react"

interface IProps {
	stroke: string
}

const IconGreenCheckmark: FC<IProps> = ({ stroke }) => {
    return (
		<svg
			width="15"
			height="15"
			viewBox="0 0 16 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M5.42331 12L0 6.81356L0.730062 6L5.42331 10.5763L16.2699 0L17 0.711862L5.42331 12Z"
				fill={stroke}
			/>
		</svg>
	)
}

export default IconGreenCheckmark


