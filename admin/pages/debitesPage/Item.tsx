import { FC } from "react"
import { IDebiteReport } from "../../../shared"

const Item: FC<IDebiteReport['debites'][0]> = (props) => {
    const formatter = new Intl.DateTimeFormat('ru', { day: 'numeric', month: 'long', year: '2-digit' })

    return (
		<tr className="align-items-center">
			<td>{formatter.format(new Date(props.date))}</td>
			<td className="text-center">{props.debite}</td>
			<td className="text-center">{
                !!props.orderId ? 'Оплата заказа' : 'Списание администратором'
            }</td>
			<td className="text-center">{props.order || '-'}</td>
			<td className="text-center">{props.orderTotal || '-'}</td>
		</tr>
	)
}

export default Item