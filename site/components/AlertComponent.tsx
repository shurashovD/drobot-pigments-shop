import { useEffect } from "react"
import { Alert, Container } from "react-bootstrap"
import { hideAlert } from "../application/alertSlice"
import { useAppDispatch, useAppSelector } from "../application/hooks"

const AlertComponent = () => {
    const { show, text, variant } = useAppSelector(state => state.alertSlice)
    const dispatch = useAppDispatch()

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
    
    return (
        <Container fluid className="position-fixed start-0 end-0 top-0 p-1" style={{ zIndex: 1100 }}>
            <Alert show={show} variant={variant}>
                {text}
            </Alert>
        </Container>
    )
}

export default AlertComponent