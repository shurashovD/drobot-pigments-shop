import { useEffect } from "react"
import { Button, Col, Collapse, Container, Row, Tab } from "react-bootstrap"
import { useAppDispatch, useAppSelector } from "../../../application/hooks"
import { createPromocode, resetLastPromocodeName, watchAllPromocodes } from "../../../application/profilePromocodesSlice"
import AllPromocodes from "./AllPromocodes"
import CreatePromocode from "./CreatePromocode"

const Promocodes = () => {
	const { activeTab, lastPromocodeName, isCreate } = useAppSelector(state => state.profilePromocodesSlice)
	const dispatch = useAppDispatch()

	useEffect(() => {
		if (lastPromocodeName) {
			setTimeout(() => {
				dispatch(resetLastPromocodeName())
			}, 4000)
		}
	}, [dispatch, lastPromocodeName, resetLastPromocodeName])

    return (
		<Container fluid="sm">
			<Row>
				<Col xs={12} lg={7}>
					<Tab.Container>
						<Row>
							<Col xs={6} lg={3}>
								<Button
									variant="link"
									className={`${activeTab === "1" && "active"} promocodes-nav__btn`}
									onClick={() => dispatch(watchAllPromocodes())}
								>
									Все промокоды
								</Button>
							</Col>
							<Col xs={6} lg={3}>
								<Button
									variant="link"
									className={`${activeTab === "2" && "active"} promocodes-nav__btn`}
									onClick={() => dispatch(createPromocode())}
								>
									Создать +
								</Button>
							</Col>
						</Row>
						<Tab.Content>
							<Tab.Pane eventKey="1" active={activeTab === "1"}>
								<AllPromocodes />
							</Tab.Pane>
							<Tab.Pane eventKey="2" active={activeTab === "2"}>
								<CreatePromocode />
							</Tab.Pane>
						</Tab.Content>
					</Tab.Container>
				</Col>
				<Col xs={0} lg={3}>
					<Collapse in={!!lastPromocodeName}>
						<div className="text-center bg-secondary p-2">
							Промокод “<b>{lastPromocodeName}</b>” успешно {isCreate ? <>создан</> : <>изменён</>}
						</div>
					</Collapse>
				</Col>
			</Row>
		</Container>
	)
}

export default Promocodes