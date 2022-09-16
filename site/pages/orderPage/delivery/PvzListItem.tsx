import { FC, useEffect } from "react"
import { Button } from "react-bootstrap"
import { useAppDispatch } from "../../../application/hooks"
import { useGetDeliveryDetailQuery, useSetDeliveryDetailMutation } from "../../../application/order.service"
import { setActive } from "../../../application/orderSlice"

interface IProps {
    code: string
    name: string
}

const PvzListItem: FC<IProps> = ({ code, name }) => {
    const { data: detail } = useGetDeliveryDetailQuery(undefined)
    const [setDetail, { isLoading, isSuccess }] = useSetDeliveryDetailMutation()
    const dispatch = useAppDispatch()

    useEffect(() => {
        if ( isSuccess ) {
            dispatch(setActive("3"))
        }
    }, [dispatch, isSuccess, setActive])

    return (
        <Button
            variant="link"
            className={`m-1 p-1 text-start text-${detail?.code === code ? "dark" : "primary"}`}
            disabled={!detail?.tariff_code || isLoading}
            onClick={() => setDetail({ sdek: true, tariff_code: detail?.tariff_code || 138, code })}
            data-code={code}
        >
            {name}
        </Button>
    )
}

export default PvzListItem