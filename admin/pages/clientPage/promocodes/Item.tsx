import { FC } from "react"
import { Button } from "react-bootstrap"
import { useDeletePromocodeMutation } from "../../../application/promocode.service"
import ButtonComponent from "../../../components/ButtonComponent"

interface IProps {
    id: string
    code: string
    dateStart: string
    dateFinish: string
    cashBack: number
    status: string
    onEdit: (id: string) => void
}

const Item: FC<IProps> = ({ cashBack, code, dateFinish, dateStart, id, status, onEdit }) => {
	const [remove, { isLoading }] = useDeletePromocodeMutation()

    return (
		<tr className="align-items">
			<td>{code}</td>
			<td className="text-center">
				{dateStart} - {dateFinish}
			</td>
			<td className="text-center">{status}</td>
			<td className="text-center">{cashBack}</td>
			<td className="text-center">
                <Button size="sm" onClick={() => onEdit(id)}>
                    Изменить
                </Button>
            </td>
			<td className="text-center">
				<ButtonComponent variant="link" className="text-danger" size="sm" onClick={() => remove({ id })} isLoading={isLoading}>
					<small>Удалить</small>
				</ButtonComponent>
			</td>
		</tr>
	)
}

export default Item