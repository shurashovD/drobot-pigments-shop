import { FC } from "react"
import { Form } from 'react-bootstrap'
import { useAppDispatch, useAppSelector } from '../../application/hooks'
import { toggleFilterValue } from '../../application/filtersSlice'
import { createSearchParams } from "react-router-dom"

interface IProps {
    id: string
    filterId: string
    value: string
    productsLength: number
}

const FitlerItemField: FC<IProps> = ({ id, filterId, value, productsLength }) => {
    const checked = useAppSelector(state => state.filtersSlice.filterObject.find(item => item.filterId === filterId)?.values.includes(id) || false)
    const dispatch = useAppDispatch()

    return (
		<div className="d-flex align-items-center mb-4">
			<Form.Check checked={checked} disabled={productsLength === 0} onChange={() => dispatch(toggleFilterValue({ filterId, valueId: id }))} />
			<div className={`ms-2 ${productsLength === 0 && "text-muted"}`}>{value}</div>
			<div className="ms-2 text-muted">
				<small>{productsLength}</small>
			</div>
		</div>
	)
}

export default FitlerItemField