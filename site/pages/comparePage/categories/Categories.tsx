import { Row } from "react-bootstrap"
import { useGetCategoriesQuery } from "../../../application/compare.service"
import CategoryButton from "./CategoryButton"

const Categories = () => {
    const { data } = useGetCategoriesQuery(undefined, { refetchOnMountOrArgChange: true })

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