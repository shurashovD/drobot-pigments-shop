import { Spinner } from "react-bootstrap"
import { useAccountAuthQuery } from "../../../application/account.service"

const OrdersComponent = () => {
    const { data: auth, isFetching } = useAccountAuthQuery(undefined)
	const formatter = new Intl.NumberFormat('ru', {
		style: 'currency',
		currency: 'RUB',
		maximumFractionDigits: 0
	})

    return (
		<div className="p-3">
			{isFetching && (
				<div className="text-center p-3">
					<Spinner variant="secondary" animation="border" />
				</div>
			)}
			{!isFetching && auth && (
				<div className="text-muted mb-2">
					Сделано заказов { auth.orders.length }
				</div>
			)}
			{!isFetching && auth && (
				<div className="text-muted">
					Сумма всех заказов: {formatter.format(auth.total || 0)}
				</div>
			)}
		</div>
	)
}

export default OrdersComponent