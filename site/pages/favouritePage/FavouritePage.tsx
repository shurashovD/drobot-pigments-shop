import { useEffect } from "react"
import { Col, Container, Row, Spinner } from "react-bootstrap"
import { useGetFavouritesQuery } from "../../application/favourite.service"
import Item from "./Item"

const FavouritePage = () => {
    const { data, isFetching, isLoading } = useGetFavouritesQuery()

    useEffect(() => {
        document.title = 'Избранное'
    }, [])

    return (
		<Container className="pb-6">
			<h3>Избранное</h3>
			{isLoading && (
				<div className="text-center p-5">
					<Spinner animation="border" variant="secondary" />
				</div>
			)}
			{!isFetching && data && data.goods.length === 0 && <div className="text-muted">Здесь пока ничего нет</div>}
			{!isFetching && data && data.goods.length > 0 && (
				<Row xs={1} md={3} lg={4}>
					{data.goods.map(({ id, product, variantId }) => (
						<Col key={id}>
                            <Item
                                product={product}
                                variantId={variantId}
                            />
                        </Col>
					))}
				</Row>
			)}
		</Container>
	)
}

export default FavouritePage