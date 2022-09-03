import { useEffect } from "react"
import { Button, Container } from "react-bootstrap"
import { useLocation, useNavigate } from "react-router-dom"
import { useAccountAuthQuery } from "../../application/account.service"
import { useAppDispatch, useAppSelector } from "../../application/hooks"
import { setProfileClient, setShowAuthModal } from "../../application/profileSlice"
import LoaderComponent from "../../components/LoaderComponent"
import MobileAlerts from "./components/MobileAlerts"
import Favourite from "./Favourite"
import Main from "./main/Main"
import Mobile from "./mobile/Mobile"
import Orders from "./orders/Orders"
import Profile from "./profile/Profile"
import ProfilePageNavigate from "./ProfilePageNavigate"
import Promocodes from "./promocodes/Promocodes"
import SuccessModal from "./SuccessModal"

const ProfilePage = () => {
    const { hash } = useLocation()
	const navigate = useNavigate()
    const {data, isSuccess, isFetching} = useAccountAuthQuery(undefined, { refetchOnMountOrArgChange: true })
    const { client } = useAppSelector(state => state.profileSlice)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if ( isSuccess ) {
			if (!data) {
				dispatch(setShowAuthModal(true))
			} else {
				if (data.name) {
					const [name, lastName] = data.name?.split(" ")
					const initials = `${name[0]}${lastName?.[0] || ""}`.toUpperCase()
					dispatch(
						setProfileClient({
							name: data.name, mail: data.mail, phone: data.tel, initials, isCounterparty: !!data.counterpartyId, status: data.status
						})
					)
				} else {
					dispatch(setProfileClient({ isCounterparty: !!data.counterpartyId, phone: data.tel }))
				}
			}
        }
    }, [data, isSuccess])

    useEffect(() => {
        if (client && !client.isCounterparty) {
			navigate({ hash: "profile" })
        }
    }, [client])

	useEffect(() => {
		if ( !hash || hash === '' ) {
			navigate({ hash: '#main' })
		}
	}, [hash])

    return (
		<Container fluid className="p-0 pb-6">
			{isFetching && <LoaderComponent />}
			<SuccessModal />
			{!!client && (
				<div className="d-md-none">
					<MobileAlerts />
					<Mobile />
				</div>
			)}
			{!!client && (
				<div className="d-none d-md-block">
					<ProfilePageNavigate />
					{hash === "#main" && <Main />}
					{hash === "#orders" && <Orders />}
					{hash === "#promocodes" &&  (client.status === 'agent' || client.status === 'delegate') && <Promocodes />}
					{hash === "#favourite" && <Favourite />}
					{hash === "#profile" && <Profile />}
				</div>
			)}
			{!client && (
				<div>
					<p className="fs-3 mb-4">Вход в профиль не выполнен</p>
					<p>Войдите в пофиль, чтоб получить доступ к программе лояльности и ранее совершенным заказам</p>
					<Button onClick={() => dispatch(setShowAuthModal(true))}>Войти в профиль</Button>
				</div>
			)}
		</Container>
	)
}

export default ProfilePage