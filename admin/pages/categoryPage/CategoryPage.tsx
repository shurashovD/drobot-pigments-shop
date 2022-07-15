import { useEffect } from "react"
import { Col, Container, Row } from "react-bootstrap"
import { useParams } from "react-router-dom"
import { useGetCategoryByIdQuery } from "../../application/category.service"
import { initFilterObject, resetFilters } from "../../application/filtersSlice"
import { useAppDispatch } from "../../application/hooks"
import Filters from "./Filters"
import Products from "./Products"

const CategoryPage = () => {
    const {id, filters} = useParams()
    const { data, refetch, isFetching } = useGetCategoryByIdQuery(id || '', { refetchOnMountOrArgChange: true })
	const dispatch = useAppDispatch()

	useEffect(() => {
		if ( data && data.filters ) {
			dispatch(
				initFilterObject(data.filters.map(({ _id }) => _id?.toString()))
			)
		}
		
		return () => {
			dispatch(resetFilters())
		}
	}, [data, dispatch, resetFilters])

    return (
		<Container>
			<h3>Товары категории {data?.title}</h3>
			{data && (
				<Row className="g-4">
					<Col xs={3}>
						<div
							className="border"
							style={{ height: "80vh", overflowY: "scroll" }}
						>
							<Filters
								filters={data.filters}
								categoryId={id || ""}
							/>
						</div>
					</Col>
					<Col xs={9}>
						<Products
							categoryId={id || ""}
							disabled={isFetching}
							products={data.products.map(item => item.toString())}
							refetchCategory={refetch}
						/>
					</Col>
				</Row>
			)}
		</Container>
	)
}

export default CategoryPage