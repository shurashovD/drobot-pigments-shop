import { Tab, Tabs } from "react-bootstrap"
import MsHooks from "./moySklad/MsHooks"
import SdekHooks from "./sdek/SdekHooks"

const HooksPage = () => {
    return (
		<Tabs defaultActiveKey="ms">
			<Tab eventKey="ms" title="Мой склад">
                <MsHooks />
            </Tab>
			<Tab eventKey="sdek" title="СДЭК">
                <SdekHooks />
            </Tab>
		</Tabs>
	)
}

export default HooksPage