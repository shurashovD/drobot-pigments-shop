import { FC } from "react"
import { Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { resetFilters } from "../../application/filtersSlice"
import { useAppDispatch } from "../../application/hooks"
import { hideNavCatalog, setPane } from "../../application/navCatalogSlice"

interface IProps {
    subCategoryId: string
    title: string
}

const SubCategoryItem: FC<IProps> = ({ subCategoryId, title }) => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const clickHandler = (to: string) => {
		dispatch(resetFilters())
		navigate(to)
		dispatch(hideNavCatalog())
		dispatch(setPane())
	}

    return (
		<div>
			<Button variant="link" onClick={() => clickHandler(`/category/${subCategoryId}/[]}`)} className="p-0 text-start">
				{title}
			</Button>
		</div>
	)
}

export default SubCategoryItem