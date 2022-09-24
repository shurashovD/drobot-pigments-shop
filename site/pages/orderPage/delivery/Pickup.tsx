import classNames from "classnames"
import { Button } from "react-bootstrap"
import { useGetDeliveryDetailQuery, useSetDeliveryDetailMutation } from "../../../application/order.service"

const Pickup = () => {
    const { data } = useGetDeliveryDetailQuery(undefined)
    const [setDetail, { isLoading }] = useSetDeliveryDetailMutation()

    return (
		<Button
			variant="link"
			className={classNames("border px-4 py-3 h-100 w-100 d-flex flex-column justify-content-between", { "border-secondary": data?.pickup })}
			onClick={() => setDetail({ pickup: true, sdek: false })}
			disabled={isLoading}
		>
			<div>Самовывоз из магазина</div>
			<div className="text-muted my-3">ул. Дзержинского 87/1</div>
            <div>Бесплатно</div>
		</Button>
	)
}

export default Pickup