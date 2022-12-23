import { Col, Container, Row } from "react-bootstrap"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { useParams } from "react-router-dom"
import { useGetCategoryByIdQuery } from "../../application/category.service"
import { useGetCategoryContentQuery } from "../../application/categoryContent.service"
import FallbackComponent from "../../components/FallbackComponent"
import CarouselComponent from "./carousel/CarouselComponent"
import CreateContent from "./createContent/CreateContent"
import VideoUrlComponent from "./videoUrl/VideoUrlComponent"

const CategoryContentPage = () => {
    const { id } = useParams()
    const { data: category } = useGetCategoryByIdQuery(id || '', { skip: !id })
	const { data: content, isLoading } = useGetCategoryContentQuery({ categoryId: id || '' }, { skip: !id })

    return (
		<Container>
			<h3>Контентная часть страницы категории {category?.title || "..."}</h3>
			{isLoading && <FallbackComponent />}
			{!isLoading && !content && id && <CreateContent categoryId={id} />}
			{id && content && (
				<Row className="gy-4">
					<DndProvider backend={HTML5Backend}>
						<Col xs={12} className="mb-3">
							<CarouselComponent categoryId={id} />
						</Col>
					</DndProvider>
					<Col xs={12}>
						<VideoUrlComponent categoryId={id} />
					</Col>
				</Row>
			)}
		</Container>
	)
}

export default CategoryContentPage