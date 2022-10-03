import { Container } from "react-bootstrap"
import Categories from "./Categories"
import Intro from "./Intro"

const MainPage = () => {
    return (
		<Container fluid className="p-0 m-0">
			<Intro />
			<Categories />
		</Container>
	)
}

export default MainPage