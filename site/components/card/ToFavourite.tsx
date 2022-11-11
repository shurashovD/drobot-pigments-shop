import { FC, useEffect, useRef, useState } from "react"
import { Button } from "react-bootstrap"
import { useAddFavouritesMutation, useGetFavouritesQuery, useRmFavouritesMutation } from "../../application/favourite.service"
import { useAppDispatch } from "../../application/hooks"
import { addFavouritesToast } from "../../application/toastSlice"
import IconFavourite from "../icons/IconFavourite"

interface IProps {
    productId: string
    variantId?: string
}

const ToFavourite: FC<IProps> = ({ productId, variantId }) => {
    const { data, isFetching } = useGetFavouritesQuery()
    const [addFavourite, { isLoading, isSuccess, reset }] = useAddFavouritesMutation()
    const [rmFavourite, { isLoading: rmLoading }] = useRmFavouritesMutation()
    const [stroke, setStroke] = useState<"#52372D" | "#F7DFB1">("#52372D")
    const [backStroke, setBackStroke] = useState<"#52372D" | "#F7DFB1">("#F7DFB1")
    const inFavourite = useRef(false)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if ( data ) {
            inFavourite.current = data.goods.some(item => {
                const productMatch = item.product?._id.toString() === productId
                if ( productMatch ) {
                    if (variantId) {
						return item.variantId?.toString() === variantId
					}
                    return true
                }
            })
            setStroke(inFavourite.current ? "#F7DFB1" : "#52372D")
            setBackStroke(inFavourite.current ? "#52372D" : "#F7DFB1")
        }
    }, [data, inFavourite])

    useEffect(() => {
		if (isSuccess) {
			dispatch(addFavouritesToast())
			reset()
		}
	}, [addFavouritesToast, dispatch, isSuccess, reset])

    return (
        <Button
            variant="link" disabled={isFetching || isLoading || rmLoading} size="sm"
            onClick={() => inFavourite.current ? rmFavourite({ productId, variantId }) : addFavourite({ productId, variantId })}
        >
            <IconFavourite stroke={stroke} backStroke={backStroke} />
        </Button>
    )
}

export default ToFavourite