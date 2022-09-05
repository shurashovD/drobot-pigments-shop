import { FC } from "react"
import { Dropdown } from "react-bootstrap"

interface IProps {
    city_code: number
    city: string
    handler: (city_code: number) => void
}

const DropdownCityItem: FC<IProps> = ({ city, city_code, handler }) => {
    return (
        <Dropdown.Item as="button" onClick={() => handler(city_code)}>
            {city}
        </Dropdown.Item>
    )
}

export default DropdownCityItem