import { ErrorBoundary } from 'react-error-boundary'
import { Container } from "react-bootstrap"
import { Navigate, Route, Routes } from "react-router-dom"
import AlertComponent from "./components/AlertComponent"
import AuthComponent from "./components/AuthComponent"
import ErrorFallback from "./components/ErrorFallback"
import FooterComponent from "./components/FooterComponent"
import HeaderComponent from "./components/HeaderComponent"
import MobileFooter from "./components/MobileFooter"
import CartPage from "./pages/cartPage/CartPage"
import CategoryPage from "./pages/categoryPage/CategoryPage"
import DeliveryPage from "./pages/deliveryPage/DeliveryPage"
import MainPage from "./pages/mainPage/MainPage"
import OrderPage from "./pages/orderPage/OrderPage"
import ProductPage from "./pages/productPage/ProductPage"
import ProfilePage from "./pages/profilePage/ProfilePage"
import { useSendErrorMutation } from './application/error.service'
import ParetnerProgramPage from './pages/partnerProgramPage/ParetnerProgramPage'
import ContactsPage from './pages/contactsPage/ContactsPage'
import AboutPage from './pages/aboutPage/AboutPage'
import UserAgreementPage from './pages/userAgreementPage/UserAgreementPage'
import PrivacyPolicyPage from './pages/privacyPolicyPage/PrivacyPolicyPage'
import CookiesPage from './pages/cookiesPage/CookiesPage'
import GaranteesAndRefund from './pages/garanteesAndRefund/GaranteesAndRefund'
import CookiesComponent from './components/CookiesComponent'
import { useAccountAuthQuery } from './application/account.service'
import PromocodePage from './pages/promocodePage/PromocodePage'

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
				<Container fluid className="m-0 p-0">
					<Routes>
						<Route path="/" element={<MainPage />} />
						<Route path="/category/:id/:filters" element={<CategoryPage />} />
						<Route path="/product/:id" element={<ProductPage />} />
						<Route path="/cart" element={<CartPage />} />
						<Route path="/order" element={<OrderPage />} />
						<Route path="/profile" element={<ProfilePage />} />
						<Route path="/delivery" element={<DeliveryPage />} />
						<Route path="/partner-program" element={<ParetnerProgramPage />} />
						<Route path="/contacts" element={<ContactsPage />} />
						<Route path="/about" element={<AboutPage />} />
						<Route path="/user-agreement" element={<UserAgreementPage />} />
						<Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
						<Route path="/cookies" element={<CookiesPage />} />
						<Route path="/garantees" element={<GaranteesAndRefund />} />
						<Route path="/promocode/:id" element={<PromocodePage />} />
						{auth?.status === "agent" || (auth?.status === "delegate" && <Route path="/promocode/:id" element={<PromocodePage />} />)}
						<Route path="*" element={<Navigate to="/" />} />
					</Routes>
				</Container>
				<div className="mt-auto">
					<FooterComponent />
				</div>
				<MobileFooter />
			</Container>
		</ErrorBoundary>
	)
}

export default App