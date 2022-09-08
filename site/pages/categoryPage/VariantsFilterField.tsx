import { FC } from "react"
import { Form } from "react-bootstrap"
import { toggleVariantsFilter } from "../../application/filtersSlice"
import { useAppDispatch, useAppSelector } from "../../application/hooks"

interface IProps {
	value: string
}

const VariantsFilterField: FC<IProps> = ({ value }) => {
	const checked = useAppSelector(state => state.filtersSlice.variantsFilter.includes(value))
	const dispatch = useAppDispatch()

	return (
		<div className="d-flex align-items-center mb-4">
			<Form.Check checked={checked} onChange={() => dispatch(toggleVariantsFilter(value))} />
			<div className="ms-2">{value}</div>
		</div>
	)
}

export default VariantsFilterField