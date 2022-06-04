import { FC, useEffect } from "react"
import { Button, ButtonGroup, Dropdown } from "react-bootstrap"
import { useDrop } from "react-dnd"
import { NavLink } from 'react-router-dom'
import ButtonComponent from '../../components/ButtonComponent'
import { Product } from "../../../shared"
import { showBindLabelModal } from "../../application/bindLabelModalSlice"
import { useAppDispatch } from "../../application/hooks"
import { useResetProductBindMutation } from "../../application/product.service"

interface IProps {
	bindId: string
	disabled?: boolean
	productId: string
	productLabel: string
	products: Product["binds"][0]["products"]
	refetchProducts?: () => any
	title: string
}

const ProductItemBindDropdown: FC<IProps> = ({ bindId, disabled, products, productId, productLabel, refetchProducts, title }) => {
	const [rebind, { isLoading, isSuccess }] = useResetProductBindMutation()
	const dispatch = useAppDispatch()

	const [{ isOver }, drop] = useDrop<{ bindProductId: string }, {}, {isOver: boolean}>(() => ({
		accept: "product",
		collect: (monitor) => ({
			isOver: monitor.isOver()
		}),
		drop: (item) => {
			const { bindProductId } = item
			dispatch(showBindLabelModal({ bindId, bindProductId, productId }))
			return item
		},
	}))

	useEffect(() => {
		if ( isSuccess && refetchProducts ) {
			refetchProducts()
		}
	}, [isSuccess, refetchProducts])

    return (
		<div>
			<Dropdown as={ButtonGroup} ref={drop}>
				<Button variant={isOver ? "success" : "primary"}>
					{title} ({productLabel})
				</Button>
				<Dropdown.Toggle
					split
					variant={isOver ? "success" : "primary"}
					disabled={products.length === 0}
				/>
				<Dropdown.Menu>
					{products.map(({ label, product }, index) => (
						<Dropdown.Item
							href="#/action-1"
							key={`${bindId}-${index}`}
						>
							<div className="hstack gap-2 justify-content-between">
								<div>
									<NavLink
										to={`/admin/products/product/${product}`}
									>
										{label}
									</NavLink>
								</div>
								<div>
									<ButtonComponent
										disabled={disabled}
										isLoading={isLoading}
										onClick={() =>
											rebind({
												id: productId,
												body: {
													bindId,
													productId: product,
												},
											})
										}
									>
										<small>Отвязать</small>
									</ButtonComponent>
								</div>
							</div>
						</Dropdown.Item>
					))}
				</Dropdown.Menu>
			</Dropdown>
		</div>
	)
}

export default ProductItemBindDropdown