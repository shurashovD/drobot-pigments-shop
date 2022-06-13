import { useState } from "react"
import { Container, Table } from "react-bootstrap"
import { useGetCategoriesQuery } from "../../application/category.service"
import PhotoModalComponent from "./PhotoModalComponent"
import DescriptionModal from "./DescriptionModal"
import Edited from "./Edited"
import Footer from "./Footer"
import Item from "./Item"

const ProductsPage = () => {
    const { data, isLoading } = useGetCategoriesQuery(undefined, { refetchOnMountOrArgChange: true })
    const [edited, setEdited] = useState<string | undefined>()
    const [description, setDescription] = useState<string | undefined>()
    const [photo, setPhoto] = useState<string | undefined>()

    return (
		<Container>
			<DescriptionModal
				text={
					data?.find(({ _id }) => _id?.toString() === description)
						?.description
				}
				onHide={() => setDescription(undefined)}
			/>
			<PhotoModalComponent
				id={photo || ""}
				src={
					data?.find(({ _id }) => _id?.toString() === photo)?.photo[0]
				}
				onHide={() => setPhoto(undefined)}
			/>
			<h3>Товары на сайте</h3>
			<Table hover>
				<thead>
					<tr className="align-middle">
						<th>#</th>
						<th className="text-center">Название</th>
						<th className="text-center">Описание</th>
						<th className="text-center">Изменить</th>
						<th className="text-center">Удалить</th>
					</tr>
				</thead>
				<tbody>
					{data &&
						data.map((item) => {
							if (item._id.toString() === edited) {
								return (
									<Edited
										description={item.description || ""}
										id={item._id.toString()}
										resetEditted={() =>
											setEdited(undefined)
										}
										title={item.title}
										key={item._id.toString()}
									/>
								)
							}
							return (
								<Item
									description={item.description}
									descriptionHandler={(id) =>
										setDescription(id)
									}
									edittedHandler={(id) => setEdited(id)}
									id={item._id.toString()}
									photoHandler={(id) => setPhoto(id)}
									title={item.title}
									key={item._id.toString()}
									photo={item.photo[0]}
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

export default ProductsPage