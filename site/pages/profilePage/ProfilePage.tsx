import { useEffect } from "react"
import { Button, Container } from "react-bootstrap"
import { useLocation, useNavigate } from "react-router-dom"
import { useAccountAuthQuery } from "../../application/account.service"
import { setShow } from "../../application/authComponentSlice"
import { useAppDispatch } from "../../application/hooks"
import LoaderComponent from "../../components/LoaderComponent"
import MobileAlerts from "./components/MobileAlerts"
import Favourite from "./Favourite"
import Main from "./main/Main"
import Mobile from "./mobile/Mobile"
import Orders from "./orders/Orders"
import Profile from "./profile/Profile"
import SaveAlert from "./profile/SaveAlert"
import ProfilePageNavigate from "./ProfilePageNavigate"
import Promocodes from "./promocodes/Promocodes"
import SuccessModal from "./SuccessModal"

const ProfilePage = () => {
    const { hash } = useLocation()
	const navigate = useNavigate()
    const {data, isSuccess, isFetching} = useAccountAuthQuery(undefined, { refetchOnMountOrArgChange: true })
    const dispatch = useAppDispatch()

    useEffect(() => {
        if ( isSuccess ) {
			if (!data) {
				dispatch(setShow(true))
			}
        }
    }, [data, isSuccess])

    useEffect(() => {
        if (data && !data.counterpartyId) {
			navigate({ hash: "#profile" })
        }
    }, [data])

	useEffect(() => {
		if ( !hash || hash === '' ) {
			navigate({ hash: '#main' })
		}
	}, [hash])

	useEffect(() => {
		document.title = 'Личный кабинет'
	}, [])

    return (
		<Container fluid className="p-0 pb-6">
			{isFetching && <LoaderComponent />}
			<SuccessModal />
			{!!data && (
				<div className="d-md-none">
					<MobileAlerts />
					<Mobile />
					<div className="position-fixed start-0 end-0 bottom-0 p-2" style={{ zIndex: 1 }}>
						<SaveAlert />
					</div>
				</div>
			)}
			{!!data && (
				<div className="d-none d-md-block">
					<ProfilePageNavigate />
					{hash === "#main" && <Main />}
					{hash === "#orders" && <Orders />}
					{hash === "#promocodes" && (data.status === "agent" || data.status === "delegate") && <Promocodes />}
					{hash === "#favourite" && <Favourite />}
					{hash === "#profile" && <Profile />}
				</div>
			)}
			{!data && (
				<Container className="pt-6">
					<p className="fs-3 mb-4">Вход в профиль не выполнен</p>
					<p>Войдите в пофиль, чтоб получить доступ к программе лояльности и ранее совершенным заказам</p>
					<Button onClick={() => dispatch(setShow(true))}>Войти в профиль</Button>
				</Container>
			)}
		</Container>
	)
}

export default ProfilePage