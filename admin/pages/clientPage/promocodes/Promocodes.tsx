import { FC, useEffect, useState } from "react"
import { Button, Table } from "react-bootstrap"
import { useGetPromocodesByUserQuery } from "../../../application/promocode.service"
import Item from "./Item"
import ModalComponent from "./ModalComponent"

interface IProps {
	clientId: string
}

const statuses = {
	created: 'Не начался',
	finished: 'Закончен',
	stopped: 'Остановлен',
	running: 'Активный'
}

const Promocodes: FC<IProps> = ({ clientId }) => {
	const { data } = useGetPromocodesByUserQuery({ clientId })
	const formatter = new Intl.DateTimeFormat('ru', { day: 'numeric', month: '2-digit', year: '2-digit' })
	const [show, setShow] = useState(false)
	const [editedPromocode, setEditedPromocode] = useState<string | undefined>()

	const hideHandler = () => {
		setShow(false)
		setEditedPromocode(undefined)
	}

	useEffect(() => {
		if ( editedPromocode ) {
			setShow(true)
		}
	}, [editedPromocode])

    return (
		<>
			{data && data.length > 0 && (
				<Table responsive className="mt-4">
					<thead>
						<tr className="align-middle">
							<th>Промокод</th>
							<th className="text-center">Период действия</th>
							<th className="text-center">Размер скидки</th>
							<th className="text-center">Статус</th>
							<th className="text-center">Кэшбэк</th>
							<th className="text-center">Изменить</th>
							<th className="text-center">Удалить</th>
						</tr>
					</thead>
					<tbody>
						{data.map((item) => (
							<Item
								key={item.id}
								cashBack={item.total.totalCashBack}
								code={item.code}
								dateFinish={formatter.format(Date.parse(item.dateFinish.toString()))}
								dateStart={formatter.format(Date.parse(item.dateStart.toString()))}
								discountPercentValue={item.discountPercentValue}
								id={item.id}
								status={statuses[item.status] || ""}
								onEdit={(id: string) => setEditedPromocode(id)}
							/>
						))}
					</tbody>
				</Table>
			)}
			{data && data.length === 0 && <div className="text-muted">Промокоды отсутсвуют</div>}
			<div className="text-end mt-3">
				<Button onClick={() => setShow(true)}>Добавить промокод</Button>
			</div>
			<ModalComponent show={show} onHide={hideHandler} id={editedPromocode} clientId={clientId} />
		</>
	)
}

export default Promocodes