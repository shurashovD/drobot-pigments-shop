import { useEffect } from "react"
import { Container } from "react-bootstrap"
import { Navigate, Route, Routes } from "react-router-dom"
import { useAppDispatch } from "./application/hooks"
import { useGetOrdersQuery } from "./application/order.service"
import { setOrders } from "./application/ordersSlice"
import AlertComponent from "./components/AlertComponent"
import HeaderComponent from "./components/HeaderComponent"
import AmoPage from "./pages/amoPage/AmoPage"
import CategoryPage from "./pages/categoryPage/CategoryPage"
import CategoryProductPage from "./pages/categoryPage/CategoryProductPage/CategoryProductPage"
import HooksPage from "./pages/hooksPage/HooksPage"
import LoyaltyPage from "./pages/loyaltyPage/LoyaltyPage"
import MoySkladPage from "./pages/moySkladPage/MoySkladPage"
import OrderPage from "./pages/ordersPage/OrderPage"
import OrdersPage from "./pages/ordersPage/OrdersPage"
import ProductsPage from "./pages/productsPage/ProductsPage"
import UsersPage from "./pages/usersPage/UsersPage"

const App = () => {
	const { data, isSuccess } = useGetOrdersQuery({}, { refetchOnMountOrArgChange: true, pollingInterval: 10000 })
	const dispatch = useAppDispatch()

	useEffect(() => {
		if ( data && isSuccess ) {
			dispatch(setOrders(data))
		}
	}, [data, isSuccess])

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
					<Route path="/admin/products/product/:id" element={<CategoryProductPage />} />
					<Route path="/admin/orders" element={<OrdersPage />} />
					<Route path="/admin/orders/:id" element={<OrderPage />} />
					<Route path="/admin/hooks" element={<HooksPage />} />
					<Route path="/admin/amo" element={<AmoPage />} />
					<Route path="/admin/users" element={<UsersPage />} />
					<Route path="/admin/loyalty" element={<LoyaltyPage />} />
					<Route path="*" element={<Navigate to="/admin/moy-sklad" />} />
				</Routes>
			</Container>
		</Container>
	)
}

export default App