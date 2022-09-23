import { ChangeEvent, FC, useEffect, useRef, useState } from "react"
import { Col, Dropdown, Form, Row, Spinner } from "react-bootstrap"
import { useAppDispatch } from "../../../application/hooks"
import { useGetRelevantCitiesQuery, useSetDeliveryCityMutation } from "../../../application/order.service"
import { setActive } from "../../../application/orderSlice"
import ButtonComponent from "../../../components/ButtonComponent"
import DropdownCityItem from "./DropdownCityItem"

interface IProps {
	city?: string
	code?: number
}

const Region: FC<IProps> = ({ city, code }) => {
	const [value, setValue] = useState(city || "")
	const [relevantString, setRelevantString] = useState("")
	const [dropdownShow, setDropdownShow] = useState(false)
	const [cityCode, setCityCode] = useState<number | undefined>()
	const [setDeliveryCity, { isLoading, isSuccess }] = useSetDeliveryCityMutation()
	const { data: cities, isFetching: citiesLoading } = useGetRelevantCitiesQuery(relevantString, { refetchOnMountOrArgChange: true })
	const timerId = useRef<ReturnType<typeof setTimeout> | undefined>()
	const dispatch = useAppDispatch()

	const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value)
		setCityCode(undefined)
	}

	const dropdownHandler = (cityCode: number) => {
		if (cities) {
			const city = cities.find(({ city_code }) => city_code === cityCode)?.city
			if (city) {
				setValue(city)
				setCityCode(cityCode)
				setDropdownShow(false)
			}
		}
	}

	const toggleHandler = (event: boolean) => {
		setDropdownShow(event)
	}

	const nextHandler = () => {
		if ( cityCode ) {
			if (cityCode === code) {
				setDeliveryCity({ city_code: cityCode })
				setDropdownShow(false)
			}
		} else {
			dispatch(setActive("2"))
		}
	}

	useEffect(() => {
		if (!cityCode && value.length > 0) {
			if (timerId.current) {
				clearTimeout(timerId.current)
			}
			timerId.current = setTimeout(() => {
				setRelevantString(value)
				setDropdownShow(true)
			}, 400)
		}
	}, [value, cityCode])

	useEffect(() => {
		if (city && code) {
			setCityCode(code)
			setValue(city)
		}
	}, [city, code])

	useEffect(() => {
		if ( isSuccess ) {
			dispatch(setActive("2"))
		}
	}, [dispatch, isSuccess, setActive])

	useEffect(() => {
		if ( code ) {
			setCityCode(code)
		}
	}, [code])

	return (
		<div>
			<span>Город доставки*</span>
			<Row>
				<Col xs={12} md={8} lg={6}>
					<Form.Control className="h-100 py-md-0" value={value} onChange={inputHandler} disabled={isLoading} />
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
					<div className="d-lg-none text-muted mt-2 mb-3">Выберите свой город в списке.</div>
					<div className="d-flex">
						<ButtonComponent disabled={city === value ? false : !cityCode} onClick={nextHandler} isLoading={isLoading}>
							{city === value ? <>Далее</> : <>Выбрать</>}
						</ButtonComponent>
					</div>
				</Col>
				<Col xs={12} md={8}>
					<div className="d-none d-lg-block text-muted my-1">Выберите свой город в списке.</div>
				</Col>
			</Row>
		</div>
	)
}

export default Region