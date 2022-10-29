import { useEffect, useState } from "react"
import { Col, Row } from "react-bootstrap"
import { Product } from "../../../../shared"
import { useGetProductsQuery } from "../../../application/compare.service"
import { useAppSelector } from "../../../application/hooks"
import Item from "./Item"

const Feed = () => {
    const { firstGoodId, secondGoodId, categoryId } = useAppSelector(state => state.compareSlice)
    const { data } = useGetProductsQuery({ categoryId: categoryId || '' }, { skip: !categoryId, refetchOnMountOrArgChange: true })
    const [state, setState] = useState<Product[]>([])

    useEffect(() => {
        if ( data ) {
            setState(data.filter(({ id }) => ![firstGoodId, secondGoodId].includes(id)))
        }
    }, [data])

    return (
		<Row className="overflow-x-scroll">
			{state.map((item) => (
				<Col xs={11} lg={4} xl={3} key={item.id}>
                    <Item product={item} />
                </Col>
			))}
		</Row>
	)
}

export default Feed