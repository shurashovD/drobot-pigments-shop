import { FC } from "react"

interface IProps {
    text: string
    type: "input"|"output"
}

const Message: FC<IProps> = ({ text, type }) => {
    const position = type === 'input' ? "me-auto" : "ms-auto"
    const bg = type === "input" ? "bg-secondary" : "bg-primary"
    const color = type === "input" ? "text-dark" : "text-secondary"

    return (
		<div className={`d-flex flex-wrap align-items-end p-2 px-3 ${position} ${bg} ${color}`} style={{ maxWidth: "80%" }} >
			<div>{text}</div>
            <small className="ms-auto text-muted ps-2 pt-1">10:03</small>
		</div>
	)
}

export default Message