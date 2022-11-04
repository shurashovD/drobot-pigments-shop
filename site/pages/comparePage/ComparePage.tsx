import classNames from "classnames"
import { UIEventHandler, useEffect } from "react"
import { Col, Container, Row } from "react-bootstrap"
import { setScrolled } from "../../application/compareSlice"
import { useAppDispatch, useAppSelector } from "../../application/hooks"
import Categories from "./categories/Categories"
import Feed from "./goods/Feed"
import Mobile from "./mobile/Mobile"
import Properties from "./properties/Properties"
import Settings from "./settings/Settings"

const ComparePage = () => {
	const { scrolled } = useAppSelector(state => state.compareSlice)
	const dispatch = useAppDispatch()

	const handler: UIEventHandler = (event) => {
		if (event.currentTarget.scrollTop > 100) {
			dispatch(setScrolled(true))
		}
		if (event.currentTarget.scrollTop === 0) {
			dispatch(setScrolled(false))
		}
	}

	useEffect(() => {
		const handler = () => {
			if (document.documentElement.scrollTop > 180) {
				dispatch(setScrolled(true))
			}
			if (document.documentElement.scrollTop < 10) {
				dispatch(setScrolled(false))
			}
		}

		window.addEventListener('scroll', handler)

		return () => {
			document.removeEventListener('scroll', handler)
		}
	}, [dispatch, setScrolled])

    return (
		<Container className="p-0 pb-6" fluid onScroll={handler}>
			<Mobile />
			<Container className="d-none d-lg-block mb-5">
				<h3>Сравнение товаров</h3>
				<Categories />
			</Container>
			<div className={classNames("d-none d-lg-block border-bottom border-top sticky-top bg-light", { "shadow-sm": scrolled })} style={{ zIndex: "1", top: "80px" }}>
				<Container>
					<Row className="py-4">
						<Col lg={3} xl={2}>
							<Settings />
						</Col>
						<Col lg={9} xl={10}>
							<Feed />
						</Col>
					</Row>
				</Container>
			</div>
			<Container className="d-none d-lg-block">
				<Properties />
			</Container>
		</Container>
	)
}

export default ComparePage