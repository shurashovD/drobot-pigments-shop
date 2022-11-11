import { FC, useEffect, useRef, useState } from "react"
import { Button } from "react-bootstrap"
import { useAddToCompareListMutation, useGetCompareQuery, useRmFromCompareListMutation } from "../../application/compare.service"
import { useAppDispatch } from "../../application/hooks"
import { addCompareToast } from "../../application/toastSlice"
import IconCompare from "../icons/IconCompare"

interface IProps {
    productId: string
    variantId?: string
}

const ToCompare: FC<IProps> = ({ productId, variantId }) => {
    const { data, isFetching } = useGetCompareQuery()
    const [add, { isLoading, isSuccess, reset }] = useAddToCompareListMutation()
    const [rm, { isLoading: rmLoading }] = useRmFromCompareListMutation()
    const [stroke, setStroke] = useState<"#ab9a9a" | "#52372D">("#ab9a9a")
    const compareId = useRef<string|undefined>(undefined)
	const dispatch = useAppDispatch()

    useEffect(() => {
		if (data) {
			const good = data.find((item) => {
				const productMatch = item.productId === productId
				if (productMatch) {
					if (variantId) {
						return item.variantId === variantId
					}
					return true
				}
			})
			compareId.current = good?.id
			setStroke(!!compareId.current ? "#52372D" : "#ab9a9a")
		}
	}, [data, compareId])

	useEffect(() => {
		if ( isSuccess ) {
			dispatch(addCompareToast())
			reset()
		}
	}, [addCompareToast, dispatch, isSuccess, reset])

    return (
		<Button
			variant="link"
			disabled={isFetching || isLoading || rmLoading}
			size="sm"
			onClick={() => (!!compareId.current ? rm({ goodId: compareId.current }) : add({ productId, variantId }))}
		>
			<IconCompare stroke={stroke} />
		</Button>
	)
}

export default ToCompare