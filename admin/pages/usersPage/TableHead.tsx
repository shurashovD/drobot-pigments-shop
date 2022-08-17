import { ChangeEvent, FC } from "react"
import { Form } from "react-bootstrap"

interface IProps {
    disabled: boolean
    handler: (status: string) => void
    value: string
}

const TableHaed: FC<IProps> = ({ disabled, handler, value }) => {
    const selectHandler = (event: ChangeEvent<HTMLSelectElement>) => {
        handler(event.target.value)
    }

    return (
		<thead>
			<tr className="align-middle">
				<th>Имя</th>
				<th className="text-center">Телефон</th>
				<th className="text-center">Почта</th>
				<th className="text-center">
					<Form.Select
						disabled={disabled}
						onChange={selectHandler}
						value={value}
					>
						<option value="all">Все попользователи</option>
						<option value="common">Розничный покупатель</option>
						<option value="agent">Агент</option>
						<option value="delegate">Представитель</option>
					</Form.Select>
				</th>
				<th className="text-center">Запрос статуса</th>
			</tr>
		</thead>
	)
}

export default TableHaed