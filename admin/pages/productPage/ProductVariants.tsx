import { FC } from "react"
import { Badge, ListGroup, Stack } from "react-bootstrap"
import { Product } from "../../../shared"

interface IProps {
	variantsLabel?: string
    variants: Product['variants']
}

const ProductVariants: FC<IProps> = ({ variantsLabel, variants }) => {
    return (
		<div>
			<div className="mb-2">
				{variantsLabel}
			</div>
			<ListGroup variant="flush">
				{variants.map(({ id, name, value }) => (
					<ListGroup.Item key={id}>
						<Stack
							direction="horizontal"
							gap={3}
							className="justify-content-between"
						>
							<div>{name}</div>
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