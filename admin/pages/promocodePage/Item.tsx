import { FC } from 'react'
import { IPromocodeDetails } from '../../../shared/index'

const Item: FC<IPromocodeDetails['orders'][0]> = (props) => {
    return (
		<tr>
			<td>{props.orderNumber}</td>
			<td className="text-center">{props.orderCashBack}</td>
			<td className="text-center">{props.orderTotal}</td>
			<td className="text-center">{props.buyer}</td>
		</tr>
	)
}

export default Item