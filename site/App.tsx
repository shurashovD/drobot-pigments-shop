import { lazy, Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { Container } from "react-bootstrap"
import { Navigate, Route, Routes } from "react-router-dom"
import { YMInitializer } from 'react-yandex-metrika'
import ErrorFallback from "./components/ErrorFallback"
import FooterComponent from "./components/FooterComponent"
import HeaderComponent from "./components/HeaderComponent"
import MobileFooter from "./components/MobileFooter"
import MainPage from "./pages/mainPage/MainPage"
import { useSendErrorMutation } from "./application/error.service"
import { useAccountAuthQuery } from "./application/account.service"
import FallbackComponent from "./components/FallbackComponent"
import ToastComponent from "./components/ToastComponent"
const PromocodePage = lazy(() => import("./pages/promocodePage/PromocodePage"))
const PigmentsPage = lazy(() => import("./pages/pigmentsPage/PigmentsPage"))
const AlertComponent = lazy(() => import("./components/AlertComponent"))
const AuthComponent = lazy(() => import("./components/authComponent/AuthComponent"))
const ColoristicPage = lazy(() => import("./pages/coloristicPage/ColoristicPage"))
const ParetnerProgramPage = lazy(() => import("./pages/partnerProgramPage/ParetnerProgramPage"))
const ContactsPage = lazy(() => import("./pages/contactsPage/ContactsPage"))
const AboutPage = lazy(() => import("./pages/aboutPage/AboutPage"))
const UserAgreementPage = lazy(() => import("./pages/userAgreementPage/UserAgreementPage"))
const PrivacyPolicyPage = lazy(() => import("./pages/privacyPolicyPage/PrivacyPolicyPage"))
const CookiesPage = lazy(() => import("./pages/cookiesPage/CookiesPage"))
const GaranteesAndRefund = lazy(() => import("./pages/garanteesAndRefund/GaranteesAndRefund"))
const CookiesComponent = lazy(() => import("./components/CookiesComponent"))
const CartPage = lazy(() => import("./pages/cartPage/CartPage"))
const CategoryPage = lazy(() => import("./pages/categoryPage/CategoryPage"))
const ParentCategoryPage = lazy(() => import("./pages/parentCategoryPage/ParentCategoryPage"))
const DeliveryPage = lazy(() => import("./pages/deliveryPage/DeliveryPage"))
const OrderPage = lazy(() => import("./pages/orderPage/OrderPage"))
const ProductPage = lazy(() => import("./pages/productPage/ProductPage"))
const ProfilePage = lazy(() => import("./pages/profilePage/ProfilePage"))
const EducationPage = lazy(() => import("./pages/educationPage/EducationPage"))
const FavouritePage = lazy(() => import("./pages/favouritePage/FavouritePage"))
const ComparePage = lazy(() => import("./pages/comparePage/ComparePage"))
const ChatComponent = lazy(() => import("./components/chatComponent/ChatComponent"))

const App = () => {
	const { data: auth } = useAccountAuthQuery(undefined)
	const [sendError] = useSendErrorMutation()

	const handler = (error: Error, info: { componentStack: string }) => {
		sendError({ error: error.message, stack: info.componentStack })
	}

	return (
		<ErrorBoundary FallbackComponent={ErrorFallback} onError={handler}>
			<Container fluid className="p-0 min-vh-100 d-flex flex-column justify-content-start align-items-stretch">
				<AlertComponent />
				<HeaderComponent />
				<AuthComponent />
				<CookiesComponent />
				<ToastComponent />
				<Container fluid className="m-0 p-0">
					<Routes>
						<Route path="/" element={<MainPage />} />
						<Route
							path="/pigments/:id"
							element={
								<Suspense fallback={<FallbackComponent />}>
									<PigmentsPage />
								</Suspense>
							}
						/>
						<Route
							path="/category/:id/:filters"
							element={
								<Suspense fallback={<FallbackComponent />}>
									<CategoryPage />
								</Suspense>
							}
						/>
						<Route
							path="/parent-category/:id/:filters"
							element={
								<Suspense fallback={<FallbackComponent />}>
									<ParentCategoryPage />
								</Suspense>
							}
						/>
						<Route
							path="/product/:id"
							element={
								<Suspense fallback={<FallbackComponent />}>
									<ProductPage />
								</Suspense>
							}
						/>
						<Route
							path="/cart"
							element={
								<Suspense fallback={<FallbackComponent />}>
									<CartPage />
								</Suspense>
							}
						/>
						<Route
							path="/order"
							element={
								<Suspense fallback={<FallbackComponent />}>
									<OrderPage />
								</Suspense>
							}
						/>
						<Route
							path="/profile"
							element={
								<Suspense fallback={<FallbackComponent />}>
									<ProfilePage />
								</Suspense>
							}
						/>
						<Route
							path="/delivery"
							element={
								<Suspense fallback={<FallbackComponent />}>
									<DeliveryPage />
								</Suspense>
							}
						/>
						<Route
							path="/partner-program"
							element={
								<Suspense fallback={<FallbackComponent />}>
									<ParetnerProgramPage />
								</Suspense>
							}
						/>
						<Route
							path="/contacts"
							element={
								<Suspense fallback={<FallbackComponent />}>
									<ContactsPage />
								</Suspense>
							}
						/>
						<Route
							path="/about"
							element={
								<Suspense fallback={<FallbackComponent />}>
									<AboutPage />
								</Suspense>
							}
						/>
						<Route
							path="/user-agreement"
							element={
								<Suspense fallback={<FallbackComponent />}>
									<UserAgreementPage />
								</Suspense>
							}
						/>
						<Route
							path="/privacy-policy"
							element={
								<Suspense fallback={<FallbackComponent />}>
									<PrivacyPolicyPage />
								</Suspense>
							}
						/>
						<Route
							path="/cookies"
							element={
								<Suspense fallback={<FallbackComponent />}>
									<CookiesPage />
								</Suspense>
							}
						/>
						<Route
							path="/garantees"
							element={
								<Suspense fallback={<FallbackComponent />}>
									<GaranteesAndRefund />
								</Suspense>
							}
						/>
						<Route
							path="/coloristic"
							element={
								<Suspense fallback={<FallbackComponent />}>
									<ColoristicPage />
								</Suspense>
							}
						/>
						<Route
							path="/education"
							element={
								<Suspense fallback={<FallbackComponent />}>
									<EducationPage />
								</Suspense>
							}
						/>
						<Route
							path="/favourite"
							element={
								<Suspense fallback={<FallbackComponent />}>
									<FavouritePage />
								</Suspense>
							}
						/>
						<Route
							path="/compare"
							element={
								<Suspense fallback={<FallbackComponent />}>
									<ComparePage />
								</Suspense>
							}
						/>
						{(auth?.status === "agent" || auth?.status === "delegate" || auth?.status === "coach") && (
							<Route
								path="/promocode/:id"
								element={
									<Suspense fallback={<FallbackComponent />}>
										<PromocodePage />
									</Suspense>
								}
							/>
						)}
						<Route path="*" element={<Navigate to="/" />} />
					</Routes>
				</Container>
				<div className="mt-auto">
					<FooterComponent />
				</div>
				<MobileFooter />
			</Container>
			<YMInitializer accounts={[96056352]} />
		</ErrorBoundary>
	)
}

export default App