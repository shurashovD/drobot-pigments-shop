import { ChangeEvent, FC, useEffect, useState } from "react"
import { Form, Modal, ModalProps } from "react-bootstrap"
import { Calendar } from "react-calendar"
import { useCreatePromocodeMutation, useGetPromocodeQuery, useUpdatePromocodeMutation } from "../../../application/promocode.service"
import ButtonComponent from "../../../components/ButtonComponent"

interface IProps extends ModalProps {
    id?: string
    clientId: string
}

const ModalComponent: FC<IProps> = ({ clientId, id, show, onHide }) => {
    const { data, isLoading, isSuccess } = useGetPromocodeQuery({ id: id || '' }, { skip: !id, refetchOnMountOrArgChange: true })
    const [createPromocode, { isLoading: createLoading, isSuccess: createSuccess, reset: createReset }] = useCreatePromocodeMutation()
    const [updatePromocode, { isLoading: updateLoading, isSuccess: updateSuccess, reset: updateReset }] = useUpdatePromocodeMutation()
    const [code, setCode] = useState('')
    const [discount, setDiscount] = useState(5)
    const [dateStart, setDateStart] = useState<Date | null>(null)
    const [dateFinish, setDateFinish] = useState<Date | null>(null)
    const [dateState, setDateState] = useState('Выберите дату начала')
    const [minDate, setMinDate] = useState<Date | undefined>()
    const formatter = new Intl.DateTimeFormat('ru', { day: 'numeric', month: 'long', year: 'numeric' })

    const hideHandler = () => {
        if ( onHide ) {
            onHide()
        }
        setCode('')
        setDateFinish(null)
        setDateStart(null)
        setDateState("Выберите дату начала")
        setDiscount(5)
    }

    const codeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setCode(event.target.value)
    }

    const discountHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target
        if ( value === '' ) {
            setDiscount(0)
        }
        if ( !isNaN(+value) ) {
            setDiscount(+value)
        }
    }

    const calendarHandler = (value: Date) => {
        if ( !dateStart ) {
            setDateStart(value)
            setMinDate(value)
            return
        }
        if ( !dateFinish ) {
            setDateFinish(value)
            setMinDate(undefined)
            return
        }
        setDateFinish(null)
        setDateStart(value)
        setMinDate(value)
    }

    const handler = () => {
        if ( !dateStart || !dateFinish ) {
            return
        }
        const body = { code, dateStart: dateStart.toString(), dateFinish: dateFinish.toString(), discountPercent: discount }
        if ( id ) {
            updatePromocode({ id, body })
        } else {
            createPromocode({ ...body, holderId: clientId })
        }
    }

    useEffect(() => {
        if ( data ) {
            setCode(data.code)
            setDateFinish(new Date(data.dateFinish))
            setDateStart(new Date(data.dateStart))
            setDiscount(data.discountPercent || 5)
        }
    }, [data, isSuccess])

    useEffect(() => {
        if ( !dateStart ) {
            setDateState("Выберите дату начала")
        } else {
            if ( !dateFinish ) {
                setDateState("Выберите дату окончания")
            } else {
                setDateState(`c ${formatter.format(dateStart)} по ${formatter.format(dateFinish)}`)
            }
        }
    }, [dateFinish, dateStart])

    useEffect(() => {
		if (createSuccess || updateSuccess) {
			hideHandler()
            createReset()
            updateReset()
		}
	}, [hideHandler, createSuccess, updateSuccess, createReset, updateReset])

    return (
		<Modal show={show} onHide={hideHandler}>
			<Modal.Header closeButton>{id ? <>Изменить</> : <>Создать</>} промокод</Modal.Header>
			<Modal.Body className="text-center">
				<Form.Group className="mb-3 text-start">
					<Form.Label className="text-start">Промокод</Form.Label>
					<Form.Control placeholder="Введите промокод" value={code} onChange={codeHandler} disabled={isLoading} />
				</Form.Group>
				<Form.Group className="mb-3 text-start">
					<Form.Label className="text-start">Скидка, %</Form.Label>
					<Form.Control placeholder="Скидка по промокоду" value={discount} onChange={discountHandler} disabled={isLoading} />
				</Form.Group>
				<Form.Group className="mb-3 text-start">
					<Form.Label className="text-start">Период действия</Form.Label>
					<Form.Control value={dateState} disabled />
				</Form.Group>
				<div className="d-flex justify-content-center">
					<Calendar value={[dateStart, dateFinish]} selectRange onClickDay={calendarHandler} minDate={minDate} />
				</div>
			</Modal.Body>
			<Modal.Footer>
				<ButtonComponent
					disabled={code === "" || !dateFinish || !dateStart || isLoading}
					isLoading={createLoading || updateLoading}
					onClick={handler}
				>
					{id ? <>Изменить</> : <>Создать</>}
				</ButtonComponent>
			</Modal.Footer>
		</Modal>
	)
}

export default ModalComponent