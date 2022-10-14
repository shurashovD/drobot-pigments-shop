import { useEffect } from "react"
import { Container, Stack } from "react-bootstrap"
import BannerComponent from "../../components/BannerComponent"
import CashBack from "./cashBack/CashBack"
import Categories from "./categories/Categories"
import Coach from "./coach/Coach"
import Delegates from "./delegates/Delegates"
import HowUse from "./howUse/HowUse"

const ParetnerProgramPage = () => {
	useEffect(() => {
		document.title = 'Сотрудничество'
	}, [])

    return (
		<Container className="p-0" fluid>
			<BannerComponent folder="partnerProgram" widthToHeight={1440 / 450} mobileWidthToHeight={414 / 550} />
			<Container className="pb-6">
				<Stack gap={5}>
					<Categories />
					<CashBack />
					<Delegates />
					<Coach />
					<HowUse />
				</Stack>
			</Container>
		</Container>
	)
}

export default ParetnerProgramPage