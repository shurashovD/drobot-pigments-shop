import { useEffect } from "react"
import { Container, Stack } from "react-bootstrap"
import BannerComponent from "../../components/BannerComponent"
import Header from "./header/Header"
import PigmentsLines from "./pigmentsLines/PigmentsLines"
import Variants from "./variants/Variants"

const ParetnerProgramPage = () => {
	useEffect(() => {
		document.title = 'Сотрудничество'
	}, [])

    return (
		<Container className="p-0" fluid>
			<BannerComponent folder="partnerProgram" widthToHeight={1440 / 450} mobileWidthToHeight={414 / 550} />
			<Container className="pb-6">
				<Stack gap={5}>
					<Header />
					<PigmentsLines />
					<Variants />
				</Stack>
			</Container>
		</Container>
	)
}

export default ParetnerProgramPage