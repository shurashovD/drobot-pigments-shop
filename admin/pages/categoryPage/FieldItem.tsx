import { FC } from "react"
import { Button, Col, Form, Row } from "react-bootstrap"
import { toggleFilterValue } from "../../application/filtersSlice"
import { useAppDispatch, useAppSelector } from "../../application/hooks"

interface IProps {
    editHandler: (id: string) => void
    id: string
    filterId: string
    value: string
}

const FieldItem: FC<IProps> = ({ id, editHandler, filterId, value }) => {
    const checked = useAppSelector(state => state.filtersSlice.filterObject
        .find(item => item.filterId === filterId)?.values
        ?.some((item: string) => item === id) || false)
    const dispatch = useAppDispatch()

    return (
		<Row>
			<Col xs={10}>
                <Button variant="link" size="sm" onClick={() => editHandler(id)}>
                    {value}
                </Button>
            </Col>
			<Col xs={2}>
                <Form.Check
                    checked={checked}
                    onChange={() => dispatch(toggleFilterValue({ filterId, valueId: id }))}
                />
            </Col>
		</Row>
	)
}

export default FieldItem