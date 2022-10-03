import { useEffect, useRef, useState } from "react"
import { Button, Col, Collapse, Container, Image, Offcanvas, Row, Stack } from "react-bootstrap"
import { NavLink } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../application/hooks"
import { hideNavCatalog, showNavCatalog } from "../application/navCatalogSlice"
import IconBox from "./icons/IconBox"
import IconCompare from "./icons/IconCompare"
import IconFavourite from "./icons/IconFavourite"
import NavCatalog from "./NavCatalog"
import NavCatalogBtn from "./NavCatalogBtn"
import IconMenu from './icons/IconMenu'
import { useGetCategoriesQuery } from "../application/category.service"
import { setCategories } from "../application/categoriesSlice"
import NavCatalogMobile from "./NavCatalogMobile"
import CartIconComponent from "./CartIconComponent"
import HeaderAccountComponent from "./HeaderAccountComponent"
import classNames from "classnames"
const waLogo = require('../img/whatsup.svg')
const logo = require('../img/logo.svg')

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

	const onHide = () => {
		setMobileCatalogShow(false)
		setMobileMenuShow(false)
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

	useEffect(() => {
		window.scrollTo({
			behavior: 'smooth',
			left: 0,
			top: 0
		})
	}, [pathname])

    return (
		<Container fluid className="p-0 sticky-top">
			<NavCatalogMobile show={mobileCatalogShow} onHide={onHide} />
			<Offcanvas show={mobileMenuShow} onHide={handleClose} className="bg-dark">
				<Offcanvas.Header closeButton closeVariant="white">
					<Offcanvas.Title />
				</Offcanvas.Header>
				<Offcanvas.Body className="pb-6 px-5">
					<Stack gap={4} className="h-100">
						<div>
							<Button variant="link" className="text-uppercase text-white m-0 p-0" onClick={() => setMobileCatalogShow(true)}>
								Каталог
							</Button>
						</div>
						<div>
							<NavLink to="/partner-program" className="text-uppercase text-white" onClick={() => setMobileMenuShow(false)}>
								Сотрудничество
							</NavLink>
						</div>
						<div>
							<NavLink to="/about" className="text-uppercase text-white" onClick={() => setMobileMenuShow(false)}>
								О бренде
							</NavLink>
						</div>
						<div>
							<NavLink to="/" className="text-uppercase text-white d-none" onClick={() => setMobileMenuShow(false)}>
								Обучение
							</NavLink>
						</div>
						<div>
							<NavLink to="/" className="text-uppercase text-white d-none" onClick={() => setMobileMenuShow(false)}>
								Спец.предложение %
							</NavLink>
						</div>
						<div className="mt-auto">
							<NavLink to="/delivery" className="text-uppercase text-white" onClick={() => setMobileMenuShow(false)}>
								Доставка
							</NavLink>
						</div>
						<div>
							<NavLink to="/contacts" className="text-uppercase text-white" onClick={() => setMobileMenuShow(false)}>
								Контакты
							</NavLink>
						</div>
					</Stack>
				</Offcanvas.Body>
			</Offcanvas>
			<Collapse in={scrollingTop}>
				<div>
					<div className="d-none d-lg-block bg-light p-2">
						<Container>
							<Row>
								<Col xs={3} lg="auto" className="d-flex flex-column justify-content-center">
									<a href="tel:+79189787010">+7(918)97-87-010</a>
								</Col>
								<Col xs={3} lg={3} className="d-flex flex-column">
									<a
										href="https://wa.me/79189787010?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5!%20%F0%9F%91%8B"
										className="w-100 d-flex align-items-center"
									>
										<Image src={waLogo} width="24" className="me-2" />
										<span>Напиcать в WhatsApp</span>
									</a>
								</Col>
								<Col xs={6} className="ms-auto d-flex align-items-center justify-content-between">
									<NavLink to="/about">О бренде</NavLink>
									<NavLink to="/partner-program">Cотрудничество</NavLink>
									<NavLink to="/delivery">Доставка и оплата</NavLink>
									<NavLink to="/contacts">Контакты</NavLink>
								</Col>
							</Row>
						</Container>
					</div>
				</div>
			</Collapse>
			<Container
				fluid
				className={classNames(
					"py-2 bg-primary",
					{ "bg-transparent pt-0 position-absolute": scrollingTop && pathname === "/" }
				)}
				id="header-menu"
			>
				<Container className="p-0 my-0">
					<Row className="p-0 my-0 justify-content-start">
						<Col xs={3} lg={5} className="d-flex justify-content-between align-items-center">
							<Button variant="link" className="d-lg-none m-0 p-0 m-auto" onClick={() => setMobileMenuShow(true)}>
								<IconMenu stroke="#ffffff" />
							</Button>
							{categories && <NavCatalogBtn show={show} onClick={toggleCatalogHandler} />}
							<div className="p-0 m-0">
								<a href="#" className="d-none d-lg-block text-white text-uppercase invisible">
									<span>Обучение</span>
								</a>
							</div>
							<div className="p-0 m-0">
								<a href="#" className="d-none d-lg-block text-white text-uppercase d-none invisible">
									<span>Спец. предложение %</span>
								</a>
							</div>
						</Col>
						<Col xs={6} lg={2} className="text-center pt-1">
							<NavLink to="/">
								<Image src={logo} ref={logoRef} className="header-logo-increase" fluid />
							</NavLink>
						</Col>
						<Col xs={3} lg={5} className="d-flex align-items-center justify-content-between">
							<NavLink to="/" className="text-white me-auto invisible">
								<IconBox stroke={"#ffffff"} />
								<span className="d-none d-md-inline ms-3">Статус заказа</span>
							</NavLink>
							<div className="d-none d-lg-block text-white ms-4 position-realative">
								<HeaderAccountComponent />
							</div>
							<NavLink to="/" className="d-none d-lg-block text-white ms-4 invisible">
								<IconCompare stroke={"#ffffff"} />
							</NavLink>
							<NavLink to="/" className="d-none d-lg-block text-white ms-4 invisible">
								<IconFavourite stroke={"#ffffff"} />
							</NavLink>
							<div className="d-none d-lg-block">
								<CartIconComponent />
							</div>
						</Col>
					</Row>
				</Container>
			</Container>
			<Container fluid className="p-0 m-0 position-relative d-none d-lg-block">
				<NavCatalog />
			</Container>
		</Container>
	)
}

export default HeaderComponent