import { useRef, useState } from "react"
import { Form } from "react-bootstrap"
import ButtonComponent from "../ButtonComponent"

const Input = () => {
    const ref = useRef<HTMLTextAreaElement|null>(null)
    const [isLoading, setIsloading] = useState(false)

    const submitHandler = () => {
        setIsloading(true)
		setTimeout(() => {
			setIsloading(false)
		}, 2000)
        if ( !ref.current ) {
            return
        }

        const text = ref.current.value
    }

    return (
		<div>
			<Form.Control as="textarea" className="mb-2" ref={ref} />
			<div className="w-min-content ms-auto">
				<ButtonComponent variant="secondary" size="sm" onClick={submitHandler} isLoading={isLoading}>
					Отправить
				</ButtonComponent>
			</div>
		</div>
	)
}

export default Input