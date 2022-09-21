import { FC } from "react"
import { Button, ButtonProps } from "react-bootstrap";

interface IProps extends ButtonProps {
    show: boolean
}

const NavCatalogBtn: FC<IProps> = (({ onClick, show }) => {
    return (
		<Button
			variant="link"
			className="d-none d-lg-flex align-items-center text-white text-uppercase m-0 p-0"
			onClick={onClick}
		>
			<span className={`nav-catalog-btn-${show ? 'show' : 'hide'}`} />
			<span className="ms-1">Каталог</span>
		</Button>
	)
})

export default NavCatalogBtn