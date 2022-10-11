import { useEffect, useState } from "react"
import { Carousel, Image as BImage } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

const Imgs = [
	{ lg: "/static/pigments/banner/1.jpg", sm: "/static/pigments/banner/m/1.jpg", to: true, url: "/coloristic" },
	{ lg: "/static/pigments/banner/2.jpg", sm: "/static/pigments/banner/m/2.jpg", to: true, url: "/" },
	{ lg: "/static/pigments/banner/3.jpg", sm: "/static/pigments/banner/m/3.jpg", to: false, url: "http://t.me/drobot_pigments" },
	{ lg: "/static/pigments/banner/4.jpg", sm: "/static/pigments/banner/m/4.jpg", to: true, url: "/" },
	{ lg: "/static/pigments/banner/5.jpg", sm: "/static/pigments/banner/m/5.jpg", to: true, url: "/" },
	{ lg: "/static/pigments/banner/6.jpg", sm: "/static/pigments/banner/m/6.jpg", to: true, url: "/" },
	{
		lg: "/static/pigments/banner/7.jpg",
		sm: "/static/pigments/banner/m/7.jpg",
		to: false,
		url: "https://www.youtube.com/channel/UCZv-qFu8fT3BU5WvjNbJnYA",
	},
]

const Banners = () => {
    const [pictures, setPictures] = useState<{src: string, to: boolean, url: string}[]>([])
    const [controls, setControls] = useState(false)
    const navigate = useNavigate()

    const handler = (url: string, to: boolean) => {
        if ( to ) {
            navigate(url)
        } else {
            window.open(url, "_blank")
        }
    }

    useEffect(() => {
        if ( pictures.length < Imgs.length ) {
            const carousel = document.getElementById("pigments-banner-carousel")
            if ( carousel ) {
                const width = carousel.offsetWidth
                setControls(width > 576)
                const { lg, sm, to, url } = Imgs[pictures.length]
				const img = new Image()
				img.src = width > 576 ? lg : sm
				img.onload = function () {
					setPictures((state) => [...state, { src: img.src, to, url }])
				}
            }
        }
    }, [Imgs, pictures])

	return (
		<Carousel controls={controls} indicators id="pigments-banner-carousel">
			{pictures.map(({ src, to, url }, index) => (
				<Carousel.Item key={`prigments-banner-carousel__${index}`}>
					<BImage src={src} alt="drobot-pigments-banner" fluid onClick={() => handler(url, to)} style={{ cursor: 'pointer' }} />
				</Carousel.Item>
			))}
		</Carousel>
	)
}

export default Banners
