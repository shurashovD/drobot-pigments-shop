import { FC, useEffect, useState } from "react"
import { Accordion } from "react-bootstrap"

interface IProps {
	activeKey?: string
	onClick: (key?: string) => void
}

const CashBack: FC<IProps> = ({ activeKey, onClick }) => {
	const eventKey = 'cashBack'
	const [stroke, setStroke] = useState("white")

	useEffect(() => {
		setStroke(activeKey === eventKey ? "#39261F" : "white")
	}, [activeKey])

	return (
		<Accordion.Item eventKey={eventKey} className="border-secondary mb-4">
			<Accordion.Header
				className="text-uppercase"
				onClick={() =>
					onClick(activeKey === eventKey ? undefined : eventKey)
				}
			>
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M18.4472 21.5023H5.55469L6.00094 13.4661C6.08245 11.9857 6.72804 10.5928 7.80497 9.57375C8.88189 8.55472 10.3083 7.987 11.7909 7.98733H12.4772C13.8903 7.98326 15.2512 8.5217 16.279 9.49158C17.3068 10.4615 17.9231 11.7888 18.0009 13.1998L18.4472 21.5023Z"
						stroke={stroke}
						strokeWidth="0.75"
					/>
					<path
						d="M10.2678 8.19L7.39532 2.77125C7.37879 2.74044 7.37121 2.70564 7.37342 2.67075C7.37563 2.63587 7.38755 2.6023 7.40783 2.57383C7.42811 2.54536 7.45594 2.52313 7.48819 2.50964C7.52043 2.49615 7.55581 2.49195 7.59032 2.4975L9.33407 2.78625C11.166 3.09039 13.0351 3.09672 14.8691 2.805L16.7853 2.50125C16.8206 2.49547 16.8568 2.49989 16.8896 2.51399C16.9225 2.52809 16.9506 2.55129 16.9707 2.58084C16.9908 2.6104 17.002 2.64509 17.0031 2.68081C17.0041 2.71654 16.9949 2.75182 16.9766 2.7825L13.8191 8.07375"
						stroke={stroke}
						strokeWidth="0.75"
					/>
					<path
						d="M10.5859 4.93115L11.5234 7.9874"
						stroke={stroke}
						strokeWidth="0.75"
						strokeLinecap="round"
					/>
					<path
						d="M13.1781 5.54639L12.6719 7.99139"
						stroke={stroke}
						strokeWidth="0.75"
						strokeLinecap="round"
					/>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M12.7813 12.75C13.247 12.75 13.6125 12.8014 13.8778 12.9043C14.1432 13.0072 14.3327 13.1859 14.4464 13.4404C14.5655 13.6949 14.6251 14.055 14.6251 14.5207C14.6251 14.981 14.5682 15.3411 14.4545 15.601C14.3462 15.8556 14.1621 16.0343 13.9022 16.1371C13.6477 16.2346 13.3038 16.2834 12.8706 16.2834C12.6378 16.2834 12.413 16.2779 12.1964 16.2671C11.9884 16.2564 11.7962 16.2405 11.6197 16.2194V16.6228H13.7351V17.074H11.6197V18.4277H10.8075V17.074H10.125V16.6228H10.8075V16.1715H10.125V15.7203H10.8075V12.8231C11.0187 12.8014 11.2136 12.7852 11.3923 12.7744C11.5764 12.7635 11.7768 12.7581 11.9934 12.7581C12.21 12.7527 12.4726 12.75 12.7813 12.75ZM11.8228 15.6092H11.6197L11.6197 13.4318C11.9432 13.4267 12.325 13.4242 12.765 13.4242C13.0249 13.4242 13.2307 13.4567 13.3823 13.5217C13.534 13.5812 13.6423 13.6895 13.7072 13.8466C13.7722 14.0036 13.8047 14.2283 13.8047 14.5207C13.8047 14.8077 13.7722 15.0298 13.7072 15.1868C13.6423 15.3438 13.534 15.4521 13.3823 15.5117C13.2307 15.5713 13.0249 15.6038 12.765 15.6092H11.8228Z"
						fill={stroke}
					/>
				</svg>

				<span
					className={`ms-2 text-uppercase ${
						activeKey !== eventKey && "text-white"
					}`}
				>
					Кэшбэк
				</span>
			</Accordion.Header>
			<Accordion.Body></Accordion.Body>
		</Accordion.Item>
	)
}

export default CashBack