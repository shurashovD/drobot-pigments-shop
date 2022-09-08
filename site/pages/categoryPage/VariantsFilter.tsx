import { FC } from "react"
import { Accordion } from "react-bootstrap"
import VariantsFilterField from "./VariantsFilterField"

interface IProps {
    variantsLabel: string
    variantsValues: string[]
}

const VariantsFilter: FC<IProps> = ({ variantsLabel, variantsValues }) => {

    return (
		<Accordion.Item eventKey={variantsLabel} className="mb-6 bg-transparent">
			<Accordion.Header className="border-bottom border-muted">
				<div className="text-uppercase">{variantsLabel}</div>
			</Accordion.Header>
			<Accordion.Body className="pt-4">
				{variantsValues.map(value => (
					<VariantsFilterField key={value} value={value} />
				))}
			</Accordion.Body>
		</Accordion.Item>
	)
}

export default VariantsFilter