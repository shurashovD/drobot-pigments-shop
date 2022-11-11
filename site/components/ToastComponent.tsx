import classNames from "classnames"
import { useEffect, useRef, useState } from "react"
import { Alert } from "react-bootstrap"
import { NavLink } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../application/hooks"
import { clearToast } from "../application/toastSlice"

const ToastComponent = () => {
    const [head, setHaed] = useState('')
    const [variant, setVariant] = useState<"success"|"secondary">("success")
    const toast = useAppSelector(state => state.toastSlice)
    const timerId = useRef<ReturnType<typeof setTimeout>>()
    const dispatch = useAppDispatch()

    useEffect(() => {
		if (toast) {
            if ( timerId.current ) {
                clearTimeout(timerId.current)
            }
            if ( toast.type === 'cart' ) {
                setHaed("Добавлено в корзину!")
                setVariant("success")
            }
            if (toast.type === "compare") {
				setHaed("Добавлено к сравнению!")
                setVariant("secondary")
			}
            if (toast.type === "favourites") {
				setHaed("Добавлено в избранное!")
                setVariant("secondary")
			}
            timerId.current = setTimeout(() => {
				dispatch(clearToast())
                timerId.current = undefined
			}, 1800)
		}
	}, [dispatch, clearToast, toast])

    return (
		<div className="position-fixed bottom-0 end-0 p-1 pb-4 alert-container">
			<Alert
                show={!!toast?.type}
                variant={variant}
                className={classNames("bg-opacity-1", { "bg-secondary": variant === "secondary" })}
            >
				<Alert.Heading className="text-uppercase fs-6 pb-0 mb-0">{head}</Alert.Heading>
				{toast?.type === "cart" && (
					<div className="mt-2">
						Продолжайте совершать покупки или <NavLink to="/cart">перейдите в корзину</NavLink> для оформления заказа.
					</div>
				)}
			</Alert>
		</div>
	)
}

export default ToastComponent