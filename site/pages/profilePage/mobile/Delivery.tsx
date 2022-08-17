import { FC, useEffect, useState } from "react"
import { Accordion } from "react-bootstrap"
import { useLocation, useNavigate } from "react-router-dom"
import DeliveryComponent from "../components/DeliveryComponent"

const Delivery = () => {
	const eventKey = "delivery"
	const [stroke, setStroke] = useState("white")
	const { hash } = useLocation()
	const navigate = useNavigate()

	useEffect(() => {
		setStroke(hash === `#${eventKey}` ? "#39261F" : "white")
	}, [hash])

	return (
		<Accordion.Item eventKey={eventKey} className="border-secondary mb-4">
			<Accordion.Header
				className="text-uppercase"
				onClick={() => navigate({ hash: hash === `#${eventKey}` ? '' : eventKey })}
			>
				<svg
					width="35"
					height="32"
					viewBox="0 0 35 32"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M10.9852 21.9651H20.6367C20.9127 21.9651 21.1774 21.8598 21.3725 21.6722C21.5676 21.4847 21.6773 21.2304 21.6773 20.9651V8.14014C21.6773 7.87492 21.5676 7.62057 21.3725 7.43303C21.1774 7.24549 20.9127 7.14014 20.6367 7.14014H5.32965C5.05367 7.14014 4.78899 7.24549 4.59384 7.43303C4.3987 7.62057 4.28906 7.87492 4.28906 8.14014V20.9551C4.28906 21.2204 4.3987 21.4747 4.59384 21.6622C4.78899 21.8498 5.05367 21.9551 5.32965 21.9551H6.68241"
						stroke={stroke}
						strokeWidth="0.75"
					/>
					<path
						d="M23.8767 21.9652H21.7227V11.6152H26.8267C26.9019 11.6152 26.9762 11.6309 27.0444 11.6611C27.1127 11.6913 27.1733 11.7354 27.2222 11.7902L30.5 15.5652C30.5776 15.6552 30.6199 15.7684 30.6197 15.8852V21.9652H28.3876"
						stroke={stroke}
						strokeWidth="0.75"
					/>
					<path
						d="M8.89409 24.8652C10.1699 24.8652 11.2042 23.8579 11.2042 22.6152C11.2042 21.3726 10.1699 20.3652 8.89409 20.3652C7.61825 20.3652 6.58398 21.3726 6.58398 22.6152C6.58398 23.8579 7.61825 24.8652 8.89409 24.8652Z"
						stroke={stroke}
						strokeWidth="0.75"
					/>
					<path
						d="M26.0894 24.8652C27.3652 24.8652 28.3995 23.8579 28.3995 22.6152C28.3995 21.3726 27.3652 20.3652 26.0894 20.3652C24.8136 20.3652 23.7793 21.3726 23.7793 22.6152C23.7793 23.8579 24.8136 24.8652 26.0894 24.8652Z"
						stroke={stroke}
						strokeWidth="0.75"
					/>
				</svg>
				<span
					className={`ms-2 text-uppercase ${
						hash !== `#${eventKey}` && "text-white"
					}`}
				>
					Доставка
				</span>
			</Accordion.Header>
			<Accordion.Body>
				<DeliveryComponent />
			</Accordion.Body>
		</Accordion.Item>
	)
}

export default Delivery