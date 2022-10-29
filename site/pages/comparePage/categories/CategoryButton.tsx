import classNames from 'classnames'
import { FC } from 'react'
import { Button, Col } from 'react-bootstrap'
import { setCategory } from '../../../application/compareSlice'
import { useAppDispatch, useAppSelector } from '../../../application/hooks'

interface IProps {
    id: string
    title: string
    length: number
}

const CategoryButton: FC<IProps> = ({ id, length, title }) => {
    const active = useAppSelector(state => state.compareSlice.categoryId === id)
    const dispatch = useAppDispatch()
    
    return (
		<Col xs="auto" className={classNames("border-bottom", { "border-muted": !active }, { "border-dark": active })}>
			<Button onClick={() => dispatch(setCategory(id))} variant="link" className={classNames("p-2 text-uppercase", { "text-dark": active })}>
				{title}
				<sup className="text-muted p-1">{length}</sup>
			</Button>
		</Col>
	)
}

export default CategoryButton