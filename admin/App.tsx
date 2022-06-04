import { Container } from "react-bootstrap"
import { Navigate, Route, Routes } from "react-router-dom"
import AlertComponent from "./components/AlertComponent"
import HeaderComponent from "./components/HeaderComponent"
import CategoryPage from "./pages/categoryPage/CategoryPage"
import CategoryProductPage from "./pages/categoryPage/CategoryProductPage/CategoryProductPage"
import MoySkladPage from "./pages/moySkladPage/MoySkladPage"
import OrderPage from "./pages/ordersPage/OrderPage"
import OrdersPage from "./pages/ordersPage/OrdersPage"
import ProductsPage from "./pages/productsPage/ProductsPage"

const App = () => {
    return (
		<Container fluid className="p-0">
			<AlertComponent />
			<HeaderComponent />
			<Container fluid className="pt-4">
				<Routes>
					<Route path="/admin/moy-sklad" element={<MoySkladPage />} />
					<Route path="/admin/moy-sklad/:id" element={<MoySkladPage />} />
					<Route path="/admin/products" element={<ProductsPage />} />
					<Route path="/admin/products/:id" element={<CategoryPage />} />
					<Route
						path="/admin/products/product/:id"
						element={<CategoryProductPage />}
					/>
					<Route path="/admin/orders" element={<OrdersPage />} />
					<Route path="/admin/orders/:id" element={<OrderPage />} />
					<Route path="*" element={<Navigate to="/admin/moy-sklad" />} />
				</Routes>
			</Container>
		</Container>
	)
}

export default App