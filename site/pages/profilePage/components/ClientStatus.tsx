import { Button, OverlayTrigger, Popover } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useAccountAuthQuery } from "../../../application/account.service"

const popover = (
	<Popover className="bg-primary text-white">
		<Popover.Body className="text-white">
			<div className="mb-3">
				У нас есть <span className="text-dark">3 уровня</span>{" "}
				пользователя.
			</div>
			<ul className="mb-3">
				<li className="text-uppercase">Розничный покупатель</li>
				<li className="text-uppercase">Агент</li>
				<li className="text-uppercase">Представитель</li>
			</ul>
			<div>
				Для того чтобы узнать подробности нажми на кнопку{" "}
				<span className="text-dark">“Повысить статус”</span>
			</div>
		</Popover.Body>
	</Popover>
)

const ClientStatus = () => {
	const { data: auth } = useAccountAuthQuery(undefined)
	const navigate = useNavigate()

	const handler = () => {
		navigate("/partner-program")
	}
	
    return (
		<div>
			<div className="d-flex align-items-center mb-3 mb-md-4">
				<span className="text-uppercase fs-3 me-2">
					{auth?.status === "common" && <>Розничный покупатель</>}
					{auth?.status === "agent" && <>Агент</>}
					{auth?.status === "delegate" && <>Представитель</>}
				</span>
				<OverlayTrigger placement="top" overlay={popover}>
					<Button variant="link" className="info-icon-bg" />
				</OverlayTrigger>
			</div>
			<div className="ps-md-2">
				<Button className="ms-auto text-primary" variant="outline-dark" onClick={handler}>
					Повысить статус
				</Button>
			</div>
		</div>
	)
}

export default ClientStatus