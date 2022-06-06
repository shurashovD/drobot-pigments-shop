import { FC } from 'react'
import { NavLink } from 'react-router-dom'

interface IProps {
    id: string
    date: string
    number: string
    client?: string
    new: boolean
    phone?: string
    address?: string
    mail?: string
    status: string
}

const Item: FC<IProps> = (props) => {
    return (
		<tr className={`${props.new && "fw-bold"}`}>
			<td>
				<NavLink to={`/admin/orders/${props.id}`}>{props.number}</NavLink>
			</td>
			<td>{props.date}</td>
			<td>{props.client}</td>
			<td className="text-center">{props.phone}</td>
			<td className="text-center">{props.address}</td>
			<td className="text-center">{props.mail}</td>
			<td className="text-center">{props.status}</td>
		</tr>
	)
}

export default Item