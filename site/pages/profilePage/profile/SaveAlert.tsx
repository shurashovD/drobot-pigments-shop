import { useCallback, useEffect, useState } from "react"
import { Collapse } from "react-bootstrap"
import { useAccountAuthQuery } from "../../../application/account.service"

const SaveAlert = () => {
    const { data } = useAccountAuthQuery(undefined)
    const [state, setState] = useState({ name: '', mail: '' })
    const [show, setShow] = useState(false)
    const [isCounterparty, setIsCounterparty] = useState<boolean | undefined>()

    const handler = useCallback(() => {
        setShow(false)
    }, [])
    
    useEffect(() => {
        if (show) {
            setTimeout(() => {
				document.addEventListener("click", handler)
			}, 1000)
        } else {
            document.removeEventListener("click", handler)
        }
    }, [handler, show])

    useEffect(() => {
        if ( data ) {
            const { name, mail, counterpartyId } = data
            if ( state.name === '' && state.mail === '' ) {
                setState({ name: name || '', mail: mail || '' })
            } else {
                if ( name !== state.name || mail !== state.mail ) {
                    setState({ name: name || "", mail: mail || "" })
                    setShow(true)
                }
            }
            if ( isCounterparty === false ) {
                setShow(!!counterpartyId)
            }
            setIsCounterparty(!!counterpartyId)
        }
    }, [data, state, isCounterparty])

    return (
		<Collapse in={show}>
			<div className="bg-success p-4 text-center">Данные сохранены.</div>
		</Collapse>
	)
}

export default SaveAlert