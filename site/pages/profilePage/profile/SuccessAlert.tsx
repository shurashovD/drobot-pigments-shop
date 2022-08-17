import { useEffect, useState } from "react"
import { Collapse } from "react-bootstrap"
import { useAppSelector } from "../../../application/hooks"

const SuccessAlert = () => {
    const isCounterparty = useAppSelector(state => !state.profileSlice.client?.isCounterparty)
    const [show, setShow] = useState(isCounterparty)
    
    useEffect(() => {
        const handler = () => setShow(false)
        setTimeout(() => {
            document.addEventListener("click", handler)
        }, 1000)

        return () => {
            document.removeEventListener('click', handler)
        }
    }, [])

    return (
		<Collapse in={show}>
			<div className="bg-secondary p-4 text-center">
				Вы успешно зарегистрировались!
			</div>
		</Collapse>
	)
}

export default SuccessAlert