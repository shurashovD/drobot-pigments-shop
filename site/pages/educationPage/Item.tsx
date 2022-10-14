import { FC } from "react"
import ImageComponent from "../../components/ImageComponent"

interface IProps {
	folder: string
	title: string
	widthToHeight: number
	url: string
}

const Item: FC<IProps> = ({ folder, title, url, widthToHeight }) => {
	const src = `static/assets/educationPage/${folder}/img.jpg`

	const handler = () => {
		window.open(url, "_blank")
	}

    return (
		<div className="education-cart" onClick={handler}>
			<ImageComponent src={src} widthToHeight={widthToHeight} />
			<div className="education-cart__label">
				<div>{title}</div>
			</div>
		</div>
	)
}

export default Item