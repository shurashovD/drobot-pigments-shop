import { FC, useEffect, useState } from "react"
import { Accordion } from "react-bootstrap"

interface IProps {
	activeKey?: string
	onClick: (key?: string) => void
}

const PromoOrders: FC<IProps> = ({ activeKey, onClick }) => {
	const eventKey = 'promoOrders'
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
					width="26"
					height="27"
					viewBox="0 0 26 27"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M23.6157 15.7765L6.75227 22.4359L5.9682 20.2612C5.9682 20.2612 7.6257 19.4129 7.08133 17.9352C6.53695 16.4576 4.56664 16.7802 4.56664 16.7802L3.79883 14.5419L20.7191 7.99805L21.556 9.93769C21.556 9.93769 19.7523 11.017 20.3129 12.5465C20.8735 14.0759 22.852 13.7174 22.852 13.7174L23.6157 15.7765Z"
						stroke={stroke}
						strokeWidth="0.75"
					/>
					<path
						d="M7.51562 13.1079L8.43781 15.1551"
						stroke={stroke}
						strokeWidth="0.75"
						strokeDasharray="9 4"
					/>
					<path
						d="M8.86914 16.1387L9.64914 17.8672"
						stroke={stroke}
						strokeWidth="0.75"
						strokeDasharray="9 4"
					/>
					<path
						d="M9.94141 18.6841L10.8677 20.7313"
						stroke={stroke}
						strokeWidth="0.75"
						strokeDasharray="9 4"
					/>
					<path
						d="M3.65625 14.287L16.5212 5.12646L17.875 6.68718C17.875 6.68718 16.4852 8.18254 17.4745 9.43572"
						stroke={stroke}
						strokeWidth="0.75"
					/>
				</svg>

				<span
					className={`ms-2 text-uppercase ${
						activeKey !== eventKey && "text-white"
					}`}
				>
					Заказы по промокодам
				</span>
			</Accordion.Header>
			<Accordion.Body></Accordion.Body>
		</Accordion.Item>
	)
}

export default PromoOrders