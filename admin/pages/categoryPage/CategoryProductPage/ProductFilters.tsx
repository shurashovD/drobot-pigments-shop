import { FC } from "react"
import { Accordion, Container, Spinner } from "react-bootstrap"
import { useGetCategoryByIdQuery } from "../../../application/category.service"
import ProductFilterItem from "./ProductFilterItem"

interface IProps {
    categoryId: string
    disabled: boolean
    productId: string
    properties: string[]
}

const ProductsFilters: FC<IProps> = ({ categoryId, disabled, productId, properties }) => {
    const { data, isLoading } = useGetCategoryByIdQuery(categoryId, { refetchOnMountOrArgChange: true })

    return (
		<div className="vstack gap-3">
			{isLoading && <Spinner variant="secondary" animation="border" />}
			{data && (
				<Accordion alwaysOpen>
					{data.filters.map((filter) => (
						<ProductFilterItem
							key={filter._id.toString()}
							disabled={disabled}
							eventKey={filter._id?.toString()}
							productId={productId}
							title={filter.title}
							fields={filter.fields}
							values={properties.map((item) => item.toString())}
						/>
					))}
				</Accordion>
			)}
		</div>
	)
}

export default ProductsFilters