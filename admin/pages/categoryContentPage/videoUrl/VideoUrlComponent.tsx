import { Col, Form, Row } from 'react-bootstrap'
import { ChangeEvent, FC, useEffect, useState } from "react"
import ButtonComponent from '../../../components/ButtonComponent'
import FallbackComponent from '../../../components/FallbackComponent'
import { useGetCategoryContentQuery, useRmVideoMutation, useSetVideoUrlMutation } from "../../../application/categoryContent.service"
import { useAppDispatch } from '../../../application/hooks'
import { successAlert } from '../../../application/alertSlice'

interface IProps {
    categoryId: string
}

const VideoUrlComponent: FC<IProps> = ({ categoryId }) => {
    const [value, setValue] = useState('')
    const { data: content, isLoading, isSuccess } = useGetCategoryContentQuery({ categoryId })
    const [remove, { isLoading: rmLoading }] = useRmVideoMutation()
    const [setUrl, { isLoading: setLoading, isSuccess: setSuccess }] = useSetVideoUrlMutation()
	const dispatch = useAppDispatch()

    const inputHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value)
    }

    useEffect(() => {
		if ( isSuccess ) {
			if (content?.videos[0]) {
				setValue(content.videos[0])
			} else {
				setValue('')
			}
		}
    }, [content, isSuccess])

	useEffect(() => {
		if ( setSuccess ) {
			dispatch(successAlert("Видео привязано"))
		}
	}, [dispatch, setSuccess, successAlert])

    return (
		<div className="border rounded p-4">
			<div className="text-muted mb-4">
				Видео страницы (ссылка на ютуб)
			</div>
			<Row className="g-4">
				{isLoading && <FallbackComponent />}
				{content && (
					<Col xs={10}>
						<Form.Control value={value} onChange={inputHandler} />
					</Col>
				)}
				{content && (
					<Col xs={1}>
						<ButtonComponent
							onClick={() => setUrl({ contentId: content._id.toString(), body: { url: value } })}
							disabled={value === ""}
							isLoading={setLoading}
						>
							OK
						</ButtonComponent>
					</Col>
				)}
				{content && (
					<Col xs={1}>
						<ButtonComponent
							onClick={() => remove({ body: { url: content.videos[0] }, contentId: content._id.toString() })}
							disabled={!content.videos.length}
							isLoading={rmLoading}
							variant="link"
							size="sm"
							className="text-danger"
						>
							Удалить
						</ButtonComponent>
					</Col>
				)}
			</Row>
		</div>
	)
}

export default VideoUrlComponent