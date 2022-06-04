import { FC } from 'react'

interface IProps {
    id: string
    number: string
    client?: string
    phone?: string
    address?: string
    mail?: string
    status: string
}

const Item: FC<IProps> = (props) => {
    return (
        <tr>
            <td>{props.number}</td>
            <td>{props.client}</td>
            <td className="text-center">{props.phone}</td>
            <td className="text-center">{props.address}</td>
            <td className="text-center">{props.mail}</td>
            <td className="text-center">{props.status}</td>
        </tr>
    )
}

export default Item