import { useEffect, useState } from "react"
import { Badge } from "react-bootstrap"
import { NavLink } from "react-router-dom"
import { useGetCompareQuery } from "../application/compare.service"
import IconCompare from "./icons/IconCompare"

const CompIconComponent = () => {
    const { data } = useGetCompareQuery()
    const [quantity, setQuantity] = useState(0)

    useEffect(() => {
        if ( data ) {
            setQuantity(data.length || 0)
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
			<NavLink to="/compare" className="text-white">
				<IconCompare stroke={"#ffffff"} />
			</NavLink>
		</div>
	)
}

export default CompIconComponent