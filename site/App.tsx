import { Container } from "react-bootstrap"
import { Navigate, Route, Routes } from "react-router-dom"
import AlertComponent from "./components/AlertComponent"
import FooterComponent from "./components/FooterComponent"
import HeaderComponent from "./components/HeaderComponent"
import MobileFooter from "./components/MobileFooter"
import CategoryPage from "./pages/categoryPage/CategoryPage"
import MainPage from "./pages/mainPage/MainPage"

const App = () => {
    return (
		<Container fluid className="p-0 min-vh-100 d-flex flex-column">
			<AlertComponent />
			<HeaderComponent />
			<Container fluid className="pt-4">
				<Routes>
					<Route path="/" element={<MainPage />} />
					<Route path="/category/:id" element={<CategoryPage />} />
					<Route path="*" element={<Navigate to="/" />} />
				</Routes>
			</Container>
			<div className="mt-auto">
				<FooterComponent />
			</div>
			<MobileFooter />
		</Container>
	)
}

export default App