import { useEffect, useState } from "react"
import { Badge } from "react-bootstrap"
import { NavLink } from "react-router-dom"
import { useGetFavouritesQuery } from "../application/favourite.service"
import IconFavourite from "./icons/IconFavourite"

const FavIconComponent = () => {
    const { data } = useGetFavouritesQuery()
    const [quantity, setQuantity] = useState(0)

    useEffect(() => {
        if ( data ) {
            setQuantity(data.goods.length || 0)
        }
    }, [data])
    
    return (
		<div className="position-relative">
            {quantity > 0 && <Badge
                className="position-absolute" pill={true} bg="secondary"
                style={{ top: '-16%', right: '-16%' }}
            >
                <span className="text-primary">{quantity}</span>
            </Badge>}
			<NavLink to="/favourite" className="text-white ms-4">
				<IconFavourite stroke={"#ffffff"} />
			</NavLink>
		</div>
	)
}

export default FavIconComponent