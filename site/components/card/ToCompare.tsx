import { FC, useEffect, useRef, useState } from "react"
import { Button } from "react-bootstrap"
import { useAddToCompareListMutation, useGetCompareQuery, useRmFromCompareListMutation } from "../../application/compare.service"
import IconCompare from "../icons/IconCompare"

interface IProps {
    productId: string
    variantId?: string
}

const ToCompare: FC<IProps> = ({ productId, variantId }) => {
    const { data, isFetching } = useGetCompareQuery()
    const [add, { isLoading }] = useAddToCompareListMutation()
    const [rm, { isLoading: rmLoading }] = useRmFromCompareListMutation()
    const [stroke, setStroke] = useState<"#ab9a9a" | "#F7DFB1">("#ab9a9a")
    const compareId = useRef<string|undefined>(undefined)

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
			setStroke(!!compareId.current ? "#F7DFB1" : "#ab9a9a")
		}
	}, [data, compareId])

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