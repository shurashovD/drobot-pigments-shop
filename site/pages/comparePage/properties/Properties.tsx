import { useEffect, useState } from "react"
import { ListGroup } from "react-bootstrap"
import { ICompareReport } from "../../../../shared"
import { useGetProductsQuery } from "../../../application/compare.service"
import { useAppSelector } from "../../../application/hooks"
import Item from "./Item"

const Properties = () => {
    const { allProps, categoryId } = useAppSelector((state) => state.compareSlice)
	const { data } = useGetProductsQuery({ categoryId: categoryId || "" }, { skip: !categoryId, refetchOnMountOrArgChange: true })
	const [state, setState] = useState<ICompareReport['fields']>([])

	useEffect(() => {
		if (data?.fields) {
			let state = data.fields
			if ( !allProps ) {
				state = state.filter(({ values }) => Array.from(new Set(values)).length > 1)
			} 
			setState(state)
		}
		if ( !categoryId ) {
			setState([])
		}
	}, [allProps, data, categoryId])

    return (
		<ListGroup variant="flush">
			{state.map(({ id, title, values }) => (
				<Item key={id} title={title} values={values} />
			))}
		</ListGroup>
	)
}

export default Properties