import { useEffect, useState } from "react"
import { Button, Col, Container, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useAccountAuthQuery } from "../../../application/account.service"
import MobAvatarComponent from "../../../components/MobAvatarComponent"
import ClientStatus from "../components/ClientStatus"

const parsePhoneValue = (value?: string) => {
	if (!value) return ""
	const code = value.substring(0, 3)
	const fird = value.substring(8, 10)
	return `+7 (${code}) ***-**-${fird}`
}

const PrivateDataComponent = () => {
    const { data: auth } = useAccountAuthQuery(undefined)
    const [initials, setInitials] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
		if (auth && auth.name) {
			const nameArr = auth.name.split(" ")
			setInitials(`${nameArr[0][0]}${nameArr[1]?.[0] || ""}`.toUpperCase())
		}
	}, [auth])

    return (
		<div>
			<Row className="mx-0 px-md-2">
				<Col xs={4}>
					<MobAvatarComponent alt={initials} resizing={true} />
				</Col>
				<Col xs={8} className="d-flex flex-column justify-content-center justify-content-lg-evenly">
					<div className="text-uppercase fs-3 mb-1">{auth?.name}</div>
					{auth?.tel && (
						<div className="text-muted mb-1 d-flex">
							<span>{parsePhoneValue(auth.tel)}</span>
							<span className="d-none d-xl-block ms-2">{auth?.mail}</span>
						</div>
					)}
					<div className="text-muted d-xl-none">{auth?.mail}</div>
					<div className="text-start d-none d-xl-block">
						<Button variant="link" className="text-dark p-0" onClick={() => navigate({ hash: "profile" })}>
							Изменить
						</Button>
					</div>
				</Col>
				<Col xs={12} className="d-xl-none">
					<Button variant="link" className="text-dark" onClick={() => navigate({ hash: "profile" })}>
						Изменить
					</Button>
				</Col>
			</Row>
			<hr className="bg-secondary" />
			<Container>
				<ClientStatus />
			</Container>
		</div>
	)
}

export default PrivateDataComponent