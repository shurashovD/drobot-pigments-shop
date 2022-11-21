import { FC } from "react"
import { Offcanvas, Stack } from "react-bootstrap"
import Input from "./Input"
import Message from "./Message"

interface IProps {
    show: boolean
    onHide?: () => void
}

const ChatOffcanvas: FC<IProps> = ({ show, onHide }) => {
    const messages: { text: string; type: "input" | "output"; id: number }[] = [
		{ text: "Test", type: "output", id: 0 },
		{ text: "Обновление статуса доставки сообщения", type: "input", id: 1 },
		{ text: "Test", type: "output", id: 2 },
		{ text: "Метод вернет идентификатор сообщения в API чатов. Сообщение появится в чате после обработки.", type: "input", id: 3 },
		{ text: "Test", type: "output", id: 4 },
		{ text: "Метод позволяет обновить статус доставки у конкретного сообщения", type: "input", id: 5 },
		{ text: "Test", type: "output", id: 6 },
		{ text: "Требуется заголовки Date, Content-Type, Content-MD5, X-Signature", type: "input", id: 7 },
		{ text: "Test", type: "output", id: 8 },
		{ text: "Date: текущее время в формате RFC 2822 (например: Mon, 03 Oct 2020 15:11:21", type: "input", id: 9 },
	]

    return (
		<Offcanvas show={show} onHide={onHide} backdrop={false} className="bg-light">
			<Offcanvas.Header closeButton>
				<Offcanvas.Title>Чат с продавцом</Offcanvas.Title>
			</Offcanvas.Header>
			<Offcanvas.Body className="d-flex flex-column">
				<Stack direction="vertical" gap={2} className="d-flex flex-column-reverse mt-auto overflow-scroll no-scrollbar mb-3">
					{messages.map(({ id, text, type }) => (
						<Message key={id} text={text} type={type} />
					))}
				</Stack>
				<Input />
			</Offcanvas.Body>
		</Offcanvas>
	)
}

export default ChatOffcanvas