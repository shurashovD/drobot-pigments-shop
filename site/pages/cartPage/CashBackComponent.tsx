import { Form } from "react-bootstrap"
import { useGetCartQuery, useToggleUseCahbackMutation } from "../../application/order.service"

const CashBackComponent = () => {
    const { data: cart, isFetching } = useGetCartQuery(undefined)
    const [toggle, { isLoading }] = useToggleUseCahbackMutation()
    const formatter = new Intl.NumberFormat('ru', { style: 'decimal' })

    return (
		<div className="d-flex align-items-center ps-4">
			<Form.Check
                disabled={isFetching || isLoading}
                checked={cart?.useCashBack || false}
                onChange={() => toggle()}
                label="Списать кэшбэк"
            />
            <span className="text-dark ps-2">{formatter.format(cart?.availableCashBack || 0)} Р</span>
		</div>
	)
}

export default CashBackComponent