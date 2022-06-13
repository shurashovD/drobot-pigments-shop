import { FC, UIEvent, useEffect, useRef, useState } from "react"
import { Button, ListGroup, Spinner } from "react-bootstrap"
import { useGetProductsQuery } from "../../application/category.service"
import { useAppDispatch, useAppSelector } from "../../application/hooks"
import AddProductsModal from "./AddProductsModal"
import ProductItem from "./ProductItem"
import { Product } from "../../../shared"
import { nextPage } from "../../application/filtersSlice"

interface IProps {
    categoryId: string
	disabled?: boolean
	products: string[]
	refetchCategory?: () => any
}

const Products: FC<IProps> = ({ categoryId, disabled, products, refetchCategory }) => {
	const { limit, page } = useAppSelector(state => state.filtersSlice)
    const filters = useAppSelector(state => state.filtersSlice.filterObject.map<string[]>(({ values }) => values).filter(item => item.length > 0))
	const [rows, setRows] = useState<Product[]>([])
    const { data, isLoading, isFetching, refetch, isSuccess } = useGetProductsQuery({ id: categoryId, filters, limit, page }, { refetchOnMountOrArgChange: true })
    const [showAddProductsModal, setShowAddProductsModal] = useState(false)
	const container = useRef<HTMLDivElement | null>(null)
	const dispatch = useAppDispatch()

	const moreHandler = () => {
		if ( !isLoading && !isFetching ) {
			if (data && limit * page < data?.length) {
				dispatch(nextPage())
			}
		}
	}

	const scrollHandler = (event: UIEvent<HTMLElement>) => {
		const { scrollHeight, scrollTop, clientHeight } = event.currentTarget
		if (scrollHeight - 50 < scrollTop + clientHeight) {
			moreHandler()
		}
	}

	useEffect(() => {
		refetch()
	}, [products, refetch])

	useEffect(() => {
		if ( isSuccess && data ) {
			if ( page === 1 ) {
				setRows(data.products)
			}
			else {
				setRows((state) =>
					state.concat(
						data.products.filter(
							({ id }) => !state.some((item) => id === item.id)
						)
					)
				)
			}
		}
	}, [isSuccess, data, page])

    return (
		<div
			ref={container}
			className="border p-1 position-relative"
			style={{ height: "80vh", overflowY: "scroll" }}
			onScroll={scrollHandler}
		>
			<AddProductsModal
				categoryId={categoryId}
				onHide={() => setShowAddProductsModal(false)}
				show={showAddProductsModal}
			/>
			<div className="sticky-top mb-3">
				<Button
					size="sm"
					className="rounded-0"
					disabled={isFetching}
					onClick={() => setShowAddProductsModal(true)}
				>
					Добавить товары
				</Button>
			</div>
			<ListGroup as="ul" variant="flush">
				{rows.map((item) => (
					<ProductItem
						key={item.id}
						categoryId={categoryId}
						disabled={isFetching || disabled}
						productId={item.id}
						name={item.name}
						refetchCategory={refetchCategory}
						refetchProducts={refetch}
						variantLabel={item.variantsLabel}
						variants={item.variants}
					/>
				))}
			</ListGroup>
			<div className="text-center p-3">
				{isLoading || isFetching ? (
					<Spinner animation="border" size="sm" variant="secondary" />
				) : data && limit * page < data?.length ? (
					<Button variant="outline-primary" onClick={moreHandler}>
						Показать ещё
					</Button>
				) : (
					<></>
				)}
				{!isLoading && !isFetching && rows.length === 0 && (
					<h5 className="text-secondary">
						Нет товаров, удовлетворяющих критериям поиска
					</h5>
				)}
			</div>
		</div>
	)
}

export default Products