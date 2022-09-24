import { useEffect, useRef } from "react"
import { Button, Col, Fade, Row } from "react-bootstrap"
import { useAppDispatch, useAppSelector } from "../../../application/hooks"
import { useCreatePromocodeMutation, useUpdatePromocodeMutation } from "../../../application/profile.service"
import { promocodeIsCreated, promocodeIsUpdated, setForm, setShowCalendar } from "../../../application/profilePromocodesSlice"
import ButtonComponent from "../../../components/ButtonComponent"
import CalendarComponent from "../components/CalendarComponent"
import CodeInput from "./CodeInput"
import DateInput from "./DateInput"

const CreatePromocode = () => {
	const { editedPromocode, form, showCalendar } = useAppSelector(state => state.profilePromocodesSlice)
	const dispatch = useAppDispatch()
    const [create, { isLoading, isSuccess, reset }] = useCreatePromocodeMutation()
	const [update, { isLoading: updateLaoding, isSuccess: updateSuccess, reset: updateReset }] = useUpdatePromocodeMutation()
	const target = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
		if (isSuccess) {
			dispatch(promocodeIsCreated())
			reset()
		}
	}, [isSuccess, promocodeIsCreated, reset, dispatch])

	useEffect(() => {
		if (updateSuccess) {
			dispatch(promocodeIsUpdated())
			updateReset()
		}
	}, [updateSuccess, promocodeIsUpdated, updateReset, dispatch])

	return (
		<Row className="g-2 gy-5 justify-content-center mt-xs-5 mt-2">
			<Col xs={10} xl={4}>
				<CodeInput
					placeholder="Название промокода"
					value={form.code}
					onChange={(value) => dispatch(setForm({ key: "code", value }))}
					disabled={false}
				/>
			</Col>
			<Col xs={12} xl={6} className="position-relative">
				<Row className="justify-content-center g-0 position-relative" ref={target}>
					<Col xs={5}>
						<DateInput
							value={form.dateStart}
							placeholder="с"
							onClean={() => {
								dispatch(setForm({ key: "dateStart", value: "" }))
								dispatch(setForm({ key: "dateFinish", value: "" }))
							}}
							disabled={false}
						/>
					</Col>
					<Col xs={1}>
						<div className="mt-4 text-center">-</div>
					</Col>
					<Col xs={5}>
						<DateInput
							value={form.dateFinish}
							placeholder="по"
							onClean={() => dispatch(setForm({ key: "dateFinish", value: "" }))}
							disabled={false}
						/>
					</Col>
					<div className="position-absolute top-100 w-100 d-flex justify-content-center">
						<Fade in={showCalendar}>
							<div className="bg-secondary" style={{ width: "min-content" }}>
								<div className="text-end">
									<Button className="text-muted m-0 pb-0" variant="link" onClick={() => dispatch(setShowCalendar(false))}>
										Закрыть
									</Button>
								</div>
								<CalendarComponent />
							</div>
						</Fade>
					</div>
				</Row>
			</Col>
			<Col xs={12} lg={2} className="d-flex align-items-center justify-content-center" style={{ zIndex: `${showCalendar ? "-1" : "1"}` }}>
				<ButtonComponent
					disabled={
						form.code === "" ||
						form.dateStart === "" ||
						form.dateFinish === "" ||
						(form.code === editedPromocode?.code &&
							form.dateStart === editedPromocode?.dateStart?.toString() &&
							form.dateFinish === editedPromocode?.dateFinish?.toString())
					}
					onClick={() => (!!editedPromocode ? update({ body: form, id: editedPromocode.id }) : create({ body: form }))}
					isLoading={isLoading || updateLaoding}
				>
					{!!editedPromocode ? <>Изменить</> : <>Создать</>}
				</ButtonComponent>
			</Col>
		</Row>
	)
}

export default CreatePromocode