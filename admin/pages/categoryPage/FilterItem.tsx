import { FC, MouseEvent, useState } from "react"
import { Accordion, Button } from "react-bootstrap"
import { IFilter } from "../../../shared"
import FieldItem from "./FieldItem"
import FieldModal from "./FieldModal"

interface IProps {
    categoryId: string
    filter: IFilter
    editHandler: (id: string) => void
    eventKey: string
}

const FilterItem: FC<IProps> = ({ categoryId, filter, editHandler, eventKey }) => {
    const handler = (event: MouseEvent) => {
        event.preventDefault()
        editHandler(filter._id?.toString() || '')
    }
    const [show, setShow] = useState(false)
    const [edit, setEdit] = useState<string | undefined>()

    const editFieldHandler = (id: string) => {
        setEdit(id)
        setShow(true)
    }

    const onHide = () => {
        setShow(false)
        setEdit(undefined)
    }

    return (
		<Accordion.Item
			eventKey={eventKey}
			className="border-0 p-0 m-0 border-bottom"
		>
			<FieldModal
                id={categoryId}
                filterId={filter._id?.toString() || ''}
                fieldId={edit}
                onHide={onHide}
                show={show}
                title={filter.fields.find(({_id}) => _id?.toString() === edit)?.value}
            />
			<Accordion.Header>
				<a href="#" onClick={handler}>
					{filter.title}
				</a>
			</Accordion.Header>
			<Accordion.Body className="m-0 p-0">
				<div
					className="border p-1"
					style={{ maxHeight: "30vh", overflowY: "scroll" }}
				>
					{filter.fields.map(({ _id, value }) => (
						<FieldItem
							key={_id?.toString()}
							id={_id?.toString() || ""}
                            filterId={filter._id?.toString() || ''}
							value={value}
							editHandler={editFieldHandler}
						/>
					))}
                    <Button size="sm" onClick={() => setShow(true)} className="mt-2">
                        Добавить значение
                    </Button>
				</div>
			</Accordion.Body>
		</Accordion.Item>
	)
}

export default FilterItem