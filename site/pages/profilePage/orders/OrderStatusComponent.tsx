import { FC } from 'react'

const OrderStatusComponent: FC<{ status: string }> = ({ status }) => {
    return (
		<div className="d-flex align-items-center">
			{status === "new" && (
				<span className="text-danger text-uppercase" style={{ borderBottom: "1px dashed #FD7575" }}>
					Не оплачен
				</span>
			)}
			{status === "payCanceled" && (
				<span className="text-uppercase text-muted" style={{ borderBottom: "1px dashed #ab9a9a" }}>
					Ошибка оплаты. Заказ отменён
				</span>
			)}
			{status === "compiling" && (
				<span className="text-uppercase" style={{ borderBottom: "1px dashed #39261F" }}>
					Оплачен, формируется
				</span>
			)}
			{status === "builded" && (
				<span className="text-uppercase" style={{ borderBottom: "1px dashed #39261F" }}>
					Собран
				</span>
			)}
			{status === "dispatch" && (
				<span className="text-uppercase" style={{ borderBottom: "1px dashed #39261F" }}>
					Передан в доставку
				</span>
			)}
			{status === "delivering" && (
				<span className="text-uppercase" style={{ borderBottom: "1px dashed #39261F" }}>
					В пути
				</span>
			)}
			{status === "ready" && (
				<span className="text-uppercase text-success" style={{ borderBottom: "1px dashed #58FF3D" }}>
					Готов к выдаче
				</span>
			)}
			{status === "complete" && (
				<span className="text-uppercase text-muted" style={{ borderBottom: "1px dashed #ab9a9a" }}>
					Получен
				</span>
			)}
			{status === "canceled" && (
				<span className="text-uppercase text-muted" style={{ borderBottom: "1px dashed #ab9a9a" }}>
					Отменён
				</span>
			)}
			{status === "return" && (
				<span className="text-uppercase text-muted" style={{ borderBottom: "1px dashed #ab9a9a" }}>
					Возврат
				</span>
			)}
		</div>
	)
}

export default OrderStatusComponent