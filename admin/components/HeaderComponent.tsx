import { MouseEvent } from "react"
import { Nav, Navbar } from "react-bootstrap"
import { useLocation, useNavigate } from "react-router-dom"

const HeaderComponent = () => {
    const { pathname } = useLocation()
    const navigate = useNavigate()
    
    const handler = (event: MouseEvent<HTMLButtonElement>) => {
        const to = event.currentTarget.dataset.to || '/'
        navigate(to)
    }

    return (
		<Navbar bg="primary" variant="dark" sticky="top">
			<Nav className="w-100">
				<Nav.Item className="mx-3">
					<Nav.Link
						active={/\/moy-sklad/.test(pathname)}
						as="button"
						className="btn"
						onClick={handler}
						data-to="/admin/moy-sklad"
					>
						Мой склад
					</Nav.Link>
				</Nav.Item>
				<Nav.Item className="mx-3">
					<Nav.Link
						active={/\/products/.test(pathname)}
						as="button"
						className="btn"
						onClick={handler}
						data-to="/admin/products"
					>
						Товары
					</Nav.Link>
				</Nav.Item>
				<Nav.Item className="mx-3">
					<Nav.Link
						active={/\/orders/.test(pathname)}
						as="button"
						className="btn"
						onClick={handler}
						data-to="/admin/orders"
					>
						Заказы
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