import { useEffect } from "react"
import { Container } from "react-bootstrap"
import Categories from "./Categories"
import Intro from "./Intro"

const MainPage = () => {
	useEffect(() => {
		document.title = 'Drobot pigments shop'
	}, [])

    return (
		<Container fluid className="p-0 m-0">
			<Intro />
			<Categories />
		</Container>
	)
}

export default MainPage