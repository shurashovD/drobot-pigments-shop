import { FC } from "react"
import { Carousel, CarouselProps } from "react-bootstrap"
import { useGetProductsQuery } from "../../../../application/compare.service"
import { useAppSelector } from "../../../../application/hooks"
import Item from "./Item"

interface IProps extends CarouselProps {
    prefix: string
}

const Feed: FC<IProps> = ({ activeIndex, onSelect, prefix }) => {
    const { categoryId } = useAppSelector(state => state.compareSlice)
    const { data } = useGetProductsQuery({ categoryId: categoryId || '' }, { skip: !categoryId, refetchOnMountOrArgChange: true })

    return (
		<div className="h-100">
			<Carousel activeIndex={activeIndex} onSelect={onSelect} controls={false} interval={null} className="compare-carousel">
				{data?.goods.map((item) => (
					<Carousel.Item key={`${prefix}${item.variantId || item.id}`} className="h-100">
						<Item product={item} />
					</Carousel.Item>
				))}
			</Carousel>
            {data && data.goods.length > 0 && (
                <div className="text-muted text-center">
                    {(activeIndex || 0) + 1} из {data.goods.length}
                </div>
            )}
		</div>
	)
}

export default Feed