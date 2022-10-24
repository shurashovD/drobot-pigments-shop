import { ChangeEvent, FC, useEffect, useRef, useState } from "react"
import { Col, Dropdown, Form, Row, Spinner } from "react-bootstrap"
import { useGetDeliveryDetailQuery, useGetRelevantCitiesQuery } from "../../../application/order.service"
import DropdownCityItem from "./DropdownCityItem"
import NextBtn from "./NextBtn"
import Pickup from "./Pickup"

interface IProps {
	city?: string
	code?: number
}

const Region: FC<IProps> = ({ city, code }) => {
	const [value, setValue] = useState(city || "")
	const [relevantString, setRelevantString] = useState("")
	const [dropdownShow, setDropdownShow] = useState(false)
	const [cityCode, setCityCode] = useState<number | undefined>()
	const { data: cities, isFetching: citiesLoading } = useGetRelevantCitiesQuery(relevantString, { refetchOnMountOrArgChange: true })
	const { data: details } = useGetDeliveryDetailQuery(undefined)
	const timerId = useRef<ReturnType<typeof setTimeout> | undefined>()

	const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value)
		setCityCode(undefined)
		if (value.length > 0) {
			if (timerId.current) {
				clearTimeout(timerId.current)
			}
			timerId.current = setTimeout(() => {
				setRelevantString(value)
				setDropdownShow(true)
			}, 400)
		}
	}

	const dropdownHandler = (cityCode: number) => {
		if (cities) {
			const city = cities.find(({ city_code }) => city_code === cityCode)?.city
			if (city) {
				setValue(city)
				setCityCode(cityCode)
			}
		}
	}

	const toggleHandler = (event: boolean) => {
		setDropdownShow(event)
	}

	useEffect(() => {
		if (city && code) {
			setCityCode(code)
			setValue(city)
		}
	}, [city, code])

	useEffect(() => {
		if ( code ) {
			setCityCode(code)
		}
	}, [code])

	useEffect(() => {
		if ( details ) {
			if ( details.pickup ) {
				setValue("Краснодар")
				setCityCode(undefined)
			} else {
				setValue("")
			}
		}
	}, [details])

	useEffect(() => {
		const handler = () => {
			setDropdownShow(false)
		}

		document.addEventListener('click', handler)

		return () => {
			document.removeEventListener('click', handler)
		}
	}, [])

	return (
		<div>
			<span>Город доставки*</span>
			<Row>
				<Col xs={12} md={8} lg={6}>
					<Form.Control className="h-100 py-md-0" value={value} onChange={inputHandler} disabled={details?.pickup} />
					<Dropdown show={dropdownShow} autoClose="outside" onToggle={toggleHandler}>
						<Dropdown.Menu className="border-top-0 w-100 bg-light">
							{citiesLoading && (
								<div className="text-center">
									<Spinner animation="border" size="sm" variant="secondary" />
								</div>
							)}
							{!citiesLoading &&
								cities?.map(({ city, city_code }) => (
									<DropdownCityItem city={city} city_code={city_code} key={city_code.toString()} handler={dropdownHandler} />
								))}
							{!citiesLoading && cities?.length === 0 && <span className="text-muted px-3">Нет подходящих вариантов</span>}
						</Dropdown.Menu>
					</Dropdown>
				</Col>
				<Col xs={12} md={4} lg={2}>
					<div className="d-md-none text-muted mt-2 mb-3">Выберите свой город в списке.</div>
					<div className="d-flex">
						<NextBtn city={city} inputValue={value} cityCode={cityCode} cityIsChange={code !== cityCode} />
					</div>
				</Col>
				<Col xs={12} md={8}>
					<div className="d-none d-md-block text-muted my-1">Выберите свой город в списке.</div>
				</Col>
				<Col xs={12} className="mt-3">
					<Pickup />
				</Col>
			</Row>
		</div>
	)
}

export default Region