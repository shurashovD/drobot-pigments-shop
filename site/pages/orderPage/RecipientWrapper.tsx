import { FC } from "react"
import { Accordion, Fade, Stack } from "react-bootstrap"
import { useGetRecipientQuery } from "../../application/order.service"
import Recipient from "./Recipient"

interface IProps {
	activeKey?: string
	accordionHandler: (key: string) => void
}

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

const RecipientWrapper: FC<IProps> = ({ accordionHandler, activeKey }) => {
    const eventKey = "3"
    const { data: recipient, isFetching } = useGetRecipientQuery(undefined)

    return (
		<>
			<Accordion.Item eventKey="3" className="border-0 border-bottom">
				<Accordion.Header onClick={() => accordionHandler}>
					<span className="text-uppercse fs-3">3. Получатель</span>
				</Accordion.Header>
				<Accordion.Body>
					<Recipient />
				</Accordion.Body>
			</Accordion.Item>
			<Fade in={!!recipient?.phone && !!recipient?.name && !!recipient?.mail && activeKey !== "3"}>
				<Stack className="my-5" dir="verical" gap={3}>
					<div>
						<span>Получатель: </span>
						<b>{recipient?.name}</b>
					</div>
					<div>
						<span>Телефон: </span>
						<b>{parsePhoneValue(recipient?.phone || "")}</b>
					</div>
					<div>
						<span>E-mail: </span>
						<b>{recipient?.mail}</b>
					</div>
				</Stack>
			</Fade>
		</>
	)
}

export default RecipientWrapper
