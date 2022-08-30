import { FC, useCallback, useEffect, useRef, useState } from "react"
import { Button, Col, Row, Spinner } from "react-bootstrap"
import { Product } from "../../../shared"
import { useGetProductsQuery } from "../../application/category.service"
import { nextPage } from "../../application/filtersSlice"
import { useAppDispatch, useAppSelector } from "../../application/hooks"
import ProductCard from "../../components/card/ProductCard"

interface IProps {
    categoryId: string
}

const limit = 4

const Products: FC<IProps> = ({ categoryId }) => {
    const [state, setState] = useState<Product[]>([])
	const { filters, page } = useAppSelector(state => state.filtersSlice)
    const {data, isLoading, isFetching, isSuccess} = useGetProductsQuery({ id: categoryId, filters, limit, page }, { refetchOnMountOrArgChange: true })
	const dispatch = useAppDispatch()
    const formatter = useRef(
        Intl.NumberFormat('ru', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0
        })
    )

	const scrollHandler = useCallback(() => {
		if ( !data || isLoading || isFetching ) return
		const footerHeight =
			document.getElementById("footer-component")?.offsetHeight || 100
		const windowHeignth = document.documentElement.clientHeight
		const scrollHeight = Math.max(
			document.body.scrollHeight,
			document.documentElement.scrollHeight,
			document.body.offsetHeight,
			document.documentElement.offsetHeight,
			document.body.clientHeight,
			document.documentElement.clientHeight
		)
		const trigger = (scrollHeight - windowHeignth - footerHeight - Math.round(window.pageYOffset)) < 0
		if ( trigger && (Math.ceil(data.length / limit) > page) ) {
			dispatch(nextPage())
		}
	}, [isLoading, isFetching, data, dispatch, nextPage])

    useEffect(() => {
        if ( isSuccess && data && data.products ) {
			if ( page === 1 ) {
				setState(data.products)
			} else {
				setState((state) =>
					state.concat(
						data.products.filter(
							({ id }) => !state.some((item) => item.id === id)
						)
					)
				)
			}
        }
    }, [data, page])

	useEffect(() => {
		document.addEventListener('scroll', scrollHandler)
		return () => {
			document.removeEventListener('scroll', scrollHandler)
		}
	}, [scrollHandler])

    return (
		<Row className="g-4 gy-6">
			{!isLoading && !isFetching && state.length === 0 && (
				<Col xs={12} className="text-center p-4">
					<span>Товары отсутсвуют</span>
				</Col>
			)}
			{state.map((item) => (
				<Col key={item.id} xs={12} md={6} lg={3}>
					<ProductCard
						id={item.id}
						img={item.photo?.[0]}
						price={formatter.current.format(Math.min(...item.variants.map(({ price }) => price / 100)) || item.price || 0)}
						title={item.name}
						variantsLabel={item.variantsLabel}
						variants={item.variants}
					/>
				</Col>
			))}
			<Col xs={12} className="text-center">
				{data && Math.ceil(data.length / limit) > page && (
					<Button variant="outline-primary" onClick={() => (Math.ceil(data.length / limit) <= page + 1 ? dispatch(nextPage()) : {})}>
						Ещё
					</Button>
				)}
			</Col>
			{(isLoading || isFetching) && (
				<Col xs={12} className="text-center p-4">
					<Spinner animation="border" variant="secondary" />
				</Col>
			)}
		</Row>
	)
}

export default Products