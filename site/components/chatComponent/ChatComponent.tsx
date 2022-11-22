import { useEffect, useRef, useState } from "react"
import { Button } from "react-bootstrap"
import { useAccountAuthQuery } from "../../application/account.service"
import ChatIconComponent from "../ChatIconComponent"
import ChatOffcanvas from "./ChatOffcanvas"

const ChatComponent = () => {
	const { data } = useAccountAuthQuery(undefined)
	const [show, setShow] = useState(false)
	const [newMessage, setNewMessage] = useState<string|undefined>()
	const socket = useRef<WebSocket>()

	const clickHandler = () => {
		setShow(!show)
	}

	useEffect(() => {
		const ws = new WebSocket("ws://localhost:3001")
		ws.onopen = function() {
			socket.current = this
		}
		ws.onmessage = function({ data }: MessageEvent) {
			
		}
	}, [socket])

    return (
		<div className="position-fixed bottom-0 end-0 p-1" style={{ zIndex: 1101 }}>
			<div className="d-none d-lg-block">
				<ChatIconComponent />
			</div>
			<ChatOffcanvas show={show} onHide={() => setShow(false)} />
		</div>
	)
}

export default ChatComponent