import { Container } from "react-bootstrap"
import { Navigate, Route, Routes } from "react-router-dom"
import AlertComponent from "./components/AlertComponent"
import FooterComponent from "./components/FooterComponent"
import HeaderComponent from "./components/HeaderComponent"
import MobileFooter from "./components/MobileFooter"
import CartPage from "./pages/cartPage/CartPage"
import CategoryPage from "./pages/categoryPage/CategoryPage"
import MainPage from "./pages/mainPage/MainPage"
import OrderPage from "./pages/orderPage/OrderPage"
import ProductPage from "./pages/productPage/ProductPage"

const App = () => {
    return (
		<Container
			fluid
			className="p-0 min-vh-100 d-flex flex-column justify-content-start align-items-stretch"
		>
			<AlertComponent />
			<HeaderComponent />
			<Container fluid className="pt-4 border">
				<Routes>
					<Route path="/" element={<MainPage />} />
					<Route path="/category/:id/:filters" element={<CategoryPage />} />
					<Route path="/product/:id" element={<ProductPage />} />
					<Route path="/cart" element={<CartPage />} />
					<Route path="/order" element={<OrderPage />} />
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