import classNames from "classnames"
import { ChangeEvent, FC, useEffect, useState } from "react"
import { Col, Form, Row } from "react-bootstrap"
import { useAppDispatch } from "../../../application/hooks"
import { useGetRecipientQuery, useSetRecipientMutation } from "../../../application/order.service"
import { setActive } from "../../../application/orderSlice"
import ButtonComponent from "../../../components/ButtonComponent"

interface IProps {
    show: boolean
}

const NameMail: FC<IProps> = ({ show }) => {
    const { data, isFetching } = useGetRecipientQuery(undefined)
    const [setRecipient, { isLoading, isSuccess }] = useSetRecipientMutation()
    const [nameVal, setName] = useState("")
    const [mailVal, setMail] = useState("")
    const [mailInvalid, setMailInvalid] = useState(false)
    const dispatch = useAppDispatch()

	const mailHandler = (event: ChangeEvent<HTMLInputElement>) => {
		setMailInvalid(false)
		setMail(event.target.value.trim())
	}

    const setRecipientHandler = () => {
		const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
		if (reg.test(mailVal)) {
			setRecipient({ mail: mailVal, name: nameVal })
		} else {
			setMailInvalid(true)
		}
	}

    useEffect(() => {
		if (isSuccess) {
			dispatch(setActive("4"))
		}
	}, [dispatch, setActive, isSuccess])

	useEffect(() => {
		if ( data?.name ) {
			setName(data.name)
		}
		if ( data?.mail ) {
			setMail(data.mail)
		}
	}, [data])

    if ( !show ) {
        return null
    }

    return (
		<>
			<Row className="mt-2 mt-lg-5">
				<Col xs={12} lg={6}>
					<Form.Label className="w-100">
						<div className="mb-2">Получатель*</div>
						<Form.Control
							disabled={isFetching}
							className="py-3"
							value={nameVal}
							onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
						/>
					</Form.Label>
				</Col>
				<Col xs={12} lg={6}>
					<Form.Label className="w-100">
						<div className={classNames("mb-2", { "text-danger": mailInvalid })}>E-mail для чека ОФД*</div>
						<Form.Control
							disabled={isFetching}
							className={classNames("py-3", { "border-danger": mailInvalid })}
							value={mailVal}
							onChange={mailHandler}
						/>
					</Form.Label>
				</Col>
			</Row>
			<Row className="mt-5">
				<Col xs="auto">
					<ButtonComponent
						disabled={isFetching || nameVal === "" || mailVal === "" || !data?.phone}
						onClick={setRecipientHandler}
						isLoading={isLoading}
					>
						Применить
					</ButtonComponent>
				</Col>
			</Row>
		</>
	)
}

export default NameMail