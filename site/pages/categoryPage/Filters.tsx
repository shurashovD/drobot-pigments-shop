import { useEffect } from "react"
import { Accordion, Button, Spinner } from "react-bootstrap"
import { useParams } from "react-router-dom"
import { useGetCategoryByIdQuery } from "../../application/category.service"
import { resetFilters, setMaxPrice, setMinPrice } from "../../application/filtersSlice"
import { useAppDispatch } from "../../application/hooks"
import FilterItem from "./FilterItem"
import PriceFilter from "./PriceFilter"
import VariantsFilter from "./VariantsFilter"

const Filters = () => {
    const { id } = useParams()
    const { data: category, isLoading } = useGetCategoryByIdQuery(id || "")
    const dispatch = useAppDispatch()

	useEffect(() => {
		if ( category && category.maxPrice && category.minPrice ) {
			dispatch(setMaxPrice(category.maxPrice))
			dispatch(setMinPrice(category.minPrice))
		}
	}, [category, dispatch, setMaxPrice, setMinPrice])

    return (
		<div>
			{isLoading && (
				<div className="text-center p-3">
					<Spinner animation="border" variant="secondary" />
				</div>
			)}
			{!isLoading && category && (
				<Accordion
					alwaysOpen={true}
					flush
					id="filter-accordion"
					defaultActiveKey={[
						...category.filters.map(({ _id }) => _id.toString()),
						...(category.variantsFilter?.map(({ variantsLabel }) => variantsLabel) || []),
						"price-fliter",
					]}
				>
					{category.filters.map(({ _id, fields, title }) => (
						<FilterItem key={_id.toString()} id={_id.toString()} fields={fields} title={title} />
					))}
					{category.variantsFilter?.map(({ variantsLabel, variantsValues }) => (
						<VariantsFilter key={variantsLabel} variantsLabel={variantsLabel} variantsValues={variantsValues} />
					))}
					{category.minPrice && category.maxPrice && <PriceFilter min={category.minPrice} max={category.maxPrice} />}
				</Accordion>
			)}
			{!isLoading && category && (
				<div className="text-center d-none d-lg-block">
					<Button variant="outline-primary" onClick={() => dispatch(resetFilters())} className="text-uppercase ">
						Очистить фильтр
					</Button>
				</div>
			)}
		</div>
	)
}

export default Filters