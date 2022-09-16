import { Image } from "react-bootstrap"
const sdekLogo = require("../../img/cdek.svg")

const Sdek = () => {
	return (
		<div className="p-4 p-lg-5 h-100" style={{ backgroundColor: "#F9F9F9" }}>
			<Image src={sdekLogo} alt="СДЭК" width="159" />
			<div className="text-uppercase mt-2 mb-4">Курьерская служба</div>
			<div className="text-muted mb-2">Способы доставки: </div>
			<ul className="mb-4 p-0 delivery-list">
				<li className="mb-1">В ближайщий для покупателя пункт выдачи СДЭК</li>
				<li>Доставка курьером до адреса покупателя</li>
			</ul>
			<div className="text-muted mb-2">Срок доставки: </div>
			<ul className="mb-4 p-0 delivery-list">
				<li>2–5 дней, в зависимости от направления</li>
			</ul>
			<div className="text-muted mb-2">Стоимость: </div>
			<ul className="p-0 delivery-list">
				<li>от 300 рублей, рассчитывается индивидуально</li>
			</ul>
		</div>
	)
}

export default Sdek
