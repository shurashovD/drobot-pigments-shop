import { FC } from "react"
import { Col, Row, Spinner, Stack, Tab } from "react-bootstrap"
import { useGetSubCategoriesQuery } from "../../application/category.service"
import SubCategoryItem from "./SubCategoryItem"

interface IProps {
    categoryId: string
}

const SubCategories: FC<IProps> = ({ categoryId }) => {
	const { data, isFetching } = useGetSubCategoriesQuery({ parentCategoryId: categoryId })

	return (
		<Tab.Pane eventKey={categoryId}>
			<Row xs={4} className="py-5 px-4 justify-content-start gy-5 overflow-scroll no-scrollbar" style={{ maxHeight: "90vh" }}>
				<Col>
					{ isFetching && <div className="text-center p-5">
						<Spinner animation="border" variant="secondary" />
					</div> }
					{ !isFetching && <Stack gap={2} className="overflow-scroll no-scrollbar" style={{ maxHeight: "40vh" }}>
						{data && data?.map((item) => (
							<SubCategoryItem key={item.id} subCategoryId={item.id} title={item.title} />
						))}
					</Stack> }
				</Col>
			</Row>
		</Tab.Pane>
	)
}

export default SubCategories