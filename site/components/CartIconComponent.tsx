import { Badge } from "react-bootstrap"
import { NavLink } from "react-router-dom"
import { useAppSelector } from "../application/hooks"
import IconCart from "./icons/IconCart"

const CartIconComponent = () => {
    const quantity = useAppSelector(state => state.cartSlice.products.length + state.cartSlice.variants.length)
    
    return (
		<div className="position-relative">
            {quantity > 0 && <Badge
                className="position-absolute" pill={true} bg="secondary"
                style={{ top: '-16%', right: '-16%' }}
            >
                <span className="text-primary">{quantity}</span>
            </Badge>}
			<NavLink to="/cart" className="text-white ms-4">
				<IconCart stroke={"#ffffff"} />
			</NavLink>
		</div>
	)
}

export default CartIconComponent