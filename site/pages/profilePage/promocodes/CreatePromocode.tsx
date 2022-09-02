import { useEffect } from "react"
import { Col, Row } from "react-bootstrap"
import { useAppDispatch, useAppSelector } from "../../../application/hooks"
import { useCreatePromocodeMutation, useUpdatePromocodeMutation } from "../../../application/profile.service"
import { promocodeIsCreated, promocodeIsUpdated, setForm } from "../../../application/profilePromocodesSlice"
import ButtonComponent from "../../../components/ButtonComponent"
import CodeInput from "./CodeInput"
import DateInput from "./DateInput"

const CreatePromocode = () => {
	const { editedPromocode, form } = useAppSelector(state => state.profilePromocodesSlice)
	const dispatch = useAppDispatch()
    const [create, { isLoading, isSuccess, reset }] = useCreatePromocodeMutation()
	const [update, { isLoading: updateLaoding, isSuccess: updateSuccess, reset: updateReset }] = useUpdatePromocodeMutation()

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
			<Col xs={10} lg={4}>
				<CodeInput
					placeholder="Название промокода"
					value={form.code}
					onChange={(value) => dispatch(setForm({ key: "code", value }))}
					disabled={false}
				/>
			</Col>
			<Col xs={12} lg={6}>
				<Row className="justify-content-center g-0">
					<Col xs={5}>
						<DateInput
							value={form.dateStart}
							placeholder="с"
							onChange={(value) => dispatch(setForm({ key: "dateStart", value }))}
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
							onChange={(value) => dispatch(setForm({ key: "dateFinish", value }))}
							disabled={false}
						/>
					</Col>
				</Row>
			</Col>
			<Col xs={12} lg={2} className="d-flex align-items-center justify-content-center">
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