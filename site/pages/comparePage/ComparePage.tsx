import { Col, Container, Row } from "react-bootstrap"
import Categories from "./categories/Categories"
import Goods from "./goods/Goods"
import Settings from "./settings/Settings"

const ComparePage = () => {
    return (
		<Container className="pb-6">
			<h3>Сравнение товаров</h3>
			<Categories />
			<Row className="pt-6">
				<Col lg={3} xl={2}>
					<Settings />
				</Col>
				<Col lg={9} xl={10}>
					<Goods />
				</Col>
			</Row>
		</Container>
	)
}

export default ComparePage