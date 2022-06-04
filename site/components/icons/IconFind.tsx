import { FC } from "react"

interface IProps {
	stroke: string
}

const IconFind: FC<IProps> = ({ stroke }) => {
    return (
		<svg
			width="30"
			height="30"
			viewBox="0 0 30 30"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
		>
			<g clipPath="url(#clip0_533_5042)">
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M0 6.39998H12.5H25V5.59998H12.5H0V6.39998ZM0 13.4H14H28V12.6H14H0V13.4ZM24 20H0V19.2H24V20ZM0 27L28.5 27V26.2L0 26.2V27Z"
					fill={stroke}
				/>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M31.488 31.5858L23.1931 20.6598L23.8562 20.1564L32.1512 31.0823L31.488 31.5858Z"
					fill={stroke}
				/>
				<path
					d="M23.1931 20.6598L23.1629 20.62L23.123 20.6502L23.1533 20.69L23.1931 20.6598ZM31.488 31.5858L31.4482 31.616L31.4785 31.6558L31.5183 31.6256L31.488 31.5858ZM23.8562 20.1564L23.896 20.1261L23.8658 20.0863L23.826 20.1165L23.8562 20.1564ZM32.1512 31.0823L32.1814 31.1221L32.2212 31.0919L32.191 31.0521L32.1512 31.0823ZM23.1533 20.69L31.4482 31.616L31.5279 31.5555L23.2329 20.6296L23.1533 20.69ZM23.826 20.1165L23.1629 20.62L23.2233 20.6996L23.8865 20.1962L23.826 20.1165ZM32.191 31.0521L23.896 20.1261L23.8164 20.1866L32.1113 31.1126L32.191 31.0521ZM31.5183 31.6256L32.1814 31.1221L32.1209 31.0425L31.4578 31.5459L31.5183 31.6256Z"
					fill={stroke}
				/>
				<circle
					cx="18.2046"
					cy="11.4345"
					r="10.108"
					transform="rotate(5.30486 18.2046 11.4345)"
					fill="none"
					stroke={stroke}
					strokeWidth="0.8"
				/>
			</g>
			<defs>
				<clipPath id="clip0_533_5042">
					<rect width="33" height="33" fill={stroke} />
				</clipPath>
			</defs>
		</svg>
	)
}

export default IconFind