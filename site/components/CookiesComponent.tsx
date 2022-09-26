import { useEffect, useState } from "react"
import { Button, Modal } from "react-bootstrap"
import { NavLink } from "react-router-dom"
import { useGetCookiesQuery, useSetCookiesMutation } from "../application/cookies.service"

const CookiesComponent = () => {
    const [state, setState] = useState(false)
    const { data, isSuccess } = useGetCookiesQuery()
    const [setCookies] = useSetCookiesMutation()

    const handler = () => {
        setCookies()
        setState(false)
    }

    useEffect(() => {
        if ( isSuccess ) {
            setState(!data)
        }
    }, [data, isSuccess])
 
    return (
		<Modal show={state} className="border-0" onHide={handler}>
			<Modal.Body className="bg-dark border-0 p-5">
				<div className="text-white text-center mb-5">
					Оставаясь на сайте, вы соглашаетесь с{" "}
					<NavLink className="text-white text-decoration-underline white-space" to="/cookies" onClick={handler}>
						Политикой использования Cookie
					</NavLink>
				</div>
				<div className="text-center">
					<Button className="text-primary bg-white border-0 w-25" onClick={handler}>
						OK
					</Button>
				</div>
			</Modal.Body>
		</Modal>
	)
}

export default CookiesComponent