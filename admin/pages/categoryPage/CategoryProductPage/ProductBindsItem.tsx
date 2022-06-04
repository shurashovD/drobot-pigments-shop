import { FC } from "react"
import { Badge, Button, ListGroup } from "react-bootstrap"
import { useRmBindMutation } from "../../../application/product.service"
import ButtonComponent from "../../../components/ButtonComponent"

interface IProps {
    bindId: string
    childrenCount: number
    disabled: boolean
	editHandler: (id: string) => void
	productLabel: string
    productId: string
    title: string
}

const ProductBindsItem: FC<IProps> = ({ bindId, childrenCount, disabled, editHandler, productLabel, productId, title }) => {
    const [rmBind, { isLoading }] = useRmBindMutation()

    return (
		<ListGroup.Item className="hstack gap-2">
			<div>
				<Button variant="link" onClick={() => editHandler(bindId)}>
					{title} ({productLabel})
				</Button>
			</div>
			{childrenCount === 0 ? (
				<div className="ms-auto">
					<ButtonComponent
						variant="link"
						className="text-center ms-auto text-danger"
						isLoading={isLoading}
						disabled={disabled}
						onClick={() =>
							rmBind({ id: productId, body: { bindId } })
						}
					>
						<small>Удалить</small>
					</ButtonComponent>
				</div>
			) : (
				<div className="ms-auto">
					<Badge bg="primary" pill className="ms-auto">
						{childrenCount}
					</Badge>
				</div>
			)}
		</ListGroup.Item>
	)
}

export default ProductBindsItem