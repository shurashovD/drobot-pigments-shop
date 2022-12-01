import { FC, useEffect, useRef, useState } from "react"
import { Accordion, Badge } from "react-bootstrap"
import { IFilter } from "../../../shared"
import ProductFilterItemField from "./ProductFilterItemField"

interface IProps {
    disabled: boolean
	eventKey: string
    productId: string
    title: string
    fields: IFilter['fields']
    values: string[]
}

const ProductFilterItem: FC<IProps> = ({ disabled, eventKey, productId, title, fields, values }) => {
	const [checkedCount, setCheckedCount] = useState(0)

	useEffect(() => {
		setCheckedCount(fields.filter(({ _id }) =>
			values.some((item) => item === _id?.toString())
		).length)
	})

    return (
		<Accordion.Item eventKey={eventKey}>
			<Accordion.Header>
				<div className="hstack gap-3">
					<div>{title}</div>
					{checkedCount > 0 && (
						<div className="mas-auto">
							<Badge bg="primary" pill>
								{checkedCount}
							</Badge>
						</div>
					)}
				</div>
			</Accordion.Header>
			<Accordion.Body>
				{fields.map(({ _id, value }) => (
					<ProductFilterItemField
						key={_id?.toString()}
						checked={values.some(
							(item) => item === _id?.toString()
						)}
						disabled={disabled}
						fieldId={_id?.toString() || ""}
						productId={productId}
						value={value}
					/>
				))}
			</Accordion.Body>
		</Accordion.Item>
	)
}

export default ProductFilterItem