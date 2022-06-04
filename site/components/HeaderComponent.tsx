import { useEffect, useRef, useState } from "react"
import { Button, Col, Collapse, Container, Dropdown, Image, Nav, Navbar, Offcanvas, Row, Stack } from "react-bootstrap"
import { NavLink } from "react-router-dom"
import { useLocation, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../application/hooks"
import { hideCatalog, hideNavCatalog, showCatalog, showNavCatalog } from "../application/navCatalogSlice"
import IconAccount from "./icons/IconAccount"
import IconBox from "./icons/IconBox"
import IconCart from "./icons/IconCart"
import IconCompare from "./icons/IconCompare"
import IconFavourite from "./icons/IconFavourite"
import NavCatalog from "./NavCatalog"
import NavCatalogBtn from "./NavCatalogBtn"
import IconMenu from './icons/IconMenu'
import { useGetCategoriesQuery } from "../application/category.service"
import { setCategories } from "../application/categoriesSlice"
import NavCatalogMobile from "./NavCatalogMobile"
const waLogo = require('../img/whatsup.svg')
const logo = require('../img/logo.png')

const HeaderComponent = () => {
    const { pathname } = useLocation()
	const { show } = useAppSelector(state => state.navCatalogSlice)
	const [mobileMenuShow, setMobileMenuShow] = useState(false)
	const [mobileCatalogShow, setMobileCatalogShow] = useState(false)
	const [scrollingTop, setScrollingTop] = useState(true)
	const dispatch = useAppDispatch()
	const logoRef = useRef<HTMLImageElement | null>(null)
	const { data: categories, isSuccess } = useGetCategoriesQuery(undefined)

	const handleClose = () => {
		setMobileMenuShow(false)
	}

	const toggleCatalogHandler = () => {
		if ( show ) {
			dispatch(hideNavCatalog())
		}
		else {
			dispatch(showNavCatalog())
		}
	}

	useEffect(() => {
		if ( isSuccess && categories ) {
			dispatch(setCategories(categories))
		}
	}, [categories, isSuccess])

	useEffect(() => {
		const handler = () => {
			let increaseCondition = !!logoRef.current && window.pageYOffset === 0

			let decreaseCondition = !!logoRef.current && window.pageYOffset > 100
			if (increaseCondition) {
				setScrollingTop(true)
				logoRef.current?.classList.add("header-logo-increase")
				logoRef.current?.classList.remove("header-logo-decrease")
				return
			}

			if (decreaseCondition) {
				setScrollingTop(false)
				logoRef.current?.classList.add("header-logo-decrease")
				logoRef.current?.classList.remove("header-logo-increase")
				return
			}
		}

		window.addEventListener('scroll', handler)
		return () => {
			window.removeEventListener('scroll', handler)
		}
	}, [logoRef])

    return (
		<Container fluid className="p-0 sticky-top">
			<NavCatalogMobile
				show={mobileCatalogShow}
				onHide={() => setMobileCatalogShow(false)}
			/>
			<Offcanvas
				show={mobileMenuShow}
				onHide={handleClose}
				className="bg-dark"
			>
				<Offcanvas.Header closeButton closeVariant="white">
					<Offcanvas.Title />
				</Offcanvas.Header>
				<Offcanvas.Body className="pb-6 px-5">
					<Stack gap={4} className="h-100">
						<div>
							<Button
								variant="link"
								className="text-uppercase text-white m-0 p-0"
								onClick={() => setMobileCatalogShow(true)}
							>
								Каталог
							</Button>
						</div>
						<div>
							<NavLink
								to="/"
								className="text-uppercase text-white"
							>
								Обучение
							</NavLink>
						</div>
						<div>
							<NavLink
								to="/"
								className="text-uppercase text-white"
							>
								Спец.предложение %
							</NavLink>
						</div>
						<div>
							<NavLink
								to="/"
								className="text-uppercase text-white"
							>
								Сотрудничество
							</NavLink>
						</div>
						<div className="mt-auto">
							<NavLink
								to="/"
								className="text-uppercase text-white"
							>
								Доставка и оплата
							</NavLink>
						</div>
						<div>
							<NavLink
								to="/"
								className="text-uppercase text-white"
							>
								Статус заказа
							</NavLink>
						</div>
						<div>
							<NavLink
								to="/"
								className="text-uppercase text-white"
							>
								Контакты
							</NavLink>
						</div>
					</Stack>
				</Offcanvas.Body>
			</Offcanvas>
			<Collapse in={scrollingTop}>
				<div>
					<p className="bg-dark text-center text-white m-0 p-1"></p>
					<div className="d-none d-lg-block bg-light p-2">
						<Container>
							<Row>
								<Col
									xs={3}
									lg={2}
									className="d-flex flex-column justify-content-center"
								>
									<a
										href="tel:+79002020000"
										className="text-dark"
									>
										+7(900)202-00-00
									</a>
								</Col>
								<Col
									xs={3}
									lg={3}
									className="d-flex flex-column justify-content-center"
								>
									<a
										href="#"
										className="w-100 d-flex align-items-center text-dark"
									>
										<Image
											src={waLogo}
											width="24"
											className="me-2"
										/>
										<span>Напиcать в WhatsApp</span>
									</a>
								</Col>
								<Col
									xs={6}
									lg={5}
									className="offset-lg-2 d-flex align-items-center justify-content-evenly"
								>
									<NavLink to="/" className="text-dark">
										Cотрудничество
									</NavLink>
									<NavLink to="/" className="text-dark">
										Доставка и оплата
									</NavLink>
									<NavLink to="/" className="text-dark">
										Контакты
									</NavLink>
								</Col>
							</Row>
						</Container>
					</div>
				</div>
			</Collapse>
			<Container
				fluid
				className="py-2 bg-dark position-relative"
				id="header-menu"
			>
				<Container className="p-0 my-0">
					<Row className="p-0 my-0">
						<Col
							xs={3}
							lg={5}
							className="d-flex justify-content-between align-items-center"
						>
							<Button
								variant="link"
								className="d-lg-none m-0 p-0 m-auto"
								onClick={() => setMobileMenuShow(true)}
							>
								<IconMenu stroke="#ffffff" />
							</Button>
							{categories && (
								<NavCatalogBtn
									show={show}
									onClick={toggleCatalogHandler}
								/>
							)}
							<div className="p-0 m-0">
								<a
									href="#"
									className="d-none d-lg-block text-white text-uppercase"
								>
									<span>Обучение</span>
								</a>
							</div>
							<div className="p-0 m-0">
								<a
									href="#"
									className="d-none d-lg-block text-white text-uppercase"
								>
									<span>Спец. предложение %</span>
								</a>
							</div>
						</Col>
						<Col xs={6} lg={2} className="text-center">
							<img
								src={logo}
								ref={logoRef}
								className="header-logo-increase"
							/>
						</Col>
						<Col
							xs={3}
							lg={5}
							className="d-flex align-items-center justify-content-between"
						>
							<NavLink to="/" className="text-white me-auto">
								<IconBox stroke={"#ffffff"} />
								<span className="d-none d-md-inline ms-3">
									Статус заказа
								</span>
							</NavLink>
							<NavLink
								to="/"
								className="d-none d-lg-block text-white ms-4"
							>
								<IconAccount stroke={"#ffffff"} />
							</NavLink>
							<NavLink
								to="/"
								className="d-none d-lg-block text-white ms-4"
							>
								<IconCompare stroke={"#ffffff"} />
							</NavLink>
							<NavLink
								to="/"
								className="d-none d-lg-block text-white ms-4"
							>
								<IconFavourite stroke={"#ffffff"} />
							</NavLink>
							<NavLink
								to="/"
								className="d-none d-lg-block text-white ms-4"
							>
								<IconCart stroke={"#ffffff"} />
							</NavLink>
						</Col>
					</Row>
				</Container>
			</Container>
			<Container
				fluid
				className="p-0 m-0 position-relative d-none d-lg-block"
			>
				<NavCatalog />
			</Container>
		</Container>
	)
}

export default HeaderComponent