import { Button, Col, Row } from "react-bootstrap"
import { setAllProps } from "../../../../application/compareSlice"
import { useAppDispatch, useAppSelector } from "../../../../application/hooks"
import RadioComponent from "../../../../components/RadioComponent"

const Settings = () => {
    const { allProps } = useAppSelector(state => state.compareSlice)
    const dispatch = useAppDispatch()

    return (
		<Row>
			<Col className="d-flex align-items-center">
				<RadioComponent checked={allProps} onChange={() => dispatch(setAllProps(true))} />
				<Button variant="link" className="text-start p-0 ms-2" onClick={() => dispatch(setAllProps(true))}>
					Все характеристики
				</Button>
			</Col>
			<Col className="d-flex align-items-center">
				<RadioComponent checked={!allProps} onChange={() => dispatch(setAllProps(false))} />
				<Button variant="link" className="text-start p-0 ms-2" onClick={() => dispatch(setAllProps(false))}>
					Только различия
				</Button>
			</Col>
		</Row>
	)
}

export default Settings