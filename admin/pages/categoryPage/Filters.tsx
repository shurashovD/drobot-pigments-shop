import { FC, useEffect, useState } from "react"
import { Accordion, Button, Container, Row } from "react-bootstrap"
import { IFilter } from "../../../shared"
import FilterItem from "./FilterItem"
import FilterModal from "./FilterModal"

interface IProps {
    categoryId: string
    filters: IFilter[]
}

const Filters: FC<IProps> = ({ categoryId, filters }) => {
    const [showModal, setShowModal] = useState(false)
	const [editedId, setEditedId] = useState<string | undefined>()

	const editHandler = (id: string) => {
		setEditedId(id)
		setShowModal(true)
	}

	const hideHandler = () => {
		setEditedId(undefined)
		setShowModal(false)
	}

    return (
		<Container fluid className="p-1 position-relative">
			<div className="sticky-top w-100 mb-3">
				<Button
					size="sm"
					onClick={() => setShowModal(true)}
					className="rounded-0"
				>
					Добавить фильтр
				</Button>
			</div>
			<FilterModal
				show={showModal}
				id={categoryId}
				filterId={editedId}
				title={
					filters.find(({ _id }) => _id?.toString() === editedId)
						?.title
				}
				onHide={hideHandler}
			/>
			<Accordion className="w-100 m-0 border-0" alwaysOpen>
				{filters.map((item, index) => (
					<FilterItem
						categoryId={categoryId}
						filter={item}
						editHandler={editHandler}
						key={item._id?.toString() || ""}
						eventKey={index.toString()}
					/>
				))}
			</Accordion>
		</Container>
	)
}

export default Filters