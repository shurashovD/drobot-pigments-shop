import { Button } from 'react-bootstrap'
import { useSetClaimedStatusMutation } from '../../../application/account.service'
import { useAccountAuthQuery } from '../../../application/account.service'
import ButtonComponent from '../../../components/ButtonComponent'

const Agent = () => {
	const [setStatus, { isLoading }] = useSetClaimedStatusMutation()
	const { data: auth, isFetching  } = useAccountAuthQuery(undefined, { refetchOnMountOrArgChange: true })

    return (
		<div style={{ backgroundColor: "#FDF9EF", maxWidth: '362px' }} className="d-flex flex-column justify-content-between align-items-center pb-6 h-100">
			<div className="text-center text-uppercase text-white bg-dark p-4 w-100 mb-2">Агент</div>
			<div className="text-center my-6 px-4">
				Рекламируй пигменты и
				<br />
				<b className="text-dark">получай кэшбэк 10%</b> с каждой продажи
				<br />
				по промокоду.
			</div>
			{auth?.status === "agent" && (
				<Button variant="link text-primary" disabled={true}>
					Ваш статус - агент
				</Button>
			)}
			{auth?.status !== "agent" && (
				<ButtonComponent
					isLoading={isLoading}
					disabled={isFetching || !!auth?.claimedStatus}
					variant="outline-secondary text-primary"
					onClick={() => setStatus({ claimedStatus: "agent" })}
				>
					{auth?.claimedStatus === "agent" ? <>Заявка на рассмотрении</> : <>Стать агентом</>}
				</ButtonComponent>
			)}
		</div>
	)
}

export default Agent