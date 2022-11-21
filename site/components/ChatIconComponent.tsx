import { useState } from "react"
import { Button } from "react-bootstrap"
import IconChat from "./icons/IconChat"

const ChatIconComponent = () => {
    const [stroke, setStroke] = useState<"#ffffff" | "#52372D">("#ffffff")
    const [variant, setVariant] = useState<"primary"|"secondary">("primary")

    const clickHandler = () => {

    }

    return (
		<div className="d-none">
			<Button variant={variant} className="rounded-circle p-0 p-lg-2 d-flex justify-content-center align-items-center" onClick={clickHandler}>
				<IconChat stroke={stroke} />
			</Button>
		</div>
	)
}

export default ChatIconComponent