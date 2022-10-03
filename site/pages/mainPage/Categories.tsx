import { Col, Container, Row } from "react-bootstrap"
import { useAppSelector } from "../../application/hooks"
import CategoryItem from "./CategoryItem"

const Categories = () => {
    const { categories } = useAppSelector(state => state.categoriesSlice)

    return (
		<Container className="pb-6">
			<h3>Популярные категории</h3>
			{categories.length > 0 && (
				<Row className="g-4 g-xl-5 d-none d-md-flex justify-content-center">
					<Col xs={12} xl={6}>
						<CategoryItem
							category={categories.find(({ frontEndKey }) => frontEndKey === "pigments")}
							widthToHeight={558 / 167}
							title="Пигменты  Drobot Pigments"
						/>
					</Col>
					<Col xs={6} xl={3}>
						<CategoryItem
							category={categories.find(({ frontEndKey }) => frontEndKey === "eqipment")}
							widthToHeight={264 / 167}
							title="Оборудование и расходники"
						/>
					</Col>
					<Col xs={6} xl={3}>
						<CategoryItem
							category={categories.find(({ frontEndKey }) => frontEndKey === "remove")}
							widthToHeight={264 / 167}
							title="Удаление  ПМ"
						/>
					</Col>
					<Col xs={6} xl={3}>
						<CategoryItem
							category={categories.find(({ frontEndKey }) => frontEndKey === "clothes")}
							widthToHeight={264 / 167}
							title="Форма  Drobot Fashion"
						/>
					</Col>
					<Col xs={6} xl={3}>
						<CategoryItem
							category={categories.find(({ frontEndKey }) => frontEndKey === "brows")}
							widthToHeight={264 / 167}
							title="Brows Care"
							description="коррекция и  окрашивание бровей"
						/>
					</Col>
				</Row>
			)}
			{categories.length > 0 && (
				<Row className="g-2 d-md-none">
					<Col xs={12}>
						<CategoryItem
							category={categories.find(({ frontEndKey }) => frontEndKey === "pigments")}
							widthToHeight={558 / 167}
							title="Пигменты  Drobot Pigments"
						/>
					</Col>
					<Col xs={6}>
						<CategoryItem
							category={categories.find(({ frontEndKey }) => frontEndKey === "eqipment")}
							widthToHeight={185 / 118}
							title="Оборудование и расходники"
						/>
					</Col>
					<Col xs={6}>
						<CategoryItem
							category={categories.find(({ frontEndKey }) => frontEndKey === "remove")}
							widthToHeight={185 / 118}
							title="Удаление  ПМ"
						/>
					</Col>
					<Col xs={6}>
						<CategoryItem
							category={categories.find(({ frontEndKey }) => frontEndKey === "clothes")}
							widthToHeight={185 / 118}
							title="Форма  Drobot Fashion"
						/>
					</Col>
					<Col xs={6}>
						<CategoryItem
							category={categories.find(({ frontEndKey }) => frontEndKey === "brows")}
							widthToHeight={185 / 118}
							title="Brows Care"
							description="коррекция и  окрашивание бровей"
						/>
					</Col>
				</Row>
			)}
		</Container>
	)
}

export default Categories