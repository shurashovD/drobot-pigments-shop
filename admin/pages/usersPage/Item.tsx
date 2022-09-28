import { ChangeEvent, FC } from "react"
import { Button, Form } from "react-bootstrap"
import { NavLink } from "react-router-dom"
import { useChangeUserStatusMutation } from "../../application/users.service"

interface IProps {
    id: string
    name: string
    phone?: string
    mail?: string
    status?: string
    isClaimed: boolean
    claimedStatus?: string
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

const Item: FC<IProps> = (props) => {
    const [action, { isLoading }] = useChangeUserStatusMutation()

    return (
		<tr className={`align-middle ${props.isClaimed && "fw-bold"} ${isLoading && "text-muted"}`}>
			<td>
				<NavLink to={`/admin/client/${props.id}`}>{props.name}</NavLink>
			</td>
			<td className="text-center">{props.phone && parsePhoneValue(props.phone)}</td>
			<td className="text-center">{props.mail}</td>
			<td className="text-center">{props.mail}</td>
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
					</Form.Select>
				) : (
					<>Не зарегисрирован</>
				)}
			</td>
			<td className="text-center">
				{props.claimedStatus === "agent" && <>Агент</>}
				{props.claimedStatus === "delegate" && <>Представитель</>}
			</td>
		</tr>
	)
}

export default Item