import classNames from "classnames"
import { UIEventHandler, useEffect, useRef, useState } from "react"
import { Button, Col, Row } from "react-bootstrap"
import { Product } from "../../../../shared"
import { useGetProductsQuery } from "../../../application/compare.service"
import { setScrollLeft } from "../../../application/compareSlice"
import { useAppDispatch, useAppSelector } from "../../../application/hooks"
import Item from "./Item"

const Feed = () => {
    const { categoryId } = useAppSelector(state => state.compareSlice)
    const { data } = useGetProductsQuery({ categoryId: categoryId || '' }, { skip: !categoryId, refetchOnMountOrArgChange: true })
    const [state, setState] = useState<Product[]>([])
    const [showPrev, setShowPrev] = useState(false)
    const [showNext, setShowNext] = useState(false)
    const container = useRef<HTMLDivElement|null>(null)
    const dispatch = useAppDispatch()

    const nextHandler = () => {
        if ( container.current ) {
            const col = container.current.querySelector<HTMLDivElement>(".compare-feed-item")
            if (col?.offsetWidth) {
                container.current.scrollBy({ left: col.offsetWidth, behavior: 'smooth' })
            }
        }
    }

    const prevHandler = () => {
		if (container.current) {
			const col = container.current.querySelector<HTMLDivElement>(".compare-feed-item")
			if (col?.offsetWidth) {
				container.current.scrollBy({ left: -col.offsetWidth, behavior: "smooth" })
			}
		}
	}

    const scrollHander: UIEventHandler<HTMLDivElement> = (event) => {
        const { offsetWidth, scrollLeft, scrollWidth } = event.currentTarget
        setShowPrev(scrollLeft > 0)
        setShowNext(scrollWidth > offsetWidth + scrollLeft)
        dispatch(setScrollLeft(scrollLeft))
    }

    useEffect(() => {
        if ( data ) {
            setState(data.goods)
        }
        if ( !categoryId ) {
            setState([])
        }
    }, [categoryId, data])

    useEffect(() => {
        if ( container.current ) {
            setShowNext(container.current.offsetWidth < container.current.scrollWidth)
        }
    }, [container, state])

    return (
		<div className="d-flex align-items-center">
			<Button variant="link" className={classNames("carousel-btn carousel-prev-btn", { invisible: !showPrev })} onClick={prevHandler} />
			<Row className="overflow-scroll flex-nowrap no-scrollbar w-100" ref={container} onScroll={scrollHander}>
				{state.map((item) => (
					<Col xs={11} lg={4} xl={3} key={item.variantId || item.id} className="compare-feed-item">
						<Item product={item} />
					</Col>
				))}
			</Row>
			<Button variant="link" className={classNames("carousel-btn", { invisible: !showNext })} onClick={nextHandler} />
		</div>
	)
}

export default Feed