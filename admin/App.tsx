import { useEffect } from "react"
import { Container } from "react-bootstrap"
import { Navigate, Route, Routes } from "react-router-dom"
import { useAppDispatch } from "./application/hooks"
import { useGetOrdersQuery } from "./application/order.service"
import { setOrders } from "./application/ordersSlice"
import AlertComponent from "./components/AlertComponent"
import HeaderComponent from "./components/HeaderComponent"
import AmoPage from "./pages/amoPage/AmoPage"
import CashbackPage from "./pages/cashbackPage/CashbackPage"
import CategoryPage from "./pages/categoryPage/CategoryPage"
import ClientPage from "./pages/clientPage/ClientPage"
import DebitesPage from "./pages/debitesPage/DebitesPage"
import HooksPage from "./pages/hooksPage/HooksPage"
import LoyaltyPage from "./pages/loyaltyPage/LoyaltyPage"
import MoySkladPage from "./pages/moySkladPage/MoySkladPage"
import OrderPage from "./pages/ordersPage/OrderPage"
import OrdersPage from "./pages/ordersPage/OrdersPage"
import ProductPage from "./pages/productPage/ProductPage"
import PromocodePage from "./pages/promocodePage/PromocodePage"
import UsersPage from "./pages/usersPage/UsersPage"
import SiteCatalogPage from "./pages/siteCatalogPage/SiteCatalogPage"

const App = () => {
	const { data, isSuccess } = useGetOrdersQuery({}, { refetchOnMountOrArgChange: true })
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
					<Route path="/admin/categories" element={<SiteCatalogPage />} />
					<Route path="/admin/category-subcategories/:id" element={<SiteCatalogPage />} />
					<Route path="/admin/category-products/:id" element={<CategoryPage />} />
					<Route path="/admin/product/:id" element={<ProductPage />} />
					<Route path="/admin/orders" element={<OrdersPage />} />
					<Route path="/admin/orders/:id" element={<OrderPage />} />
					<Route path="/admin/hooks" element={<HooksPage />} />
					<Route path="/admin/amo" element={<AmoPage />} />
					<Route path="/admin/users" element={<UsersPage />} />
					<Route path="/admin/loyalty" element={<LoyaltyPage />} />
					<Route path="/admin/client/:id" element={<ClientPage />} />
					<Route path="/admin/cashback" element={<CashbackPage />} />
					<Route path="/admin/promocode/:id" element={<PromocodePage />} />
					<Route path="/admin/client/debites/:id" element={<DebitesPage />} />
					<Route path="*" element={<Navigate to="/admin/moy-sklad" />} />
				</Routes>
			</Container>
		</Container>
	)
}

export default App