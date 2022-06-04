import { ChangeEvent, FC } from "react"
import { Form, Spinner } from "react-bootstrap"
import {
	useResetProductFilterMutation,
	useSetProductFilterMutation,
} from "../../../application/product.service"

interface IProps {
    checked: boolean
    disabled: boolean
    fieldId: string
    productId: string
    value: string
}

const ProductFilterItemField: FC<IProps> = ({ checked, disabled, fieldId, productId, value }) => {
	const [setFilter, { isLoading }] = useSetProductFilterMutation()
	const [resetFilter, { isLoading: resetLoading }] =
		useResetProductFilterMutation()

	const handler = (event: ChangeEvent<HTMLInputElement>) => {
		event.target.checked
			? setFilter({ id: productId, body: { fieldId } })
			: resetFilter({ id: productId, body: { fieldId } })
	}

	return (
		<div className="hstack gap-3">
			<div className={`fw-${checked ? 'bold' : 'normal'}`}>{value}</div>
			<div className="ms-auto">
				{isLoading || resetLoading ? (
					<div className="text-center">
						<Spinner
							variant="secondary"
							size="sm"
							animation="border"
						/>
					</div>
				) : (
					<Form.Check
						checked={checked}
						disabled={disabled}
						onChange={handler}
					/>
				)}
			</div>
		</div>
	)
}

export default ProductFilterItemField
