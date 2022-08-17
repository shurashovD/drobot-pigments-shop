import { FC } from 'react'

const OrderStatusComponent: FC<{ status: string }> = ({ status }) => {
    return (
		<div className="d-flex align-items-center">
			{status === "new" && <span className="text-muted">Не обработан</span>}
			{status === "compiling" && <span>Собран</span>}
			{status === "deliveried" && <span className="text-dark">В пути</span>}
			{status === "complete" && <span className="text-success">Доставлен</span>}
		</div>
	)
}

export default OrderStatusComponent