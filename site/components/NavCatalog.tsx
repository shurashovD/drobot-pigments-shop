import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Col, Collapse, Nav, Row, Stack, Tab } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { resetFilters } from "../application/filtersSlice";
import { useAppDispatch, useAppSelector } from "../application/hooks";
import { hideNavCatalog } from "../application/navCatalogSlice";

const NavCatalog = () => {
    const { show } = useAppSelector(state => state.navCatalogSlice)
	const { categories } = useAppSelector(state => state.categoriesSlice)
	const [pane, setPane] = useState("0")
	const candidatePane = useRef<string|undefined>()
	const navigate = useNavigate()
	const dispatch = useAppDispatch()

	const clickHandler = (to: string) => {
		dispatch(resetFilters())
		navigate(to)
		dispatch(hideNavCatalog())
		setPane("0")
	}

	const hoverHandler = (key: string) => {
		candidatePane.current = key
		setTimeout(() => {
			if ( candidatePane.current === key ) {
				setPane(key)
			}
		}, 250)
		
	}

	const leaveHandler = () => {
		candidatePane.current = undefined
	}

	const handler = useCallback((event: any) => {
		if ( !event.path.some((item: any) => item.classList?.contains('nav-catalog-container')) ) {
			dispatch(hideNavCatalog())
			setPane("0")
		}
	}, [])

	useEffect(() => {
		if ( show ) {
			setTimeout(() => {
				document.addEventListener("click", handler)
			})
		}
		else {
			document.removeEventListener("click", handler)
		}
		return () => {
			document.removeEventListener("click", handler)
		}
	}, [handler, show])

    return (
		<Collapse in={show}>
			<div className="position-absolute top-0 start-0 end-0 bottom-0 nav-catalog-container">
				<Tab.Container activeKey={pane}>
					<Row className="m-0 p-0" style={{ borderBottom: "2px solid #ab9a9a" }}>
						<Col xs={3} className="p-0 py-4" style={{ backgroundColor: "#f1f1f1" }}>
							<Nav variant="pills" className="flex-column" id="navCatalogTab">
								{categories.map(({ _id, title }) => (
									<Nav.Item key={_id?.toString()} onMouseOver={() => hoverHandler(_id?.toString())} onMouseLeave={leaveHandler}>
										<Nav.Link
											eventKey={_id?.toString()}
											onClick={() => clickHandler(`/category/${_id?.toString()}/[]`)}
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
								{categories.map(({ _id: categoryId, filters }) => (
									<Tab.Pane key={`tab_${categoryId?.toString()}`} eventKey={categoryId?.toString()}>
										<Row xs={4} className="py-5 px-4 justify-content-start">
											{filters.map((item) => (
												<Col key={item._id?.toString()}>
													<Stack gap={2}>
														<div className="text-uppercase text-muted mb-4">{item.title}</div>
														{item.fields.map(({ _id, value }) => {
															const filters: any[] = [{ filterId: item._id?.toString(), valueIds: [_id?.toString()] }]
															return (
																<div key={_id?.toString()}>
																	<Button
																		variant="link"
																		onClick={() =>
																			clickHandler(`/category/${categoryId}/${JSON.stringify(filters)}`)
																		}
																		className="p-0 text-start"
																	>
																		{value}
																	</Button>
																</div>
															)
														})}
													</Stack>
												</Col>
											))}
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