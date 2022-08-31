import { Container, Stack } from "react-bootstrap"
import CashBack from "./cashBack/CashBack"
import Categories from "./categories/Categories"
import Coach from "./coach/Coach"
import Delegates from "./delegates/Delegates"
import HowUse from "./howUse/HowUse"

const ParetnerProgramPage = () => {
    return (
		<Container className="pb-6">
			<Stack gap={5}>
				<Categories />
				<CashBack />
				<Delegates />
				<Coach />
				<HowUse />
			</Stack>
		</Container>
	)
}

export default ParetnerProgramPage