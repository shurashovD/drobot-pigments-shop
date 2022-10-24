import { FC } from "react"
import { Button, Col, Container, Row } from "react-bootstrap"
import { useLocation, useNavigate } from "react-router-dom"
import { useAccountAuthQuery } from "../../application/account.service"
import IconAccount from "../../components/icons/IconAccount"
import IconBox from "../../components/icons/IconBox"
import IconFavourite from "../../components/icons/IconFavourite"
import IconHome from "../../components/icons/IconHome"
import IconPromocode from "../../components/icons/IconPromocode"

const ProfilePageNavigate = () => {
	const { hash } = useLocation()
	const navigate = useNavigate()
	const { data: client } = useAccountAuthQuery(undefined)

    return (
		<div className="border border-top-0 border-start-0 border-end-0 border-dark text-center m-0 mb-5">
			<Container>
				<Row className="justify-content-between align-items-center py-3">
					<Col xs="auto">
						<Button
							variant="link"
							disabled={client && !client.counterpartyId}
							className={`text-uppercase text-${hash === "#main" ? "dark" : "primary"} m-0 p-0`}
							onClick={() => navigate({ hash: "main" })}
						>
							<IconHome stroke={`${hash === "#main" ? "#B88E5B" : "#39261f"}`} width="24" height="24" />
							<span className="ms-2">Главная</span>
						</Button>
					</Col>
					<Col xs="auto">
						<Button
							variant="link"
							disabled={!client || !client.counterpartyId}
							className={`text-uppercase text-${hash === "#orders" ? "dark" : "primary"} m-0 p-0`}
							onClick={() => navigate({ hash: "orders" })}
						>
							<IconBox stroke={`${hash === "#orders" ? "#B88E5B" : "#39261f"}`} />
							<span className="ms-2">Заказы</span>
						</Button>
					</Col>
					{client && (client.status === 'agent' || client.status === 'delegate') && (
						<Col xs="auto">
							<Button
								variant="link"
								disabled={!client || !client.counterpartyId}
								className={`text-uppercase text-${hash === "#promocodes" ? "dark" : "primary"} m-0 p-0`}
								onClick={() => navigate({ hash: "promocodes" })}
							>
								<IconPromocode stroke={`${hash === "#promocodes" ? "#B88E5B" : "#39261f"}`} />
								<span className="ms-2">Промокоды</span>
							</Button>
						</Col>
					)}
					<Col xs="auto">
						<Button
							variant="link"
							disabled={!client || !client.counterpartyId}
							className={`text-uppercase text-${hash === "#favourite" ? "dark" : "primary"} m-0 p-0`}
							onClick={() => navigate({ hash: "favourite" })}
						>
							<IconFavourite stroke={`${hash === "#favourite" ? "#B88E5B" : "#39261f"}`} width="24" height="24" />
							<span className="ms-2">Избранное</span>
						</Button>
					</Col>
					<Col xs="auto">
						<Button
							variant="link"
							disabled={!client}
							className={`text-uppercase text-${hash === "#profile" ? "dark" : "primary"} m-0 p-0`}
							onClick={() => navigate({ hash: "profile" })}
						>
							<IconAccount stroke={`${hash === "#profile" ? "#B88E5B" : "#39261f"}`} width="24" height="24" />
							<span className="ms-2">Профиль</span>
						</Button>
					</Col>
				</Row>
			</Container>
		</div>
	)
}

export default ProfilePageNavigate