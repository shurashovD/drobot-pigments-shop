import { FC, useEffect } from "react"
import { ListGroup } from "react-bootstrap"
import { NavLink } from "react-router-dom"
import { Product } from "../../../shared"
import { successAlert } from "../../application/alertSlice"
import { useRmProductMutation } from "../../application/category.service"
import { useAppDispatch } from "../../application/hooks"
import ButtonComponent from "../../components/ButtonComponent"
import ProductItemVariants from "./ProductItemVariants"

interface IProps {
	categoryId: string
	disabled?: boolean
	productId: string
	name: string
	variantLabel?: string
	variants: Product["variants"]
	refetchCategory?: () => any
	refetchProducts?: () => any
}

const ProductItem: FC<IProps> = ({ categoryId, disabled, productId, name, refetchCategory, variantLabel, variants }) => {
	const [remove, { isLoading, isSuccess }] = useRmProductMutation()
	const dispatch = useAppDispatch()

	useEffect(() => {
		if ( isSuccess ) {
			dispatch(successAlert('Товар удалён из категории'))
			if ( refetchCategory ) {
				refetchCategory()
			}
		}
	}, [dispatch, isSuccess, refetchCategory, successAlert])

    return (
		<ListGroup.Item>
			<div className="hstack gap-3">
				<div>
					<NavLink to={`/admin/products/product/${productId}`}>
						{name}
					</NavLink>
				</div>
				{variantLabel && (
					<div>
						<ProductItemVariants
							name={variantLabel}
							variants={variants}
							disabled={disabled || isLoading}
						/>
					</div>
				)}
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