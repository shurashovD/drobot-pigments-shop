import { FC } from "react"
import { NavLink } from "react-router-dom"
import { ICashbackReport } from "../../../shared"

const Item: FC<ICashbackReport> = (props) => {
    return (
		<>
			{props.promocodes.map(({ code, cashbackTotal, id }, index) => (
				<tr key={`${code}_${index}`}>
					{index === 0 && (
						<td rowSpan={props.promocodes.length}>
							<NavLink to={`/admin/client/${props.clientId}`}>{props.name}</NavLink>
						</td>
					)}
					<td className="text-center">
						<NavLink to={`/admin/promocode/${id}`}>{code}</NavLink>
					</td>
					<td className="text-center">{cashbackTotal}</td>
					{index === 0 && (
						<td rowSpan={props.promocodes.length} className="text-center">
							{props.totalCashback}
						</td>
					)}
					{index === 0 && (
						<td rowSpan={props.promocodes.length} className="text-center">
							{props.totalDebites}
						</td>
					)}
					{index === 0 && (
						<td rowSpan={props.promocodes.length} className="text-center">
							{props.availableCashBack}
						</td>
					)}
				</tr>
			))}
		</>
	)
}

export default Item