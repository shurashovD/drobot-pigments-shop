import { FC } from "react"

interface IProps {
	stroke: string
}

const IconBox: FC<IProps> = ({ stroke }) => {
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
				d="M8.48898 12.0938L5.04366 10.3125C5.03649 10.3099 5.0303 10.3051 5.02593 10.2988C5.02156 10.2925 5.01921 10.285 5.01921 10.2774C5.01921 10.2697 5.02156 10.2623 5.02593 10.256C5.0303 10.2497 5.03649 10.2449 5.04366 10.2422L14.8218 4.93597H14.8593L24.9655 10.3125C24.9727 10.3152 24.9789 10.32 24.9833 10.3263C24.9876 10.3326 24.99 10.34 24.99 10.3477C24.99 10.3553 24.9876 10.3628 24.9833 10.3691C24.9789 10.3754 24.9727 10.3802 24.9655 10.3828L15.3515 15.6235H15.314L11.2171 13.5"
				stroke={stroke}
				strokeWidth="0.6"
				strokeLinecap="round"
			/>
			<path
				d="M15.3328 15.6141L5.03433 10.3126C5.02814 10.3104 5.02153 10.3096 5.01501 10.3104C5.0085 10.3112 5.00226 10.3136 4.9968 10.3172C4.99134 10.3208 4.9868 10.3257 4.98355 10.3314C4.9803 10.3371 4.97842 10.3435 4.97807 10.3501V19.7251C4.97859 19.7328 4.981 19.7402 4.98509 19.7467C4.98918 19.7533 4.99482 19.7587 5.00151 19.7626L15.0468 25.0641C15.0532 25.0673 15.0603 25.0688 15.0675 25.0685C15.0746 25.0681 15.0816 25.066 15.0877 25.0623C15.0938 25.0585 15.0988 25.0533 15.1023 25.047C15.1058 25.0408 15.1077 25.0338 15.1078 25.0266L15.3328 15.6516C15.3357 15.6458 15.3372 15.6394 15.3372 15.6329C15.3372 15.6264 15.3357 15.6199 15.3328 15.6141ZM15.3328 15.6141L11.114 13.4438"
				stroke={stroke}
				strokeWidth="0.6"
				strokeLinecap="round"
			/>
			<path
				d="M15.3328 15.6375L24.9609 10.3125C24.967 10.3095 24.9737 10.3079 24.9805 10.308C24.9873 10.3081 24.994 10.3098 24.9999 10.313C25.0059 10.3162 25.011 10.3209 25.0149 10.3265C25.0187 10.3321 25.0211 10.3386 25.0219 10.3453V19.7953C25.0213 19.803 25.0189 19.8105 25.0148 19.817C25.0107 19.8236 25.0051 19.829 24.9984 19.8328L15.1547 25.0594C15.1486 25.0625 15.1419 25.064 15.1351 25.0639C15.1283 25.0638 15.1216 25.0621 15.1156 25.0589C15.1097 25.0557 15.1045 25.051 15.1007 25.0454C15.0969 25.0398 15.0945 25.0333 15.0937 25.0266L15.3328 15.6375Z"
				stroke={stroke}
				strokeWidth="0.6"
				strokeLinecap="round"
			/>
			<path
				d="M19.2609 7.5L9.37493 12.7547V16.4672"
				stroke={stroke}
				strokeWidth="0.6"
				strokeLinecap="round"
			/>
		</svg>
	)
}

export default IconBox


