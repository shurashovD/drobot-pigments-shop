import { useEffect, useState } from "react"
import { Collapse } from "react-bootstrap"
import { useAccountAuthQuery } from "../../../application/account.service"
import { useAppSelector } from "../../../application/hooks"

const SaveAlert = () => {
    const { data, currentData } = useAccountAuthQuery(undefined)
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

    useEffect(() => {
        console.log(data);
        console.log(currentData)
    }, [data, currentData])

    return (
		<Collapse in={true}>
			<div className="bg-succcess p-4 text-center">Данные сохранены.</div>
		</Collapse>
	)
}

export default SaveAlert