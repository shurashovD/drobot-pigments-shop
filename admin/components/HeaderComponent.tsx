import { MouseEvent, useEffect } from "react"
import { Nav, Navbar } from "react-bootstrap"
import { useLocation, useNavigate } from "react-router-dom"
import { useAppSelector } from "../application/hooks"

const HeaderComponent = () => {
	const hasNewOrders = useAppSelector(state => state.ordersSlice.news.length > 0)
    const { pathname } = useLocation()
    const navigate = useNavigate()
    
    const handler = (event: MouseEvent<HTMLButtonElement>) => {
        const to = event.currentTarget.dataset.to || '/'
        navigate(to)
    }

	useEffect(() => {
		if ( hasNewOrders ) {
			new Audio("/static/assets/sound.ogg").play().catch(() => {
				new Audio("/static/assets/sound.webm").play()
			})
		}
	}, [hasNewOrders])

    return (
		<Navbar bg="primary" variant="dark" sticky="top">
			<Nav className="w-100">
				<Nav.Item className="mx-3">
					<Nav.Link active={/\/moy-sklad/.test(pathname)} as="button" className="btn" onClick={handler} data-to="/admin/moy-sklad">
						Мой склад
					</Nav.Link>
				</Nav.Item>
				<Nav.Item className="mx-3">
					<Nav.Link active={/\/products/.test(pathname)} as="button" className="btn" onClick={handler} data-to="/admin/categories">
						Товары
					</Nav.Link>
				</Nav.Item>
				<Nav.Item className="mx-3 d-none">
					<Nav.Link
						active={/\/orders/.test(pathname)}
						as="button"
						className={`btn ${hasNewOrders && "fw-bold text-warning"}`}
						disabled={true}
						onClick={handler}
						data-to="/admin/orders"
					>
						Заказы
					</Nav.Link>
				</Nav.Item>
				<Nav.Item className="mx-3">
					<Nav.Link active={/\/hooks/.test(pathname)} as="button" className="btn" onClick={handler} data-to="/admin/hooks">
						WebHooks
					</Nav.Link>
				</Nav.Item>
				<Nav.Item className="mx-3">
					<Nav.Link active={/\/amo/.test(pathname)} as="button" className="btn" onClick={handler} data-to="/admin/amo">
						AmoCRM
					</Nav.Link>
				</Nav.Item>
				<Nav.Item className="mx-3">
					<Nav.Link active={/\/users/.test(pathname)} as="button" className="btn" onClick={handler} data-to="/admin/users">
						Пользователи
					</Nav.Link>
				</Nav.Item>
				<Nav.Item className="mx-3">
					<Nav.Link active={/\/cashback/.test(pathname)} as="button" className="btn" onClick={handler} data-to="/admin/cashback">
						Кэшбэк
					</Nav.Link>
				</Nav.Item>
				<Nav.Item className="mx-3">
					<Nav.Link active={/\/loyalty/.test(pathname)} as="button" className="btn" onClick={handler} data-to="/admin/loyalty">
						Лояльность
					</Nav.Link>
				</Nav.Item>
				<Nav.Item className="ms-auto">
					<Nav.Link href="/admin/logout">Выход</Nav.Link>
				</Nav.Item>
			</Nav>
		</Navbar>
	)
}

export default HeaderComponent