import { NavLink } from "react-router-dom"
import IconAccount from "./icons/IconAccount"
import IconCart from "./icons/IconCart"
import IconFavourite from "./icons/IconFavourite"
import IconFind from "./icons/IconFind"
import IconHome from "./icons/IconHome"

const MobileFooter = () => {
    return (
		<div className="d-flex d-lg-none justify-content-around bg-primary p-3 position-fixed bottom-0 start-0 end-0">
			<NavLink to="/">
				<IconHome stroke="#ffffff" />
			</NavLink>
			<NavLink to="/">
				<IconFind stroke="#ffffff" />
			</NavLink>
			<NavLink to="/cart">
				<IconCart stroke="#ffffff" />
			</NavLink>
			<NavLink to="/">
				<IconFavourite stroke="#ffffff" />
			</NavLink>
			<NavLink to="/">
				<IconAccount stroke="#ffffff" />
			</NavLink>
		</div>
	)
}

export default MobileFooter