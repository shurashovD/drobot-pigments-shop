import { useCallback, useEffect, useRef, useState } from "react"
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
	const { filterObject, variantsFilter, maxPrice, minPrice, page } = useAppSelector(state => state.filtersSlice)
	const filterContainer = useRef<HTMLDivElement | null>(null)
	const dispatch = useAppDispatch()

	const title = useCallback((element: HTMLDivElement) => {
		if ( element ) {
			document.documentElement.scrollTo({ left: 0, top: 160 })
		}
	}, [])

	const scrollFilterHandler = (down?: boolean) => {
		if ( filterContainer.current ) {
			filterContainer.current.scrollBy({ left: 0, top: down ? 100 : -100, behavior: 'smooth' })
		}
	}

	useEffect(() => {
		if ( page === 1 ) {
			document.documentElement.scrollTo({ left: 0, top: 150 })
		}
	}, [page])

	useEffect(() => {
		if ((filters && filterObject.length === 0 && variantsFilter.length === 0 && !maxPrice && !minPrice)) {
			let arr
			try {
				arr = JSON.parse(filters)
				dispatch(initFilterObject(arr))
			} catch {}
		}
	}, [filters, dispatch, initFilterObject])

	useEffect(() => {
		return () => {
			dispatch(resetFilters())
		}
	}, [dispatch, resetFilters])

    return (
		<Container className="pb-6">
			{isLoading && (
				<div className="text-center p-3">
					<Spinner animation="border" variant="secondary" />
				</div>
			)}
			{!isLoading && data && <h3 ref={title}>{data.title}</h3>}
			{!isLoading && data && (
				<Row>
					<Col xs={12} lg={3}>
						<Row className="d-lg-none mb-5">
							<Col xs={6}>
								<div className="d-flex align-items-center">
									<IconFilter stroke="#141515" />
									<Button variant="link" onClick={() => setShow(true)} style={{ zIndex: 2 }} className="text-primary p-0">
										Фильтры ({filterObject.reduce((sum, { values }) => sum + values.length, 0) + variantsFilter.length})
									</Button>
								</div>
								<Offcanvas show={show} onHide={() => setShow(false)}>
									<Offcanvas.Header closeButton className="d-flex align-items-center">
										<Offcanvas.Title>
											Фильтры ({filterObject.reduce((sum, { values }) => sum + values.length, 0) + variantsFilter.length})
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
						<div
							className="d-none d-lg-block pe-2 me-3 sticky-top pb-4"
							style={{ top: "80px", zIndex: 0, height: "80vh", overflowY: "scroll" }}
						>
							<div className="text-center">
								<Button variant="link" onClick={() => scrollFilterHandler()}>
									<svg width="18" height="8" viewBox="0 0 18 8" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M0 8L9 0L18 8" stroke="#39261F" />
									</svg>
								</Button>
							</div>
							<div ref={filterContainer} style={{ height: "60vh", overflowY: "scroll" }}>
								<Filters />
							</div>
							<div className="text-center">
								<Button variant="link" onClick={() => scrollFilterHandler(true)}>
									<svg width="18" height="8" viewBox="0 0 18 8" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M0 0L9 8L18 0" stroke="#39261F" />
									</svg>
								</Button>
							</div>
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