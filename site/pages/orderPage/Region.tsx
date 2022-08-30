import { ChangeEvent, FC, useEffect, useRef, useState } from "react"
import { Col, Dropdown, Form, Row, Spinner } from "react-bootstrap"
import { useGetRelevantCitiesQuery, useSetDeliveryCityMutation } from "../../application/order.service"
import ButtonComponent from "../../components/ButtonComponent"
import DropdownCityItem from "./DropdownCityItem"

interface IProps {
	city?: string
	isBusy?: boolean
	readyHandler: () => void
}

const Region: FC<IProps> = ({ city, isBusy, readyHandler }) => {
	const [value, setValue] = useState(city || "")
	const [relevantString, setRelevantString] = useState("")
	const [dropdownShow, setDropdownShow] = useState(false)
	const [cityCode, setCityCode] = useState<number | undefined>()
	const [setDeliveryCity, { isLoading }] = useSetDeliveryCityMutation()
	const { data: cities, isFetching: citiesLoading } = useGetRelevantCitiesQuery(relevantString, { refetchOnMountOrArgChange: true })
	const timerId = useRef<ReturnType<typeof setTimeout> | undefined>()

	const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value)
		setCityCode(undefined)
	}

	const dropdownHandler = (cityCode: number) => {
		setCityCode(cityCode)
		setDropdownShow(false)
		if (cities) {
			const city = cities.find(({ city_code }) => city_code === cityCode)?.city
			if (city) {
				setValue(city)
			}
		}
	}

	const toggleHandler = (event: boolean) => {
		setDropdownShow(event)
	}

	const nextHandler = () => {
		if (city === value) {
			readyHandler()
		}
		if (cityCode) {
			setDeliveryCity({ city_code: cityCode })
			setDropdownShow(false)
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
		if (city) {
			setValue(city)
		}
	}, [city])

	return (
		<div>
			<span>Город доставки*</span>
			<Row className="my-2">
				<Col xs={12} md={8} lg={6}>
					<Form.Control className="h-100" value={value} onChange={inputHandler} disabled={isLoading || isBusy} />
					<Dropdown show={dropdownShow} autoClose="outside" onToggle={toggleHandler}>
						<Dropdown.Menu className="border-top-0 w-100 bg-light">
							{citiesLoading && (
								<div className="text-center">
									<Spinner animation="border" size="sm" variant="secondary" />
								</div>
							)}
							{!citiesLoading &&
								!isBusy &&
								cities?.map(({ city, city_code }) => (
									<DropdownCityItem city={city} city_code={city_code} key={city_code.toString()} handler={dropdownHandler} />
								))}
							{!citiesLoading && cities?.length === 0 && <span className="text-muted px-3">Нет подходящих вариантов</span>}
						</Dropdown.Menu>
					</Dropdown>
					<span className="d-none d-lg-block text-muted mt-1">Выберите свой город в списке.</span>
				</Col>
				<Col xs={12} md={4} lg={2}>
					<div className="d-lg-none text-muted mt-2 mb-3">Выберите свой город в списке.</div>
					<div className="d-flex d-lg-block">
						<ButtonComponent disabled={city === value ? false : !cityCode} onClick={nextHandler} isLoading={isLoading || isBusy}>
							Далее
						</ButtonComponent>
					</div>
				</Col>
			</Row>
		</div>
	)
}

export default Region