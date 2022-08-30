import { FC } from "react"
import { useDeleteHookMutation } from "../../../application/sdek.service"
import ButtonComponent from "../../../components/ButtonComponent"

interface IProps {
    disabled?: boolean
	entityType: string
	id: string
	url: string
}

const Item: FC<IProps> = ({ url, entityType, id, disabled }) => {
	const [remove, { isLoading }] = useDeleteHookMutation()

	return (
		<tr className="align-middle text-center">
			<td>
				{entityType === "ORDER_STATUS" && <>Заказ</>}
				{entityType === "PRINT_FORM" && <>Форма</>}
				{entityType === "DOWNLOAD_PHOTO" && <>Фотографии</>}
			</td>
			<td>{url}</td>
			<td>
				<ButtonComponent
					variant="link"
					className="text-danger"
					isLoading={isLoading}
					onClick={() => (id ? remove({ id }) : {})}
					disabled={disabled}
				>
					Удалить
				</ButtonComponent>
			</td>
		</tr>
	)
}

export default Item