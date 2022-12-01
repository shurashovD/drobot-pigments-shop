import { useEffect } from "react"
import { Col, Container, Row, Spinner } from "react-bootstrap"
import { useParams } from "react-router-dom"
import { useGetCategoryByIdQuery, useGetSubCategoriesQuery } from "../../application/category.service"
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
			{!isLoading && <h3>{category?.title}</h3>}
			<Row xs={1} lg={3} className="g-4">
				{subCategories?.map(({ id, title, photo }) => (
					<Col key={id}>
						<Item id={id} title={title} photo={photo} />
					</Col>
				))}
			</Row>
		</Container>
	)
}

export default ParentCategoryPage