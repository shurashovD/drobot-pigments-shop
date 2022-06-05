import { FC, useEffect, useState } from 'react'
import IconStar from '../icons/IconStar'

interface IProps {
    className?: string 
    raiting?: number
    reviewsCount?: number
}

const Raiting: FC<IProps> = ({ className = "", raiting, reviewsCount = 0 }) => {
    const [title, setTitle] = useState<'отзыв' | 'отзыва' | 'отзывов'>('отзыв')

    useEffect(() => {
        const lastSymbol = parseInt(reviewsCount.toString()[reviewsCount.toString().length - 1])
        if ( lastSymbol > 4 || lastSymbol === 0 ) {
            setTitle('отзывов')
        }
        else {
            if ( lastSymbol === 1 ) {
                setTitle("отзыв")
            }
            else {
                setTitle('отзыва')
            }
        }
    }, [reviewsCount])

	return (
		<div className={`d-flex align-items-center ${className}`}>
			<IconStar stroke={raiting ? "#FEE17A" : "#9E9E9E"} />
			<span className="ms-1 me-2">{raiting?.toFixed(1)}</span>
			<span className="text-muted">
                {reviewsCount === 0 ? <>Нет</> : reviewsCount.toString()} {title} 
            </span>
		</div>
	)
}

export default Raiting