import { ChangeEvent, FC, useEffect, useState } from "react"
import { Button, Form, ListGroup } from "react-bootstrap"
import { useUpdateBindMutation } from "../../../application/product.service"
import ButtonComponent from "../../../components/ButtonComponent"

interface IProps {
    bindId: string
	cancelHandler: () => void
    disabled: boolean
    productId: string
	bindProductLabel: string
    title: string
}

const ProductBindsEdit: FC<IProps> = ({
	bindId,
	cancelHandler,
	disabled,
	productId,
	bindProductLabel,
	title,
}) => {
	const [state, setState] = useState({ bindTitle: title, productLabel: bindProductLabel })
	const [updBind, { isLoading, isSuccess }] = useUpdateBindMutation()

	useEffect(() => {
		if (isSuccess) {
			cancelHandler()
		}
	}, [isSuccess, cancelHandler])

	return (
		<ListGroup.Item className="vstack gap-2">
			<Form.Label>
				<span>Название связи</span>
				<Form.Control
					name="bindTitle"
					value={state.bindTitle}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setState((state) => ({
							...state,
							[e.target.name]: e.target.value,
						}))
					}
					placeholder="Новая связь"
				/>
			</Form.Label>
			<Form.Label>
				<span>Название товара в связи</span>
				<Form.Control
					name="productLabel"
					value={state.productLabel}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setState((state) => ({
							...state,
							[e.target.name]: e.target.value,
						}))
					}
				/>
			</Form.Label>
			<div className="hstack gap-3">
				<ButtonComponent
					isLoading={isLoading}
					disabled={
						disabled ||
						state.bindTitle === "" ||
						state.productLabel === title ||
						state.productLabel === "" ||
						state.productLabel === bindProductLabel
					}
					onClick={() =>
						updBind({
							id: productId,
							body: { bindId, ...state },
						})
					}
				>
					<small>Сохранить</small>
				</ButtonComponent>
				<Button
					size="sm"
					variant="secondary"
					disabled={disabled || isLoading}
					onClick={cancelHandler}
				>
					<small>Отмена</small>
				</Button>
			</div>
		</ListGroup.Item>
	)
}

export default ProductBindsEdit