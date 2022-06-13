import { FC } from "react"
import { Dropdown } from "react-bootstrap"
import { NavLink } from 'react-router-dom'
import { Product } from "../../../shared"

interface IProps {
	disabled?: boolean
	name: string
	variants: Product["variants"]
}

const ProductItemVariants: FC<IProps> = ({ disabled, name, variants }) => {
    return (
		<div>
			<Dropdown>
				<Dropdown.Toggle split variant="primary" disabled={disabled}>
					{name}
				</Dropdown.Toggle>
				<Dropdown.Menu>
					{variants.map(({ id, value }, index) => (
						<Dropdown.Item href="#/action-1" key={`${id}-${index}`}>
							<div className="hstack gap-2 justify-content-between">
								<div>
									<NavLink
										to={`/admin/products/product/${id}`}
									>
										{value}
									</NavLink>
								</div>
							</div>
						</Dropdown.Item>
					))}
				</Dropdown.Menu>
			</Dropdown>
		</div>
	)
}

export default ProductItemVariants