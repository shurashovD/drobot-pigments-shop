import { FC, useEffect, useState } from "react"
import { useAppDispatch } from "../../../application/hooks"
import { useGetDeliveryDetailQuery, useSetDeliveryCityMutation } from "../../../application/order.service"
import { setActive } from "../../../application/orderSlice"
import ButtonComponent from "../../../components/ButtonComponent"

interface IProps {
	cityIsChange: boolean
	inputValue: string
	city?: string
	cityCode?: number
}

const NextBtn: FC<IProps> = ({ city, inputValue, cityCode, cityIsChange }) => {
    const [disabled, setDisabled] = useState(true)
    const [btnLabel, setBtnLabel] = useState("Выбрать")
    const { data } = useGetDeliveryDetailQuery(undefined)
    const [setDeliveryCity, { isLoading, isSuccess }] = useSetDeliveryCityMutation()
    const dispatch = useAppDispatch()

    const nextHandler = () => {
        if ( data?.pickup ) {
            dispatch(setActive("3"))
        }
		if (cityCode) {
			if (cityIsChange) {
				setDeliveryCity({ city_code: cityCode })
			} else {
                dispatch(setActive("2"))
            }
		}
	}

    useEffect(() => {
		if (isSuccess) {
			dispatch(setActive("2"))
		}
	}, [dispatch, isSuccess, setActive])

    useEffect(() => {
        if ( city === inputValue ) {
            setDisabled(false)
            setBtnLabel("Далее")
        } else {
            setDisabled(!cityCode)
            setBtnLabel("Выбрать")
        }
        if ( data?.pickup ) {
            setDisabled(false)
            setBtnLabel("Далее")
        }
    }, [city, inputValue, cityCode, data])

    return (
		<ButtonComponent disabled={disabled} onClick={nextHandler} isLoading={isLoading}>
			{btnLabel}
		</ButtonComponent>
	)
}

export default NextBtn