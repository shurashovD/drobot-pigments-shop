import { useEffect } from "react"
import { Alert } from "react-bootstrap"
import { NavLink } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { hideAlert, resetRedirectUrl } from "../application/alertSlice"
import { useAppDispatch, useAppSelector } from "../application/hooks"

const AlertComponent = () => {
    const { show, text, variant = "success", redirectUrl, orderNumber, failedOrder } = useAppSelector(state => state.alertSlice)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        const handler = () => {
			dispatch(hideAlert())
		}

        if (show) {
            document.addEventListener("click", handler)
        }
        else {
            document.removeEventListener("click", handler)
        }

		return () => {
			document.removeEventListener("click", handler)
		}
	}, [show, dispatch, hideAlert])

    useEffect(() => {
        if ( redirectUrl ) {
            navigate(redirectUrl)
            dispatch(resetRedirectUrl())
        }
    }, [redirectUrl, dispatch, resetRedirectUrl, navigate])
    
    return (
		<div className="position-fixed bottom-0 end-0 p-1 pb-4 alert-container">
			<Alert show={show} variant={variant} className="p-5">
				{orderNumber && (
					<Alert.Heading className="text-uppercase fs-6">
						{failedOrder ? <>Ошибка оплаты заказа {orderNumber}</> : <>Заказ {orderNumber} оплачен</>}
					</Alert.Heading>
				)}
				{!orderNumber && <>{text}</>}
				{orderNumber && (
					<>
						Отслеживайте заказы <br />
						<span className="no-wrap">
							в <NavLink to="/profile#orders">личном кабинете</NavLink>
						</span>
					</>
				)}
			</Alert>
		</div>
	)
}

export default AlertComponent