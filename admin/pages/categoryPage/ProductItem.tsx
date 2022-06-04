import { FC, useEffect } from "react"
import { ListGroup } from "react-bootstrap"
import { NavLink } from "react-router-dom"
import { Product } from "../../../shared"
import { successAlert } from "../../application/alertSlice"
import { useRmProductMutation } from "../../application/category.service"
import { useAppDispatch } from "../../application/hooks"
import ButtonComponent from "../../components/ButtonComponent"
import { useDrag } from "react-dnd"
import ProductItemBindDropdown from "./ProductItemBindDropdown"

interface IProps {
	binds: Product["binds"]
	categoryId: string
	disabled?: boolean
	productId: string
	name: string
	refetchCategory?: () => any
	refetchProducts?: () => any
}

const ProductItem: FC<IProps> = ({ binds, categoryId, disabled, productId, name, refetchCategory, refetchProducts }) => {
	const [remove, { isLoading, isSuccess }] = useRmProductMutation()
	const dispatch = useAppDispatch()

	const [{ isDragging }, drag] = useDrag<{ bindProductId: string }, {}, { isDragging: boolean }>(() => ({
		type: "product",
		item: { bindProductId: productId },
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
			endDrag: monitor.getDropResult(),
		}),
	}))

	useEffect(() => {
		if ( isSuccess ) {
			dispatch(successAlert('Товар удалён из категории'))
			if ( refetchCategory ) {
				refetchCategory()
			}
		}
	}, [dispatch, isSuccess, refetchCategory, successAlert])

    return (
		<ListGroup.Item ref={drag}>
			<div className={`hstack gap-3 opacity-${isDragging ? "25" : "1"}`}>
				<div>
					<NavLink to={`/admin/products/product/${productId}`}>
						{name}
					</NavLink>
				</div>
				{binds.map((item) => (
					<ProductItemBindDropdown
						key={item.id}
						bindId={item.id}
						disabled={disabled || isLoading}
						productLabel={item.productLabel}
						productId={productId}
						products={item.products}
						refetchProducts={refetchProducts}
						title={item.title}
					/>
				))}
				<div className="ms-auto">
					<ButtonComponent
						disabled={disabled}
						variant="link"
						className="text-danger"
						isLoading={isLoading}
						onClick={() =>
							remove({ id: categoryId, body: { productId } })
						}
					>
						Удалить
					</ButtonComponent>
				</div>
			</div>
		</ListGroup.Item>
	)
}

export default ProductItem