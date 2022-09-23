import { NavLink } from "react-router-dom"
import { useAccountAuthQuery } from "../application/account.service"
import CartIconComponent from "./CartIconComponent"
import IconAccount from "./icons/IconAccount"
import IconAccountSign from "./icons/IconAccountSign"
import IconFavourite from "./icons/IconFavourite"
import IconFind from "./icons/IconFind"
import IconHome from "./icons/IconHome"

const MobileFooter = () => {
	const { data } = useAccountAuthQuery(undefined)

    return (
		<div className="d-flex d-lg-none justify-content-around bg-primary p-3 position-fixed bottom-0 start-0 end-0" style={{ zIndex: 10 }}>
			<NavLink to="/">
				<IconHome stroke="#ffffff" />
			</NavLink>
			<NavLink to="/" className="invisible">
				<IconFind stroke="#ffffff" />
			</NavLink>
			<CartIconComponent />
			<NavLink to="/" className="invisible">
				<IconFavourite stroke="#ffffff" />
			</NavLink>
			<NavLink to="/profile">{!!data ? <IconAccountSign stroke={"#ffffff"} /> : <IconAccount stroke={"#ffffff"} />}</NavLink>
		</div>
	)
}

export default MobileFooter