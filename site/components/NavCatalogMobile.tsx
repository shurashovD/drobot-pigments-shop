import { FC, useState } from 'react'
import { Accordion, Button, ListGroup, Offcanvas, OffcanvasProps, Stack } from 'react-bootstrap'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAppSelector } from '../application/hooks'

const NavCatalogMobile: FC<OffcanvasProps> = ({ onHide, show }) => {
    const { categories } = useAppSelector(state => state.categoriesSlice)
    const [openedCategory, setOpenedCategory] = useState<string | undefined>()
	const navigate = useNavigate()

	const clickHandler = (to: string) => {
		navigate(to)
		if ( onHide ) {
			onHide()
		}
	}

    return (
		<Offcanvas show={show} onExit={() => setOpenedCategory(undefined)}>
			<Offcanvas.Header closeButton onHide={onHide}>
				<Offcanvas.Title className="text-uppercase">
					{categories.find(
						({ _id }) => _id?.toString() === openedCategory
					)?.title || "Каталог"}
				</Offcanvas.Title>
			</Offcanvas.Header>
			<Offcanvas.Body>
				{openedCategory ? (
					<Accordion flush>
						<Button className="text-muted" variant="link" onClick={() => setOpenedCategory(undefined)}>
							&larr; назад
						</Button>
						{categories
							.find(
								({ _id }) => _id?.toString() === openedCategory
							)
							?.filters.map((item) => (
								<Accordion.Item
									eventKey={item._id?.toString()}
									key={item._id?.toString()}
								>
									<Accordion.Header className="text-start text-uppercase">
										{item.title}
									</Accordion.Header>
									<Accordion.Body>
										<Stack gap={3}>
											{item.fields.map(
												({ _id, value }) => {
													const filters: any[] = [
														{
															filterId:
																item._id?.toString(),
															valueIds: [
																_id?.toString(),
															],
														},
													]
													return (
														<div
															key={_id?.toString()}
														>
															<Button
																variant="link"
																onClick={() =>
																	clickHandler(
																		`/category/${openedCategory}/${JSON.stringify(
																			filters
																		)}`
																	)
																}
																className="p-0"
															>
																{value}
															</Button>
														</div>
													)
												}
											)}
										</Stack>
									</Accordion.Body>
								</Accordion.Item>
							))}
					</Accordion>
				) : (
					<ListGroup variant="flush">
						{categories.map(({ _id, title }) => (
							<ListGroup.Item
								key={_id?.toString()}
								as="button"
								variant="link"
								className="text-start text-uppercase p-4 catalog-mobile-list-item"
								onClick={() =>
									setOpenedCategory(_id?.toString())
								}
							>
								{title}
							</ListGroup.Item>
						))}
					</ListGroup>
				)}
			</Offcanvas.Body>
		</Offcanvas>
	)
}

export default NavCatalogMobile