import { useEffect, useState } from "react"
import { Button } from "react-bootstrap"
import { useLocation, useNavigate } from "react-router-dom"

const OrdersAccordionComponent = () => {
	const eventKey = 'orders'
	const [stroke, setStroke] = useState("white")
	const { hash } = useLocation()
	const navigate = useNavigate()

	useEffect(() => {
		setStroke(hash === `#${eventKey}` ? "#39261F" : "white")
	}, [hash])

	return (
		<Button className="border-secondary mb-4 w-100 text-start" variant="dark"
			onClick={() => navigate({ hash: `#${eventKey}` })}
		>
			<svg
					width="35"
					height="32"
					viewBox="0 0 26 26"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M7.35732 10.4813L4.37139 8.93752C4.36517 8.93521 4.3598 8.93105 4.35601 8.92561C4.35223 8.92016 4.3502 8.91369 4.3502 8.90705C4.3502 8.90042 4.35223 8.89394 4.35601 8.88849C4.3598 8.88305 4.36517 8.87889 4.37139 8.87658L12.8458 4.27783H12.8783L21.637 8.93752C21.6432 8.93983 21.6486 8.94399 21.6524 8.94943C21.6562 8.95488 21.6582 8.96135 21.6582 8.96799C21.6582 8.97462 21.6562 8.9811 21.6524 8.98655C21.6486 8.99199 21.6432 8.99615 21.637 8.99846L13.3048 13.5403H13.2723L9.7217 11.7"
						stroke={stroke}
						strokeWidth="0.6"
						strokeLinecap="round"
					/>
					<path
						d="M13.2892 13.5323L4.36385 8.93766C4.35849 8.93575 4.35275 8.93512 4.34711 8.93582C4.34146 8.93652 4.33606 8.93853 4.33133 8.94169C4.32659 8.94484 4.32266 8.94906 4.31984 8.954C4.31703 8.95894 4.3154 8.96448 4.3151 8.97016V17.0952C4.31555 17.1018 4.31764 17.1083 4.32118 17.114C4.32472 17.1196 4.32961 17.1243 4.33541 17.1277L13.0413 21.7223C13.0469 21.7251 13.0531 21.7264 13.0593 21.7261C13.0655 21.7258 13.0715 21.724 13.0768 21.7207C13.082 21.7175 13.0864 21.7129 13.0895 21.7075C13.0925 21.7021 13.0941 21.696 13.0942 21.6898L13.2892 13.5648C13.2917 13.5598 13.293 13.5542 13.293 13.5486C13.293 13.543 13.2917 13.5374 13.2892 13.5323ZM13.2892 13.5323L9.63291 11.6514"
						stroke={stroke}
						strokeWidth="0.6"
						strokeLinecap="round"
					/>
					<path
						d="M13.2884 13.5525L21.6327 8.93752C21.638 8.93487 21.6438 8.93352 21.6497 8.9336C21.6556 8.93367 21.6614 8.93517 21.6666 8.93796C21.6717 8.94076 21.6762 8.94476 21.6795 8.94963C21.6828 8.95451 21.6849 8.96011 21.6855 8.96596V17.156C21.6851 17.1626 21.683 17.1691 21.6795 17.1748C21.6759 17.1804 21.671 17.1851 21.6652 17.1885L13.134 21.7181C13.1287 21.7208 13.1229 21.7222 13.117 21.7221C13.1111 21.722 13.1053 21.7205 13.1002 21.7177C13.095 21.7149 13.0905 21.7109 13.0872 21.706C13.0839 21.7012 13.0818 21.6956 13.0812 21.6897L13.2884 13.5525Z"
						stroke={stroke}
						strokeWidth="0.6"
						strokeLinecap="round"
					/>
					<path
						d="M16.6934 6.5L8.12555 11.0541V14.2716"
						stroke={stroke}
						strokeWidth="0.6"
						strokeLinecap="round"
					/>
				</svg>
				<span
					className={`ms-2 text-uppercase ${
						hash !== `#${eventKey}` && "text-white"
					}`}
				>
					Заказы
				</span>
		</Button>
	)
}

export default OrdersAccordionComponent