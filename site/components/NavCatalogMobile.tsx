import { FC, useState } from 'react'
import { Accordion, ListGroup, Offcanvas, OffcanvasProps, Stack } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import { useAppSelector } from '../application/hooks'

const NavCatalogMobile: FC<OffcanvasProps> = ({ onHide, show }) => {
    const { categories } = useAppSelector(state => state.categoriesSlice)
    const [openedCategory, setOpenedCategory] = useState<string | undefined>()

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
						{categories
							.find(
								({ _id }) => _id?.toString() === openedCategory
							)
							?.filters.map(({ _id, fields, title }) => (
								<Accordion.Item
									eventKey={_id?.toString()}
									key={_id?.toString()}
								>
									<Accordion.Header className="text-start text-uppercase">
										{title}
									</Accordion.Header>
									<Accordion.Body>
										<Stack gap={3}>
											{fields.map(({ _id, value }) => (
												<div key={_id?.toString()}>
													<NavLink to={`/`}>
														{value}
													</NavLink>
												</div>
											))}
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