import { useEffect, useRef, useState } from "react"
import { Button, Col, Overlay, Popover, Row, Stack } from "react-bootstrap"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { useAccountAuthQuery, useLogoutMutation } from "../application/account.service"
import AvatarComponent from "./AvatarComponent"
import ButtonComponent from "./ButtonComponent"
import IconAccount from "./icons/IconAccount"
import IconAccountSign from "./icons/IconAccountSign"
import IconOrders from "./icons/IconOrders"
import IconPromocode from "./icons/IconPromocode"

const parsePhoneValue = (value?: string) => {
	if (!value) return ""
	return `+${value}`
}

const HeaderAccountComponent = () => {
    const { data: auth } = useAccountAuthQuery(undefined)
    const [logout, { isLoading, isSuccess }] = useLogoutMutation()
    const [show, setShow] = useState(false)
    const [initials, setInitials] = useState("")
    const { pathname, hash } = useLocation()
    const target = useRef<HTMLButtonElement | null>(null)
    const navigate = useNavigate()

    const handler = () => {
        if ( auth ) {
            setShow(true)
        } else {
            navigate('/profile#main')
        }
    }

    useEffect(() => {
        if ( isSuccess ) {
            navigate('/')
        }
    }, [isSuccess, navigate])

    useEffect(() => {
        if ( auth?.name ) {
            const [name, sername] = auth.name.split(" ")
            setInitials(`${name?.[0] || ""}${sername?.[0] || ""}`)
        }
    }, [auth])

    return (
		<div>
			<Button variant="link" className="m-0 p-0 position-relative" ref={target} onClick={handler}>
				{!!auth ? <IconAccountSign stroke={"#ffffff"} /> : <IconAccount stroke={"#ffffff"} />}
			</Button>
			<Overlay onHide={() => setShow(false)} show={show} rootClose={true} target={target.current} placement="bottom">
				<Popover className="rounded-0 border-muted" style={{ minWidth: "320px" }}>
					<Popover.Header className="bg-muted px-3 py-4">
						<Row>
							<Col xs={4}>
								<AvatarComponent alt={initials} />
							</Col>
							<Col xs={8} className="d-flex flex-column">
								<NavLink to="/profile#main" className="text-uppercase text-primary" onClick={() => setShow(false)}>
									{auth?.name}
								</NavLink>
								<div className="text-muted mt-auto">
									{auth?.status === "common" && <>Розничный покупатель</>}
									{auth?.status === "agent" && <>Агент</>}
									{auth?.status === "delegate" && <>Представитель</>}
									{auth?.status === "coach" && <>Тренер</>}
								</div>
								<div className="text-muted mb-auto">{parsePhoneValue(auth?.tel)}</div>
							</Col>
						</Row>
					</Popover.Header>
					<Popover.Body>
						<Stack direction="vertical" gap={3}>
							<div className="d-flex align-items-center">
								<NavLink
									to="/profile#main"
									className={`text-uppercase text-${pathname + hash === "/profile#main" ? "dark" : "primary"} w-100`}
									onClick={() => setShow((state) => !state)}
								>
									<IconAccount stroke={pathname + hash === "/profile#main" ? "#B88E5B" : "#141515"} width="24" height="24" />
									<span className="ms-2">Личный кабинет</span>
								</NavLink>
							</div>
							<div className="d-flex align-items-center">
								<NavLink
									to="/profile#orders"
									className={`text-uppercase text-${pathname + hash === "/profile#orders" ? "dark" : "primary"} w-100`}
									onClick={() => setShow((state) => !state)}
								>
									<IconOrders stroke={pathname + hash === "/profile#orders" ? "#B88E5B" : "#141515"} width="24" height="24" />
									<span className="ms-2">Заказы</span>
								</NavLink>
							</div>
							<div className="d-flex align-items-center">
								<NavLink
									to="/profile#promocodes"
									className={`text-uppercase text-${pathname + hash === "/profile#promocodes" ? "dark" : "primary"} w-100`}
									onClick={() => setShow((state) => !state)}
								>
									<IconPromocode
										stroke={pathname + hash === "/profile#promocodes" ? "#B88E5B" : "#141515"}
										width="24"
										height="24"
									/>
									<span className="ms-2">Промокоды</span>
								</NavLink>
							</div>
						</Stack>
						<hr className="mt-5 opacity-25 mb-4" />
						<ButtonComponent variant="link" className="text-muted" isLoading={isLoading} onClick={() => logout()}>
							Выйти
						</ButtonComponent>
					</Popover.Body>
				</Popover>
			</Overlay>
		</div>
	)
}

export default HeaderAccountComponent