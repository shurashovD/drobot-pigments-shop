import { FC, useEffect, useRef, useState } from "react"
import { Button, Col, Row, Spinner } from "react-bootstrap"
import { Product } from "../../../shared"
import { useGetProductsQuery } from "../../application/category.service"
import ProductCard from "../../components/card/ProductCard"

interface IProps {
    categoryId: string
}

const limit = 3

const Products: FC<IProps> = ({ categoryId }) => {
    const [state, setState] = useState<Product[]>([])
    const [page, setPage] = useState(1)
    const {data, isLoading, isFetching, isSuccess} = useGetProductsQuery({ id: categoryId, filters: [], limit, page }, { refetchOnMountOrArgChange: true })
    const formatter = useRef(
        Intl.NumberFormat('ru', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0
        })
    )

    useEffect(() => {
        if ( isSuccess && data && data.products ) {
            setState(state => 
                state.concat(
                    data.products.filter(({id}) => !state.some(item => item.id === id))
                )
            )
        }
    }, [data])

    return (
		<Row className="g-4 gy-6">
			{isLoading ||
				(isFetching && (
					<Col xs={12} className="text-center p-4">
						<Spinner animation="border" variant="secondary" />
					</Col>
				))}
			{!isLoading && !isFetching && state.length === 0 && (
				<Col xs={12} className="text-center p-4">
					<span className="text-secondary">Товары отсутсвуют</span>
				</Col>
			)}
			{state.map((item) => (
				<Col key={item.id} xs={12} md={6} lg={4}>
					<ProductCard
						id={item.id}
						img={item.photo?.[0]}
						price={formatter.current.format(
							Math.min(...item.variants.map(({ price }) => price / 100)) || item.price || 0
						)}
						title={item.name}
						variantsLabel={item.variantsLabel}
						variants={item.variants.length > 0 ? item.variants : undefined}
					/>
				</Col>
			))}
			<Col xs={12} className="text-center">
				<Button
					variant="outline-primary"
					onClick={() =>
						setPage((state) =>
							Math.min(
								Math.floor(data?.length || limit / limit),
								state + 1
							)
						)
					}
				>
					Ещё
				</Button>
			</Col>
		</Row>
	)
}

export default Products