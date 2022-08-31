import { useEffect } from "react"
import { Alert, Container } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { hideAlert, resetRedirectUrl } from "../application/alertSlice"
import { useAppDispatch, useAppSelector } from "../application/hooks"

const AlertComponent = () => {
    const { show, text, variant, redirectUrl } = useAppSelector(state => state.alertSlice)
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
        <Container fluid className="position-fixed start-0 end-0 top-0 p-1" style={{ zIndex: 1100 }}>
            <Alert show={show} variant={variant}>
                {text}
            </Alert>
        </Container>
    )
}

export default AlertComponent