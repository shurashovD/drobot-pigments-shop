import { Button, Col, Fade, Row } from "react-bootstrap"
import { NavLink } from "react-router-dom"
import { useClearProductsMutation } from "../../../application/compare.service"
import { setAllProps } from "../../../application/compareSlice"
import { useAppDispatch, useAppSelector } from "../../../application/hooks"
import IconCross from "../../../components/icons/IconCross"
import IconDelete from "../../../components/icons/IconDelete"
import RadioComponent from "../../../components/RadioComponent"

const Settings = () => {
	const { allProps, categoryId } = useAppSelector(state => state.compareSlice)
	const [clear, { isLoading }] = useClearProductsMutation()
	const dispatch = useAppDispatch()

    return (
		<Fade in={!!categoryId}>
			<div className="d-flex flex-column justify-content-center h-100">
				<Row className="mb-4 g-0">
					<Col xs={2} className="d-flex justify-content-center align-items-center">
						<RadioComponent checked={allProps} onChange={() => dispatch(setAllProps(true))} />
					</Col>
					<Col xs={10} className="d-flex align-items-center">
						<Button className="p-0 hover-dark text-start" variant="link" onClick={() => dispatch(setAllProps(true))}>
							Все характеристики
						</Button>
					</Col>
				</Row>
				<Row className="mb-4 g-0">
					<Col xs={2} className="d-flex justify-content-center align-items-center">
						<RadioComponent checked={!allProps} onChange={() => dispatch(setAllProps(false))} />
					</Col>
					<Col xs={10} className="d-flex align-items-center">
						<Button className="p-0 hover-dark text-start" variant="link" onClick={() => dispatch(setAllProps(false))}>
							Только различия
						</Button>
					</Col>
				</Row>
				<Row className="mb-4 g-0">
					<Col xs={2} className="d-flex justify-content-center align-items-center">
						<IconCross stroke="#AB9090" />
					</Col>
					<Col xs={10} className="d-flex align-items-center">
						<NavLink to={`/category/${categoryId}/[]`}>Добавить товары</NavLink>
					</Col>
				</Row>
				<Row className="mb-4 g-0">
					<Col xs={2} className="d-flex justify-content-center align-items-center">
						<IconDelete stroke="#AB9090" width={18} />
					</Col>
					<Col xs={10} className="d-flex align-items-center">
						{categoryId &&
							<Button className="p-0 text-muted hover-primary text-start" variant="link" onClick={() => clear({ categoryId })} disabled={isLoading}>
								Очистить список
							</Button>
						}
					</Col>
				</Row>
			</div>
		</Fade>
	)
}

export default Settings