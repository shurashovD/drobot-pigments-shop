import { FC, useCallback, useEffect, useRef, useState } from "react"
import { Button, Col, Row, Spinner } from "react-bootstrap"
import { ICategorySiteProduct } from "../../../shared"
import { useGetProductsQuery } from "../../application/category.service"
import { nextPage, setFiltersLength } from "../../application/filtersSlice"
import { useAppDispatch, useAppSelector } from "../../application/hooks"
import ProductCard from "../../components/card/ProductCard"
import Intro from "./Intro"

interface IProps {
    categoryId: string
}

const limit = 4

const Products: FC<IProps> = ({ categoryId }) => {
    const [state, setState] = useState<ICategorySiteProduct[]>([])
	const [prices, setPrices] = useState<{ min?: number, max?: number }>({ min: undefined, max: undefined })
	const { filters, page, variantsFilter, minPrice, maxPrice } = useAppSelector(state => state.filtersSlice)
    const {data, isLoading, isFetching, isSuccess} =
		useGetProductsQuery({ id: categoryId, filters, limit, page, variantsFilter, minPrice: prices.min, maxPrice: prices.max }, { refetchOnMountOrArgChange: true })
	const dispatch = useAppDispatch()
	const timerId = useRef<ReturnType <typeof setTimeout>>()
    const formatter = useRef(
        Intl.NumberFormat('ru', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0
        })
    )
	
	const scrollHandler = useCallback(() => {
		if (!data || isLoading || isFetching) return
		const footerHeight = document.getElementById("footer-component")?.offsetHeight || 100
		const windowHeignth = document.documentElement.clientHeight
		const scrollHeight = Math.max(
			document.body.scrollHeight,
			document.documentElement.scrollHeight,
			document.body.offsetHeight,
			document.documentElement.offsetHeight,
			document.body.clientHeight,
			document.documentElement.clientHeight
		)
		const trigger = scrollHeight - windowHeignth - footerHeight - Math.round(window.pageYOffset) - 100 < 0
		if (trigger && Math.ceil(data.length / limit) > page) {
			dispatch(nextPage())
		}
	}, [data, isLoading, isFetching, dispatch, nextPage])

    useEffect(() => {
        if ( isSuccess && data && data.products ) {
			if ( page === 1 ) {
				setState(data.products)
			} else {
				setState((state) => {
					const goods = data.products.filter(({ productId, variantId }) => {
						if ( variantId ) {
							return !state.some((item) => (item.variantId === variantId))
						} else {
							return !state.some((item) => (item.productId === productId))
						}
					})
					return state.concat(goods)
				})
			}
			dispatch(setFiltersLength(data.filtersFieldsLength))
        }
    }, [data, dispatch, page, setFiltersLength])

	useEffect(() => {
		if ( timerId.current ) {
			clearTimeout(timerId.current)
		}
		timerId.current = setTimeout(() => {
			setPrices({ max: maxPrice, min: minPrice })
		}, 400)
	}, [maxPrice, minPrice])

	useEffect(() => {
		document.addEventListener('scroll', scrollHandler)
		return () => {
			document.removeEventListener("scroll", scrollHandler)
		}
	}, [scrollHandler])

    return (
		<Row className="g-4 gy-6">
			<Intro categoryId={categoryId} />
			{!isLoading && !isFetching && state.length === 0 && (
				<Col xs={12} className="text-center p-4">
					<span>Товары отсутсвуют</span>
				</Col>
			)}
			{state.map((item) => (
				<Col key={`${item.productId}_${item.variantId}`} xs={6} md={6} lg={3}>
					<ProductCard
						id={item.productId}
						img={item.img}
						price={formatter.current.format(item.price)}
						title={item.productTitle}
						variantId={item.variantId}
						variantTitle={item.variantTitle}
					/>
				</Col>
			))}

			{isLoading || isFetching ? (
				<Col xs={12} className="text-center p-4">
					<Spinner animation="border" variant="secondary" />
				</Col>
			) : (
				<Col xs={12} className="text-center">
					{data && Math.ceil(data.length / limit) > page && (
						<Button variant="outline-primary" onClick={() => (Math.ceil(data.length / limit) > page ? dispatch(nextPage()) : {})}>
							Ещё
						</Button>
					)}
				</Col>
			)}
		</Row>
	)
}

export default Products