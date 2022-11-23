import { FC } from "react"
import { Accordion } from "react-bootstrap"
import { useAppSelector } from "../../application/hooks"
import FitlerItemField from "./FitlerItemField"

interface IProps {
    id: string
    fields: any
    title: string
}

const FilterItem: FC<IProps> = ({ id, fields, title }) => {
	const checkedFiledsLength = useAppSelector(state => state.filtersSlice.filterObject.find(({ filterId }) => (filterId === id))?.values.length || 0)

    return (
		<Accordion.Item eventKey={id} className="mb-6 bg-transparent">
			<Accordion.Header className="border-bottom border-muted">
				<div className="text-uppercase">
					{title}{" "}
					{checkedFiledsLength !== 0 && <>({checkedFiledsLength})</>}
				</div>
			</Accordion.Header>
			<Accordion.Body className="pt-4">
				{fields.map(({ value, _id }: any) => (
					<FitlerItemField
                        key={_id}
                        id={_id}
                        filterId={id}
                        value={value}
                    />
				))}
			</Accordion.Body>
		</Accordion.Item>
	)
}

export default FilterItem