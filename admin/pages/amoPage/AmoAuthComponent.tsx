import ButtonComponent from '../../components/ButtonComponent'
import { useCheckAuthQuery } from '../../application/amo.service'
import { Col, Row } from 'react-bootstrap'
import AmoAuthModal from './AmoAuthModal'
import { useState } from 'react'

const AmoAuthComponent = () => {
    const { data, isLoading } = useCheckAuthQuery(undefined, { refetchOnMountOrArgChange: true })
	const [show, setShow] = useState(false)

    return (
		<Row>
			<AmoAuthModal show={show} onHide={() => setShow(false)} />
            <Col xs={12} md={8}>{data?.message}</Col>
			<Col xs={12} md={4} lg={2}>
				<ButtonComponent
					isLoading={isLoading}
					onClick={() => setShow(true)}
				>
					Получить новый ключ
				</ButtonComponent>
			</Col>
		</Row>
	)
}

export default AmoAuthComponent