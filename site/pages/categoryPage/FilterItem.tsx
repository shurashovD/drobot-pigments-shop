import { FC } from "react"
import { Accordion } from "react-bootstrap"
import FitlerItemField from "./FitlerItemField"

interface IProps {
    id: string
    fields: any
    title: string
}

const FilterItem: FC<IProps> = ({ id, fields, title }) => {
    return (
		<Accordion.Item eventKey={id} className="mb-6 bg-transparent">
			<Accordion.Header className="border-bottom border-muted">
				<div className="text-uppercase">{title}</div>
			</Accordion.Header>
			<Accordion.Body className="pt-4">
				{fields.map(({ products, value, _id }: any) => (
					<FitlerItemField
                        key={_id}
                        id={_id}
                        filterId={id}
                        productsLength={products.length}
                        value={value}
                    />
				))}
			</Accordion.Body>
		</Accordion.Item>
	)
}

export default FilterItem