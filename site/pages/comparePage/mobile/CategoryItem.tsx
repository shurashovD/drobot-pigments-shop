import { FC } from "react"
import { Button, Col, Container, ListGroup, Row } from "react-bootstrap"
import { setCategory } from "../../../application/compareSlice"
import { useAppDispatch } from "../../../application/hooks"

interface IProps {
    id: string
    title: string
    length: number
}

const CategoryItem: FC<IProps> = ({ id, title, length }) => {
    const dispatch = useAppDispatch()

    return (
		<ListGroup.Item className="p-0 py-3 pe-3">
			<Container>
				<Button className="w-100 p-0" variant="link" onClick={() => dispatch(setCategory(id))}>
					<Row className="align-items-center">
						<Col xs="auto" className="text-uppercase">{title}</Col>
						<Col xs="auto" className="text-muted ms-auto">{length}</Col>
						<Col xs="auto" className="right-arrow-bgi" />
					</Row>
				</Button>
			</Container>
		</ListGroup.Item>
	)
}

export default CategoryItem