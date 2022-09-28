import classNames from "classnames"
import { Button, Collapse, Fade, Stack } from "react-bootstrap"
import { useAppDispatch, useAppSelector } from "../../../application/hooks"
import { useGetRecipientQuery } from "../../../application/order.service"
import { setActive } from "../../../application/orderSlice"
import Recipient from "./Recipient"

const parsePhoneValue = (value: string) => {
	const code = value.substring(0, 3)
	const first = value.substring(3, 6)
	const second = value.substring(6, 8)
	const fird = value.substring(8, 10)
	let result = "+7 ("
	if (value.length > 0) {
		result += code
	}
	if (value.length >= 3) {
		result += `) ${first}`
	}
	if (value.length >= 6) {
		result += `-${second}`
	}
	if (value.length >= 8) {
		result += `-${fird}`
	}
	return result
}

const RecipientWrapper = () => {
    const eventKey = "3"
    const { data: recipient } = useGetRecipientQuery(undefined)
	const { active: activeKey } = useAppSelector((state) => state.orderSlice)
	const disabled = useAppSelector((state) => !state.orderSlice.available.includes(eventKey))
	const empty = useAppSelector((state) => state.orderSlice.empty.includes(eventKey))
	const dispatch = useAppDispatch()

    return (
		<>
			<Button
				id="order-recipient"
				variant="link"
				onClick={() => dispatch(setActive(eventKey))}
				disabled={disabled}
				className={classNames("order-accordion__btn mt-5", { collapsed: activeKey === eventKey, empty: empty })}
			>
				<span className="text-uppercse fs-3">3. Получатель</span>
			</Button>
			<Collapse in={activeKey === eventKey}>
				<div className="mt-2">
					<Recipient />
				</div>
			</Collapse>
			<Collapse in={(!!recipient?.phone || !!recipient?.name || !!recipient?.mail) && activeKey !== "3"}>
				<Stack className="mt-5" dir="verical" gap={3}>
					<div>
						<span>Получатель: </span>
						<b>{recipient?.name || "не указан"}</b>
					</div>
					<div>
						<span>Телефон: </span>
						<b>{parsePhoneValue(recipient?.phone || "не указан")}</b>
					</div>
					<div>
						<span>E-mail: </span>
						<b>{recipient?.mail || "не указана"}</b>
					</div>
				</Stack>
			</Collapse>
		</>
	)
}

export default RecipientWrapper
