import { useCallback, useEffect, useRef, useState } from "react"
import { Col, Container, Row } from "react-bootstrap"
import { useAppSelector } from "../../application/hooks"
import CategoryItem from "./CategoryItem"

const Categories = () => {
    const { categories } = useAppSelector(state => state.categoriesSlice)
    const [width, setWidth] = useState('auto')
	const container = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		/*if ( container.current ) {
			const width = 1.65 * document.documentElement.clientHeight
			if ( width < container.current.offsetWidth ) {
				setWidth(`${width}px`)
			}
		}*/
	}, [container])

    return (
		<Container className="pb-6" ref={container}>
			<h3>Популярные категории</h3>
			{categories.length > 0 && (
				<Row className="d-none d-xl-flex g-5" style={{ width }}>
					<Col xl={6}>
						<CategoryItem
							category={categories.find(
								({ frontEndKey }) => frontEndKey === "pigments"
							)}
						/>
					</Col>
					<Col xl={6}>
						<Row className="g-5" xl={2}>
							<Col>
								<CategoryItem
									category={categories.find(
										({ frontEndKey }) =>
											frontEndKey === "eqipment"
									)}
								/>
							</Col>
							<Col>
								<CategoryItem
									category={categories.find(
										({ frontEndKey }) =>
											frontEndKey === "remove"
									)}
								/>
							</Col>
							<Col>
								<CategoryItem
									category={categories.find(
										({ frontEndKey }) =>
											frontEndKey === "clothes"
									)}
								/>
							</Col>
							<Col>
								<CategoryItem
									category={categories.find(
										({ frontEndKey }) =>
											frontEndKey === "brows"
									)}
								/>
							</Col>
						</Row>
					</Col>
				</Row>
			)}
			{categories.length > 0 && (
				<Row className="d-xl-none g-5" xs={1} md={2}>
					<Col>
						<CategoryItem
							category={categories.find(
								({ frontEndKey }) => frontEndKey === "pigments"
							)}
						/>
					</Col>
					<Col>
						<CategoryItem
							category={categories.find(
								({ frontEndKey }) => frontEndKey === "eqipment"
							)}
						/>
					</Col>
					<Col>
						<CategoryItem
							category={categories.find(
								({ frontEndKey }) => frontEndKey === "remove"
							)}
						/>
					</Col>
					<Col>
						<CategoryItem
							category={categories.find(
								({ frontEndKey }) => frontEndKey === "clothes"
							)}
						/>
					</Col>
					<Col>
						<CategoryItem
							category={categories.find(
								({ frontEndKey }) => frontEndKey === "brows"
							)}
						/>
					</Col>
				</Row>
			)}
		</Container>
	)
}

export default Categories