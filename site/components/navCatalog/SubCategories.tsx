import { FC } from "react"
import { Col, Row, Spinner, Tab } from "react-bootstrap"
import { ICategorySiteSubcategory } from "../../../shared"
import { useGetSubCategoriesQuery } from "../../application/category.service"
import SubCategoryItem from "./SubCategoryItem"

interface IProps {
    categoryId: string
}

const SubCategories: FC<IProps> = ({ categoryId }) => {
	const { data, isFetching } = useGetSubCategoriesQuery({ parentCategoryId: categoryId })

	return (
		<Tab.Pane eventKey={categoryId}>
			<Row xs={3} style={{ maxHeight: "80vh" }} className="overflow-scroll no-scrollbar g-5 gy-1 py-4">
				{isFetching && (
					<div className="text-center p-5">
						<Spinner animation="border" variant="secondary" />
					</div>
				)}
				{!isFetching &&
					data &&
					data.reduce<ICategorySiteSubcategory[][]>(
							(acc, item) => {
								const i = acc.length - 1
								if (acc[i].length === 4) {
									acc.push([item])
								} else {
									acc[i].push(item)
								}
								return acc
							},
							[[]]
						)
						.map((item, index) => (
							<Col key={`${categoryId}_nav_sabcategory_group_${index}`}>
								{item.map((item) => (
									<div key={item.id} className="mb-2">
										<SubCategoryItem subCategoryId={item.id} title={item.title} />
									</div>
								))}
							</Col>
						))}
			</Row>
		</Tab.Pane>
	)
}

export default SubCategories