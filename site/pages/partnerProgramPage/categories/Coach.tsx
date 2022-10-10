import { Button } from "react-bootstrap"
import { useAccountAuthQuery, useSetClaimedStatusMutation } from "../../../application/account.service"
import ButtonComponent from "../../../components/ButtonComponent"

const Coach = () => {
	const [setStatus, { isLoading }] = useSetClaimedStatusMutation()
	const { data: auth, isFetching } = useAccountAuthQuery(undefined, { refetchOnMountOrArgChange: true })

	return (
		<div style={{ backgroundColor: "#FDF9EF" }} className="d-flex flex-column justify-content-between align-items-center pb-6 h-100">
			<div className="text-center text-uppercase text-white bg-dark p-4 w-100 mb-2">Тренер</div>
			<div className="text-center my-6 px-4">
				<b className="text-dark">Становись тренером</b> Drobot Pigments и обучай работе на пигментах в соответствии с фирменной колористикой.
			</div>
			{auth?.status === "coach" && (
				<Button variant="link text-primary" disabled={true}>
					Ваш статус - тренер
				</Button>
			)}
			{auth?.status !== "agent" && (
				<ButtonComponent
					isLoading={isLoading}
					disabled={isFetching || !!auth?.claimedStatus}
					variant="outline-secondary text-primary"
					onClick={() => setStatus({ claimedStatus: "coach" })}
				>
					{auth?.claimedStatus === "coach" ? <>Заявка на рассмотрении</> : <>Стать тренером</>}
				</ButtonComponent>
			)}
		</div>
	)
}

export default Coach
