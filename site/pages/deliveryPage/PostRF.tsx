import { Image } from "react-bootstrap"
const postLogo = require("../../img/pochtaRF.svg")

const PostRF = () => {
	return (
		<div className="p-4 p-lg-5 h-100" style={{ backgroundColor: "#F9F9F9" }}>
			<Image src={postLogo} alt="СДЭК" width="159" />
			<div className="text-uppercase mt-2 mb-4">Курьерская служба</div>
			<div className="text-muted mb-2">Способы доставки: </div>
			<ul className="mb-4 p-0 delivery-list">
				<li>В отделении Почты России</li>
			</ul>
			<div className="text-muted mb-2">Срок доставки: </div>
			<ul className="mb-4 p-0 delivery-list">
				<li>от 10-20 дней, в зависимости от направления</li>
			</ul>
			<div className="text-muted mb-2">Стоимость: </div>
			<ul className="p-0 delivery-list">
				<li>Бесплатно</li>
			</ul>
		</div>
	)
}

export default PostRF
