import { ChangeEvent, FC, useCallback, useEffect, useState } from "react"
import { Button, Form, Image, Modal, ModalProps, Stack } from "react-bootstrap"
import { useRmCarouselSlideMutation, useUpdSlideInfoMutation } from "../../../application/categoryContent.service"
import ButtonComponent from "../../../components/ButtonComponent"

interface IProps extends ModalProps {
    contentId?: string
    imageId?: string
    src?: string
    href?: string
    to?: string
}

const EditModal: FC<IProps> = ({ contentId, href, imageId, onHide, show, src, to }) => {
	const [update, { isLoading, isSuccess, reset }] = useUpdSlideInfoMutation()
	const [remove, { isLoading: rmLoading, isSuccess: rmSuccess, reset: rmReset }] = useRmCarouselSlideMutation()
    const [type, setType] = useState<"href"|"to">("href")
    const [hrefValue, setHrefValue] = useState('')
    const [toValue, setToValue] = useState('')

	const updHandler = () => {
		if ( !contentId || !imageId ) {
			return
		}
		const body = {
			imageId,
			href: hrefValue === '' ? undefined : hrefValue,
			to: toValue === '' ? undefined : toValue
		}
		update({ body, contentId })
	}

    const inputHandler = (event: ChangeEvent<HTMLInputElement>) => {
        if ( event.target.name === 'href' ) {
            setHrefValue(event.target.value)
        }
        if (event.target.name === "to") {
			setToValue(event.target.value)
		}
    }

	const rmHandler = () => {
		if ( contentId && imageId ) {
			remove({ contentId, body: { imageId } })
		}
	}

    const hideHandler = useCallback(() => {
		if (onHide) {
			setHrefValue("")
			setToValue("")
			setType("href")
			onHide()
		}
	}, [onHide])

    useEffect(() => {
        if ( href && !to ) {
            setType('href')
            setHrefValue(href)
        }
        if (!href && to) {
			setType("to")
            setToValue(to)
		}
    }, [href, to])

	useEffect(() => {
		if ( type === "href" ) {
			setToValue('')
		}
		if (type === "to") {
			setHrefValue("")
		}
	}, [type])

	useEffect(() => {
		if ( isSuccess ) {
			reset()
			hideHandler()
		}
	}, [hideHandler, isSuccess, reset])

	useEffect(() => {
		if (rmSuccess) {
			rmReset()
			hideHandler()
		}
	}, [hideHandler, rmSuccess, rmReset])

    return (
		<Modal onHide={hideHandler} show={show} size="lg">
			<Modal.Header closeButton />
			<Modal.Body>
				<Stack gap={3}>
					<div>
						{src ? (
							<Image src={src} alt="carousel-item" fluid />
						) : (
							<div className="text-center text-uppercase text-muted py-5">Нет изображения</div>
						)}
					</div>
					<div className="d-flex align-items-center">
						<Button variant="link" className={type === "href" ? "text-primary" : "text-secondary"} onClick={() => setType("href")}>
							<div className="white-space">Ссылка на внешний ресурс</div>
						</Button>
						<Form.Control name="href" onChange={inputHandler} value={hrefValue} disabled={type === "to"} />
					</div>
					<div className="d-flex align-items-center">
						<Button variant="link" className={type === "to" ? "text-primary" : "text-secondary"} onClick={() => setType("to")}>
							<div className="white-space">Якорь на страницу из drobot-pigments-shop</div>
						</Button>
						<Form.Control name="to" onChange={inputHandler} value={toValue} disabled={type === "href"} />
					</div>
				</Stack>
			</Modal.Body>
			<Modal.Footer>
				<ButtonComponent variant="link" className="text-danger me-auto" isLoading={rmLoading} onClick={rmHandler}>
					Удалить слайд
				</ButtonComponent>
				<ButtonComponent isLoading={isLoading} onClick={updHandler}>
					Сохранить
				</ButtonComponent>
				<Button variant="secondary" onClick={hideHandler} size="sm">
					Отмена
				</Button>
			</Modal.Footer>
		</Modal>
	)
}

export default EditModal