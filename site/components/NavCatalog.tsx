import { Col, Collapse, Nav, Row, Stack, Tab } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useAppSelector } from "../application/hooks";

const NavCatalog = () => {
    const { show } = useAppSelector(state => state.navCatalogSlice)
	const { categories } = useAppSelector(state => state.categoriesSlice)

    return (
		<Collapse in={show}>
			<div
				className={`position-absolute top-0 start-0 end-0 bottom-0`}
			>
				<Tab.Container>
					<Row className="m-0 p-0">
						<Col xs={3} className="bg-light p-0 py-4">
							<Nav
								variant="pills"
								className="flex-column"
								id="navCatalogTab"
							>
								{categories.map(({ _id, title }) => (
									<Nav.Item key={_id?.toString()}>
										<Nav.Link
											eventKey={_id?.toString()}
											className="ps-6 py-4 text-uppercase"
										>
											{title}
										</Nav.Link>
									</Nav.Item>
								))}
							</Nav>
						</Col>
						<Col xs={9} className="pe-6 bg-white">
							<Tab.Content>
								{categories.map(({ _id, filters }) => (
									<Tab.Pane
										key={`tab_${_id?.toString()}`}
										eventKey={_id?.toString()}
									>
										<Row
											xs={4}
											className="py-5 px-4 justify-content-start"
										>
											{filters.map(
												({ _id, fields, title }) => (
													<Col key={_id?.toString()}>
														<Stack gap={2}>
															<div className="text-uppercase text-secondary mb-4">
																{title}
															</div>
															{fields.map(
																({
																	_id,
																	value,
																}) => (
																	<div
																		key={_id?.toString()}
																	>
																		<NavLink
																			to={`/`}
																		>
																			{
																				value
																			}
																		</NavLink>
																	</div>
																)
															)}
														</Stack>
													</Col>
												)
											)}
										</Row>
									</Tab.Pane>
								))}
							</Tab.Content>
						</Col>
					</Row>
				</Tab.Container>
			</div>
		</Collapse>
	)
}

export default NavCatalog