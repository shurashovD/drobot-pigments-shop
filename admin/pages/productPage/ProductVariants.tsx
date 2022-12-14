import classNames from "classnames"
import { FC } from "react"
import { Badge, ListGroup, Stack } from "react-bootstrap"
import { Product } from "../../../shared"
import { useAppDispatch, useAppSelector } from "../../application/hooks"
import { setCheckedVariant } from "../../application/productPageSlice"

interface IProps {
	variantsLabel?: string
    variants: Product['variants']
}

const ProductVariants: FC<IProps> = ({ variantsLabel, variants }) => {
	const { checkedVariant } = useAppSelector(state => state.productPageSlice)
	const dispatch = useAppDispatch()

    return (
		<div className="border p-3 rounded">
			<div className="mb-2">
				{variantsLabel}
			</div>
			<ListGroup variant="flush">
				{variants.map(({ id, name, value }) => (
					<ListGroup.Item key={id} as="button" onClick={() => dispatch(setCheckedVariant(id))}>
						<Stack
							direction="horizontal"
							gap={3}
							className="justify-content-between"
						>
							<div className={classNames({ "text-primary": id === checkedVariant })}>{name}</div>
							<div>
								<Badge>{value}</Badge>
							</div>
						</Stack>
					</ListGroup.Item>
				))}
			</ListGroup>
		</div>
	)
}

export default ProductVariants