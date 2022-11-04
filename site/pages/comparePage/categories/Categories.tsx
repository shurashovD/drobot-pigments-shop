import { useEffect } from "react"
import { Row } from "react-bootstrap"
import { useGetCategoriesQuery } from "../../../application/compare.service"
import { setCategory } from "../../../application/compareSlice"
import { useAppDispatch } from "../../../application/hooks"
import CategoryButton from "./CategoryButton"

const Categories = () => {
    const { data } = useGetCategoriesQuery(undefined, { refetchOnMountOrArgChange: true })
    const dispatch = useAppDispatch()

    useEffect(() => {
        if ( data && data.length === 0 ) {
            dispatch(setCategory(undefined))
        }
    }, [data, dispatch])

    if ( data?.length === 0 ) {
        return <div className="text-muted">Здесь пока ничего нет</div>
    }

    return (
        <Row className="overflow-x-scroll flex-nowrap">
            { data?.map(({ id, length, title }) => (
                <CategoryButton key={id} title={title} length={length} id={id} />
            )) }
        </Row>
    )
}

export default Categories