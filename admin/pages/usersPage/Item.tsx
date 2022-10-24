import { ChangeEvent, FC } from "react"
import { Form } from "react-bootstrap"
import { NavLink } from "react-router-dom"
import { useChangeUserStatusMutation } from "../../application/users.service"

interface IProps {
    id: string
    name: string
    phone?: string
	promocode?: string
    mail?: string
    status?: string
    isClaimed: boolean
    claimedStatus?: string
}

const parsePhoneValue = (value?: string) => {
	if (!value) return ""
	const country = value.substring(0, value.length - 10)
	const number = value.substring(value.length - 10)
	const code = number.substring(0, 3)
	const first = number.substring(3, 6)
	const second = number.substring(6, 8)
	const fird = number.substring(8, 10)
	return `+${country} (${code}) ${first}-${second}-${fird}`
}

const Item: FC<IProps> = (props) => {
    const [action, { isLoading }] = useChangeUserStatusMutation()

    return (
		<tr className={`align-middle ${props.isClaimed && "fw-bold"} ${isLoading && "text-muted"}`}>
			<td>
				<NavLink to={`/admin/client/${props.id}`}>{props.name}</NavLink>
			</td>
			<td className="text-center">{props.phone && parsePhoneValue(props.phone)}</td>
			<td className="text-center">{props.mail}</td>
			<td className="text-center">{props.promocode}</td>
			<td className="text-center">
				{props.status ? (
					<Form.Select
						disabled={props.status === "none" || isLoading}
						value={props.status}
						onChange={(e: ChangeEvent<HTMLSelectElement>) => action({ id: props.id, status: e.target.value })}
					>
						<option value="common">Розничный покупатель</option>
						<option value="agent">Агент</option>
						<option value="delegate">Представитель</option>
						<option value="coach">Тренер</option>
					</Form.Select>
				) : (
					<>Не зарегистрирован</>
				)}
			</td>
			<td className="text-center">
				{props.claimedStatus === "agent" && <>Агент</>}
				{props.claimedStatus === "delegate" && <>Представитель</>}
				{props.claimedStatus === "coach" && <>Тренер</>}
			</td>
		</tr>
	)
}

export default Item