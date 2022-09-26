import { FC, useEffect } from "react"
import { Button, Collapse } from "react-bootstrap"
import { useAppDispatch, useAppSelector } from "../../../application/hooks"
import { useGetDeliveryDetailQuery, useSetDeliveryDetailMutation } from "../../../application/order.service"
import { setActive, setCollapsedPvz } from "../../../application/orderSlice"
import ButtonComponent from "../../../components/ButtonComponent"

interface IProps {
    code: string
    name: string
}

const PvzListItem: FC<IProps> = ({ code, name }) => {
    const { data: detail } = useGetDeliveryDetailQuery(undefined)
    const [setDetail, { isLoading, isSuccess }] = useSetDeliveryDetailMutation()
    const collapsed = useAppSelector(state => state.orderSlice.collapsedPvz === code)
    const dispatch = useAppDispatch()

    const handler = () => {
        setDetail({ sdek: true, pickup: false, tariff_code: detail?.tariff_code || 138, code })
        dispatch(setActive("3"))
		dispatch(setCollapsedPvz())
    }

    useEffect(() => {
        if (isSuccess) {
			dispatch(setActive("3"))
			dispatch(setCollapsedPvz())
		}
	}, [dispatch, isSuccess, setActive, setCollapsedPvz])

    return (
		<>
			<Button
				variant="link"
				className={`m-1 p-1 text-start text-${detail?.code === code ? "dark" : "primary"}`}
				disabled={!detail?.tariff_code || isLoading}
				onClick={() => dispatch(setCollapsedPvz(collapsed ? undefined : code))}
				data-code={code}
			>
				{name}
			</Button>
			<Collapse in={collapsed}>
				<div style={{ width: 'min-content' }}>
					<ButtonComponent disabled={detail?.code === code} onClick={handler} isLoading={isLoading}>
						{detail?.code === code ? <>Выбрано</> : <>Выбрать</>}
					</ButtonComponent>
				</div>
			</Collapse>
			<hr className="opacity-75 m-0 p-0 mt-1 mb-2" />
		</>
	)
}

export default PvzListItem