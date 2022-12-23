import { FC, useCallback, useEffect, useState } from "react"
import { Col, Row } from "react-bootstrap"
import { ICategoryContent } from "../../../../shared"
import { useGetCategoryContentQuery, useSortCarouselMutation } from "../../../application/categoryContent.service"
import FallbackComponent from "../../../components/FallbackComponent"
import EditModal from "./EditModal"
import Item from "./Item"
import UploadComponent from "./UploadComponent"

interface IProps {
    categoryId: string
}

const CarouselComponent: FC<IProps> = ({ categoryId }) => {
    const { data, isLoading } = useGetCategoryContentQuery({ categoryId })
    const [sort] = useSortCarouselMutation()
    const [state, setState] = useState<ICategoryContent['carouselImages'][0][]>([])
    const [isDragging, setIsDragging] = useState(false)
    const [editedId, setEditedId] = useState<string|undefined>()

    const editedSlide = state.find(({ _id }) => _id?.toString() === editedId)

    const moveImage = useCallback((dragIndex: number, hoverIndex: number) => {
        setState((state) =>
            state.map((item, index, arr) => {
                if (index === dragIndex) {
                    return arr[hoverIndex]
                }
                if (index === hoverIndex) {
                    return arr[dragIndex]
                }
                return item
            })
        )
    }, [])

    useEffect(() => {
        if ( data ) {
            setState(data.carouselImages)
        }
    }, [data])

    useEffect(() => {
        function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
			return value !== null && value !== undefined
		}
		if (state.length !== data?.carouselImages.length) {
			setIsDragging(false)
			return
		}

		if (state.some((item) => !item)) {
			setIsDragging(false)
			return
		}

		if (isDragging && state.length) {
			setIsDragging(false)
            const order = state.map(({ _id }) => _id?.toString()).filter(notEmpty)
			sort({ body: { order }, contentId: data._id.toString() })
			setState([])
		}
	}, [isDragging, data, state, sort])

    return (
		<div className="rounded border p-4">
			<EditModal
				href={editedSlide?.href}
				to={editedSlide?.to}
				imageId={editedId}
				src={editedSlide?.imgSrc}
				show={!!editedSlide}
				onHide={() => setEditedId(undefined)}
				contentId={data?._id.toString()}
			/>
			<div className="text-muted mb-3">Изображения карусели {data?.carouselImages.length}</div>
			<Row className="overflow-scroll flex-nowrap">
				{isLoading && <FallbackComponent />}
				{data && (
					<Col xs={1}>
						<UploadComponent contentId={data._id.toString()} />
					</Col>
				)}
				{!isLoading &&
					state.map((item, index) => (
						<Col key={item._id?.toString()} xs={2}>
							<Item
								imageClickHandler={(id: string) => setEditedId(id)}
								id={item._id?.toString() || ""}
								index={index}
								mover={moveImage}
								setIsDragging={(val: boolean) => setIsDragging(val)}
								src={item.imgSrc}
							/>
						</Col>
					))}
			</Row>
		</div>
	)
}

export default CarouselComponent