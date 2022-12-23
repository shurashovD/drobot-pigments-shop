import { useEffect, useState } from "react"
import { Container, Table } from "react-bootstrap"
import { useGetCategoryByIdQuery, useGetCategoriesQuery, useGetSubCategoriesQuery } from "../../application/category.service"
import PhotoModalComponent from "./PhotoModalComponent"
import DescriptionModal from "./DescriptionModal"
import Edited from "./Edited"
import Footer from "./Footer"
import Item from "./Item"
import { useParams } from "react-router-dom"
import { ICategorySiteSubcategory } from "../../../shared"

const SiteCatalogPage = () => {
	const { id: parentCategory } = useParams()
    const { data, refetch } = useGetCategoriesQuery(undefined, { refetchOnMountOrArgChange: true })
	const { data: subCategories, refetch: refetchSubCategories, isSuccess: subCategoriesSuccess } =
		useGetSubCategoriesQuery({ parentCategory: parentCategory || '' }, { skip: !parentCategory })
	const { data: category, refetch: categoryRefetch, isSuccess } =
		useGetCategoryByIdQuery(parentCategory || '', { skip: !parentCategory })
	const [state, setState] = useState<ICategorySiteSubcategory[]>([])
    const [edited, setEdited] = useState<string | undefined>()
    const [description, setDescription] = useState<string | undefined>()
    const [photo, setPhoto] = useState<string | undefined>()

	console.log(photo)

	useEffect(() => {
		if ( !parentCategory && data ) {
			setState(data.map(({ _id, title, photo, products }) => ({
				id: _id.toString(), title, photo: photo[0], productsLength: products.length
			})))
		}
	}, [data, isSuccess, parentCategory])

	useEffect(() => {
		if (parentCategory) {
			categoryRefetch()
			refetchSubCategories()
		} else {
			refetch()
		}
	}, [parentCategory, categoryRefetch, refetch, refetchSubCategories])

	useEffect(() => {
		if (parentCategory && subCategories) {
			setState(subCategories)
		}
	}, [parentCategory, subCategories, subCategoriesSuccess])

    return (
		<Container>
			<DescriptionModal text={data?.find(({ _id }) => _id?.toString() === description)?.description} onHide={() => setDescription(undefined)} />
			<PhotoModalComponent id={photo || ""} src={state.find(({ id }) => id === photo)?.photo} onHide={() => setPhoto(undefined)} />
			<h3>Разделы {parentCategory ? <>{category?.title}</> : <>на сайте</>}</h3>
			<Table hover>
				<thead>
					<tr className="align-middle">
						<th>#</th>
						<th className="text-center">Название</th>
						<th className="text-center">Подкатегории</th>
						<th className="text-center">Контент</th>
						<th className="text-center">Изменить</th>
						<th className="text-center">Удалить</th>
					</tr>
				</thead>
				<tbody>
					{state.map(({ id, title, photo }) => {
						if (id === edited) {
							return <Edited description={""} id={id} resetEditted={() => setEdited(undefined)} title={title} key={id} />
						}
						return (
							<Item
								descriptionHandler={(id) => setDescription(id)}
								edittedHandler={(id) => setEdited(id)}
								id={id.toString()}
								photoHandler={(id) => setPhoto(id)}
								title={title}
								key={id}
								photo={photo}
							/>
						)
					})}
				</tbody>
				<tfoot>
					<Footer />
				</tfoot>
			</Table>
		</Container>
	)
}

export default SiteCatalogPage