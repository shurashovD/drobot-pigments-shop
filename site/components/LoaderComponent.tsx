import { FC } from 'react'
import { Collapse, Spinner } from 'react-bootstrap'

interface IProps {
    show?: boolean
}

const LoaderComponent: FC<IProps> = ({ show = true }) => {
    return (
		<Collapse in={show}>
			<div className="position-fixed top-0 bottom-0 start-0 end-0 bg-white bg-opacity-75 d-flex">
				<Spinner animation="border" variant="secondary" className="m-auto" />
			</div>
		</Collapse>
	)
}

export default LoaderComponent