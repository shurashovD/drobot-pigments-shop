import { FC, useEffect, useState } from "react"
import { Carousel, Image as BImage } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useGetContentQuery } from "../../application/category.service"

const Banners: FC<{ categoryId: string }> = ({ categoryId }) => {
	const { data: content } = useGetContentQuery({ categoryId })
    const [pictures, setPictures] = useState<{src: string, to: boolean, url?: string}[]>([])
    const [controls, setControls] = useState(false)
    const navigate = useNavigate()

    const handler = (to: boolean, url?: string) => {
		if ( !url ) {
			return
		}
        if ( to ) {
            navigate(url)
        } else {
            window.open(url, "_blank")
        }
    }

    useEffect(() => {
		if (content && pictures.length < content.carouselImages.length) {
			const carousel = document.getElementById("pigments-banner-carousel")
			if (carousel) {
				const width = carousel.offsetWidth
				setControls(width > 576)
				if (content.carouselImages[pictures.length]) {
					const { imgSrc: src, href, to } = content.carouselImages[pictures.length]
					const navigate = !href && !!to
					const url = navigate ? to : href
					if ( src ) {
						const img = new Image()
						//img.src = width > 576 ? lg : sm
						img.src = src
						img.onload = function () {
							setPictures((state) => [...state, { src, to: navigate, url }])
						}
					}
				}
				
			}
		}
	}, [content, pictures])

	return (
		<Carousel controls={controls} indicators id="pigments-banner-carousel">
			{pictures.map(({ src, to, url }, index) => (
				<Carousel.Item key={`prigments-banner-carousel__${index}`}>
					<BImage src={src} alt="drobot-pigments-banner" fluid onClick={() => handler(to, url)} style={{ cursor: "pointer" }} />
				</Carousel.Item>
			))}
		</Carousel>
	)
}

export default Banners
