import { FC, useState } from 'react'
import { Accordion, Button, ListGroup, Offcanvas, OffcanvasProps, Stack } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../application/hooks'
import { resetFilters } from "../../application/filtersSlice"
import Item from './Item'

const NavCatalogMobile: FC<OffcanvasProps> = ({ onHide, show }) => {
    const { categories } = useAppSelector(state => state.categoriesSlice)
    const [openedCategory, setOpenedCategory] = useState<string | undefined>()
	const navigate = useNavigate()
	const dispatch = useAppDispatch()

	const clickHandler = (to: string) => {
		dispatch(resetFilters())
		navigate(to)
		if ( onHide ) {
			onHide()
		}
	}

    return (
		<Offcanvas show={show} onExit={() => setOpenedCategory(undefined)}>
			<Offcanvas.Header closeButton onHide={onHide}>
				<Offcanvas.Title className="text-uppercase">Каталог</Offcanvas.Title>
			</Offcanvas.Header>
			<Offcanvas.Body>
				<ListGroup variant="flush">
					{categories.map(({ _id, title, subCategories }) => (
						<Item
							key={_id?.toString()}
							clickHandler={clickHandler}
							hasSubCategories={!!subCategories.length}
							id={_id?.toString()}
							title={title}
						/>
					))}
				</ListGroup>
			</Offcanvas.Body>
		</Offcanvas>
	)
}

export default NavCatalogMobile