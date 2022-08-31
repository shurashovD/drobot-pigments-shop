import { useAccountAuthQuery, useSetClaimedStatusMutation } from "../../../application/account.service"
import ButtonComponent from "../../../components/ButtonComponent"

const Delegate = () => {
	const [setStatus, { isLoading }] = useSetClaimedStatusMutation()
	const { data: auth, isFetching } = useAccountAuthQuery(undefined, { refetchOnMountOrArgChange: true })

	return (
		<div style={{ backgroundColor: "#FDF9EF" }} className="d-flex flex-column justify-content-between align-items-center pb-6 h-100">
			<div className="text-center text-uppercase text-white bg-dark p-4 w-100 mb-2">Представитель</div>
			<div className="text-center my-6 px-4">
				Объём закупок от 40 000 рублей в год? Становись представителем и покупай <span className="text-dark">максимально выгодно.</span>
			</div>
			{auth?.status === "delegate" && (
				<div className="text-center">
					<span className="border-secondary px-4 py-2">Ваш статус представитель</span>
				</div>
			)}
			{auth?.status !== "delegate" && (
				<ButtonComponent
					isLoading={isLoading}
					disabled={isFetching || !!auth?.claimedStatus}
					variant="outline-secondary text-primary"
					onClick={() => setStatus({ claimedStatus: "delegate" })}
				>
					{auth?.claimedStatus === "delegate" ? <>Заявка на рассмотрении</> : <>Стать представителем</>}
				</ButtonComponent>
			)}
		</div>
	)
}

export default Delegate
