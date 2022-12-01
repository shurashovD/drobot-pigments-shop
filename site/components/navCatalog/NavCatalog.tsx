import { useCallback, useEffect } from "react";
import { Col, Collapse, Nav, Row, Tab } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../application/hooks";
import { hideNavCatalog, setPane } from "../../application/navCatalogSlice";
import CategoryItem from "./CategoryItem"
import SubCategories from "./SubCategories"

const NavCatalog = () => {
    const { pane, show } = useAppSelector(state => state.navCatalogSlice)
	const { categories } = useAppSelector(state => state.categoriesSlice)
	const dispatch = useAppDispatch()

	const handler = useCallback((event: any) => {
		if ( !event.path.some((item: any) => item.classList?.contains('nav-catalog-container')) ) {
			dispatch(hideNavCatalog())
			dispatch(setPane())
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
								{categories.map(({ _id, subCategories, title }) => (
									<CategoryItem
										key={_id.toString()}
										hasSubCategories={!!subCategories.length}
										id={_id.toString()}
										title={title}
									/>
								))}
							</Nav>
						</Col>
						<Col xs={9} className="pe-6 bg-white">
							<Tab.Content>
								{categories.map(({ _id }) => (
									<SubCategories key={`tab_${_id.toString()}`} categoryId={_id.toString()} />
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