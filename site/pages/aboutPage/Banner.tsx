import { Image } from "react-bootstrap"
const img = require('../../img/about_banner.png')
const imgM = require("../../img/m_about_banner.png")

const Banner = () => {
    return (
		<div className="mb-5">
			<Image src={img} alt="banner" fluid className="d-none d-lg-block" />
			<Image src={imgM} alt="banner" fluid className="d-lg-none" />
		</div>
	)
}

export default Banner