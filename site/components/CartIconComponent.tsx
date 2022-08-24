import { useEffect, useState } from "react"
import { Badge } from "react-bootstrap"
import { NavLink } from "react-router-dom"
import { useGetCartQuery } from "../application/order.service"
import IconCart from "./icons/IconCart"

const CartIconComponent = () => {
    const { data: cart } = useGetCartQuery(undefined)
    const [quantity, setQuantity] = useState(0)

    useEffect(() => {
        if ( cart ) {
            setQuantity(cart.products.length + cart.variants.length)
        }
    }, [cart])
    
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