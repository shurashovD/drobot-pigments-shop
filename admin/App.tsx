import { lazy, Suspense, useEffect } from "react"
import { Container } from "react-bootstrap"
import { Navigate, Route, Routes } from "react-router-dom"
import { useAppDispatch } from "./application/hooks"
import { useGetOrdersQuery } from "./application/order.service"
import { setOrders } from "./application/ordersSlice"
import AlertComponent from "./components/AlertComponent"
import FallbackComponent from "./components/FallbackComponent"
import HeaderComponent from "./components/HeaderComponent"
const AmoPage = lazy(() => import("./pages/amoPage/AmoPage"))
const CashbackPage = lazy(() => import("./pages/cashbackPage/CashbackPage"))
const CategoryPage = lazy(() => import("./pages/categoryPage/CategoryPage"))
const CategoryContentPage = lazy(() => import("./pages/categoryContentPage/CategoryContentPage"))
const ClientPage = lazy(() => import("./pages/clientPage/ClientPage"))
const DebitesPage = lazy(() => import("./pages/debitesPage/DebitesPage"))
const HooksPage = lazy(() => import("./pages/hooksPage/HooksPage"))
const LoyaltyPage = lazy(() => import("./pages/loyaltyPage/LoyaltyPage"))
const MoySkladPage = lazy(() => import("./pages/moySkladPage/MoySkladPage"))
const OrderPage = lazy(() => import("./pages/ordersPage/OrderPage"))
const OrdersPage = lazy(() => import("./pages/ordersPage/OrdersPage"))
const ProductPage = lazy(() => import("./pages/productPage/ProductPage"))
const SiteCatalogPage = lazy(() => import("./pages/siteCatalogPage/SiteCatalogPage"))
const PromocodePage = lazy(() => import("./pages/promocodePage/PromocodePage"))
const UsersPage = lazy(() => import("./pages/usersPage/UsersPage"))

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
					<Route
						path="/admin/moy-sklad"
						element={
							<Suspense fallback={<FallbackComponent />}>
								<MoySkladPage />
							</Suspense>
						}
					/>
					<Route path="/admin/moy-sklad/:id" element={<MoySkladPage />} />
					<Route
						path="/admin/categories"
						element={
							<Suspense fallback={<FallbackComponent />}>
								<SiteCatalogPage />
							</Suspense>
						}
					/>
					<Route
						path="/admin/category-subcategories/:id"
						element={
							<Suspense fallback={<FallbackComponent />}>
								<SiteCatalogPage />
							</Suspense>
						}
					/>
					<Route
						path="/admin/category-products/:id"
						element={
							<Suspense fallback={<FallbackComponent />}>
								<CategoryPage />
							</Suspense>
						}
					/>
					<Route
						path="/admin/category-content/:id"
						element={
							<Suspense fallback={<FallbackComponent />}>
								<CategoryContentPage />
							</Suspense>
						}
					/>
					<Route
						path="/admin/product/:id"
						element={
							<Suspense fallback={<FallbackComponent />}>
								<ProductPage />
							</Suspense>
						}
					/>
					<Route
						path="/admin/orders"
						element={
							<Suspense fallback={<FallbackComponent />}>
								<OrdersPage />
							</Suspense>
						}
					/>
					<Route
						path="/admin/orders/:id"
						element={
							<Suspense fallback={<FallbackComponent />}>
								<OrderPage />
							</Suspense>
						}
					/>
					<Route
						path="/admin/hooks"
						element={
							<Suspense fallback={<FallbackComponent />}>
								<HooksPage />
							</Suspense>
						}
					/>
					<Route
						path="/admin/amo"
						element={
							<Suspense fallback={<FallbackComponent />}>
								<AmoPage />
							</Suspense>
						}
					/>
					<Route
						path="/admin/users"
						element={
							<Suspense fallback={<FallbackComponent />}>
								<UsersPage />
							</Suspense>
						}
					/>
					<Route
						path="/admin/loyalty"
						element={
							<Suspense fallback={<FallbackComponent />}>
								<LoyaltyPage />
							</Suspense>
						}
					/>
					<Route
						path="/admin/client/:id"
						element={
							<Suspense fallback={<FallbackComponent />}>
								<ClientPage />
							</Suspense>
						}
					/>
					<Route
						path="/admin/cashback"
						element={
							<Suspense fallback={<FallbackComponent />}>
								<CashbackPage />
							</Suspense>
						}
					/>
					<Route
						path="/admin/promocode/:id"
						element={
							<Suspense fallback={<FallbackComponent />}>
								<PromocodePage />
							</Suspense>
						}
					/>
					<Route
						path="/admin/client/debites/:id"
						element={
							<Suspense fallback={<FallbackComponent />}>
								<DebitesPage />
							</Suspense>
						}
					/>
					<Route path="*" element={<Navigate to="/admin/moy-sklad" />} />
				</Routes>
			</Container>
		</Container>
	)
}

export default App