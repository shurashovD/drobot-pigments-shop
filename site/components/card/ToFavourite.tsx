import { FC, useEffect, useRef, useState } from "react"
import { Button } from "react-bootstrap"
import { useAddFavouritesMutation, useGetFavouritesQuery, useRmFavouritesMutation } from "../../application/favourite.service"
import IconFavourite from "../icons/IconFavourite"

interface IProps {
    productId: string
    variantId?: string
}

const ToFavourite: FC<IProps> = ({ productId, variantId }) => {
    const { data, isFetching } = useGetFavouritesQuery()
    const [addFavourite, { isLoading }] = useAddFavouritesMutation()
    const [rmFavourite, { isLoading: rmLoading }] = useRmFavouritesMutation()
    const [stroke, setStroke] = useState<"#000000" | "#F7DFB1">("#000000")
    const [variant, setVariant] = useState<"light"|"primary">("light")
    const inFavourite = useRef(false)

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
            setStroke(inFavourite.current ? "#F7DFB1": "#000000")
            setVariant(inFavourite.current ? "light" : "light")
        }
    }, [data, inFavourite])

    return (
        <Button
            variant={variant} disabled={isFetching || isLoading || rmLoading} size="sm"
            onClick={() => inFavourite.current ? rmFavourite({ productId, variantId }) : addFavourite({ productId, variantId })}
        >
            <IconFavourite stroke={stroke} />
        </Button>
    )
}

export default ToFavourite