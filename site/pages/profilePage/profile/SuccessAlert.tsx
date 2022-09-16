import { useEffect, useState } from "react"
import { Collapse } from "react-bootstrap"
import { useAccountAuthQuery } from "../../../application/account.service"

const SuccessAlert = () => {
    const { data } = useAccountAuthQuery(undefined)
    const [show, setShow] = useState(false)
    
    useEffect(() => {
        const handler = () => setShow(false)
        setTimeout(() => {
            document.addEventListener("click", handler)
        }, 1000)

        return () => {
            document.removeEventListener('click', handler)
        }
    }, [])

    useEffect(() => {
        if ( data ) {
            setShow(!data.counterpartyId)
        }
    }, [data])

    return (
		<Collapse in={show}>
			<div className="bg-secondary p-4 text-center">
				Вы успешно зарегистрировались!
			</div>
		</Collapse>
	)
}

export default SuccessAlert