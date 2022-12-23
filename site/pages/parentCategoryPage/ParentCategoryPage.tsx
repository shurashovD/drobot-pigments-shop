import { useEffect } from "react"
import { Col, Container, Row, Spinner } from "react-bootstrap"
import { NavLink, useParams } from "react-router-dom"
import { useGetCategoryByIdQuery, useGetSubCategoriesQuery } from "../../application/category.service"
import Banners from "./Banners"
import Item from "./Item"

const ParentCategoryPage = () => {
    const { id } = useParams()
    const { data: category, isLoading } = useGetCategoryByIdQuery(id || '', { skip: !id })
    const { data: subCategories } = useGetSubCategoriesQuery({ parentCategoryId: id || '' }, { skip: !id })

    useEffect(() => {
        if ( category ) {
            document.title = category.title
        }
	}, [category])
    
    return (
		<Container className="my-6">
			{isLoading && (
				<div className="text-center p-5">
					<Spinner animation="border" variant="secondary" />
				</div>
			)}
			{!isLoading && category && <Banners categoryId={category._id.toString()} />}
			{!isLoading && <h3>{category?.title}</h3>}
			<Row>
				<Col xs={12} lg={9}>
					<Row xs={1} lg={3} className="g-4">
						{subCategories?.map(({ id, title, photo }) => (
							<Col key={id}>
								<Item id={id} title={title} photo={photo} />
							</Col>
						))}
					</Row>
				</Col>
				<Col xs={12} lg={3} className="d-flex flex-column">
					<NavLink className="pigments-page__link p-4 mb-4" to="/coloristic">
						Бесплатная колористика
					</NavLink>
					<NavLink className="pigments-page__link p-4 mb-4" to="/partner-program">
						Стать агентом
					</NavLink>
					<NavLink className="pigments-page__link p-4 mb-4" to="/partner-program">
						Стать представителем
					</NavLink>
					<NavLink className="pigments-page__link p-4" to="/partner-program">
						Стать тренером
					</NavLink>
				</Col>
			</Row>
		</Container>
	)
}

export default ParentCategoryPage