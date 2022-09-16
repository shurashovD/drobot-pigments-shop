import { Collapse } from "react-bootstrap"
import { useAccountAuthQuery } from "../../../application/account.service"

const WarningAlert = () => {
	const { data: client } = useAccountAuthQuery(undefined)

    return (
		<Collapse in={!client?.name || !client?.mail || !client?.counterpartyId}>
			<div className="p-4 text-center text-white" style={{ backgroundColor: "#AB9A9A" }}>
				В вашем профиле не хватает данных. <br />
				Сохраните личные данные, чтобы получить доступ ко всем функциям интернет магазина.
			</div>
		</Collapse>
	)
}

export default WarningAlert