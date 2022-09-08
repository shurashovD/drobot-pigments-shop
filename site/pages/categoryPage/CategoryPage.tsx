import { useEffect, useState } from "react"
import { Button, Col, Container, Offcanvas, Row, Spinner } from "react-bootstrap"
import { useParams } from "react-router-dom"
import { useGetCategoryByIdQuery } from "../../application/category.service"
import { initFilterObject, resetFilters } from "../../application/filtersSlice"
import { useAppDispatch, useAppSelector } from "../../application/hooks"
import IconFilter from "../../components/icons/IconFilter"
import Filters from "./Filters"
import Products from "./Products"

const CategoryPage = () => {
	const [show, setShow] = useState(false)
    const {id, filters} = useParams()
    const { data, isLoading } = useGetCategoryByIdQuery(id || '', { refetchOnMountOrArgChange: true })
	const { filterObject, variantsFilter, maxPrice, minPrice } = useAppSelector(state => state.filtersSlice)
	const dispatch = useAppDispatch()

	useEffect(() => {
		if ((filters && filterObject.length === 0 && variantsFilter.length === 0 && !maxPrice && !minPrice)) {
			let arr
			try {
				arr = JSON.parse(filters)
				dispatch(initFilterObject(arr))
			} catch {}
		}
	}, [filters, dispatch, initFilterObject])

    return (
		<Container className="pb-6">
			{isLoading && (
				<div className="text-center p-3">
					<Spinner animation="border" variant="secondary" />
				</div>
			)}
			{!isLoading && data && <h3>{data.title}</h3>}
			{!isLoading && data && (
				<Row>
					<Col xs={12} lg={3}>
						<Row className="d-lg-none mb-5">
							<Col xs={6}>
								<div className="d-flex align-items-center">
									<IconFilter stroke="#141515" />
									<Button variant="link" onClick={() => setShow(true)} style={{ zIndex: 2 }} className="text-primary">
										Фильтры
									</Button>
								</div>
								<Offcanvas show={show} onHide={() => setShow(false)}>
									<Offcanvas.Header closeButton className="d-flex align-items-center">
										<Offcanvas.Title>
											Фильтры
										</Offcanvas.Title>
										<Button variant="link" onClick={() => dispatch(resetFilters())} className="ms-auto me-2 p-0 text-muted">
											Сбросить
										</Button>
									</Offcanvas.Header>
									<Offcanvas.Body>
										<Filters />
									</Offcanvas.Body>
								</Offcanvas>
							</Col>
						</Row>
						<div className="d-none d-lg-block">
							<Filters />
						</div>
					</Col>
					<Col xs={12} lg={9}>
						<Products categoryId={id || ""} />
					</Col>
				</Row>
			)}
		</Container>
	)
}

export default CategoryPage