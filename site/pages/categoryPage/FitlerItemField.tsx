import { FC } from "react"
import { Form } from 'react-bootstrap'
import { useAppDispatch, useAppSelector } from '../../application/hooks'
import { toggleFilterValue } from '../../application/filtersSlice'

interface IProps {
    id: string
    filterId: string
    value: string
}

const FitlerItemField: FC<IProps> = ({ id, filterId, value }) => {
    const checked = useAppSelector(state => state.filtersSlice.filterObject.find(item => item.filterId === filterId)?.values.includes(id) || false)
	const productsLength = useAppSelector(state => state.filtersSlice.filtersFieldLength.find(({ fieldId }) => fieldId === id)?.productsLength)
    const dispatch = useAppDispatch()

	if ( productsLength === 0 ) {
		return null
	}

    return (
		<div className="d-flex align-items-center mb-4">
			<Form.Check checked={checked} onChange={() => dispatch(toggleFilterValue({ filterId, valueId: id }))} />
			<div className={`ms-2 ${productsLength === 0 && "text-muted"}`}>{value}</div>
			<div className="ms-2 text-muted">
				<small>{productsLength}</small>
			</div>
		</div>
	)
}

export default FitlerItemField