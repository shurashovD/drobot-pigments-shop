import { FC } from "react"
import { Dropdown } from "react-bootstrap"

interface IProps {
    city_code: number
    city: string
    countryCode: string
    handler: (city_code: number) => void
}

const DropdownCityItem: FC<IProps> = ({ city, city_code, countryCode, handler }) => {

    return (
		<Dropdown.Item as="button" onClick={() => handler(city_code)}>
			<span>{city}</span>
			{countryCode !== "RU" && <span className="text-muted ms-2">{countryCode}</span>}
		</Dropdown.Item>
	)
}

export default DropdownCityItem