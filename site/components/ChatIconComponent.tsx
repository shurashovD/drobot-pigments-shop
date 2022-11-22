import { useState } from "react"
import { Button } from "react-bootstrap"
import IconChat from "./icons/IconChat"

const ChatIconComponent = () => {
    const [stroke, setStroke] = useState<"#ffffff" | "#52372D">("#ffffff")
    const [variant, setVariant] = useState<"primary" | "secondary">("primary")

    const clickHandler = () => {

    }

    return (
		<div>
			<Button
				variant={variant}
				className="rounded-circle p-0 d-flex justify-content-center align-items-center"
				onClick={clickHandler}
				style={{ width: "30px", height: "30px" }}
			>
				<IconChat stroke={stroke} width={20} height={20} />
			</Button>
		</div>
	)
}

export default ChatIconComponent