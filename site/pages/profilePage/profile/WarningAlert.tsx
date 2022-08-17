import { Collapse } from "react-bootstrap"
import { useAppSelector } from "../../../application/hooks"

const WarningAlert = () => {
    const { client } = useAppSelector(state => state.profileSlice)

    return (
		<Collapse in={!client?.name || !client?.mail}>
			<div
				className="p-4 text-center text-white"
				style={{ backgroundColor: "#AB9A9A" }}
			>
				В вашем профиле не хватает данных. <br />
				Заполните недостающие поля, чтобы оформлять покупки максимально
				удобно.
			</div>
		</Collapse>
	)
}

export default WarningAlert