import { useEffect, useState } from "react"
import { Button, Container, Pagination, Spinner, Table } from "react-bootstrap"
import { useParams } from "react-router-dom"
import { useGetPromocodeDetailsQuery } from "../../application/profile.service"
import { IPromocodeDetails } from '../../../shared/index'
import { useNavigate } from 'react-router-dom'

const limit = 20

const PromocodePage = () => {
    const { id = '' } = useParams()
    const { data, isLoading } = useGetPromocodeDetailsQuery({ id })
    const [state, setState] = useState<IPromocodeDetails['orders'][0][]>([])
    const [page, setPage] = useState(1)
	const navigate = useNavigate()

    useEffect(() => {
        if ( data ) {
            setState(data.orders)
        }
    }, [data])

	useEffect(() => {
		document.title = 'Промокод'
	}, [])

    return (
		<Container className="mb-6">
			<Button variant="link" className="text-muted mb-4" onClick={() => navigate(-1)}>
				&larr; назад
			</Button>
			{isLoading && (
				<div className="text-center p-3">
					<Spinner animation="border" variant="secondary" />
				</div>
			)}
			<div className="fs-3 mb-5">{data?.code}</div>
			{data?.orders.length === 0 && <div className="text-muted">По этому промокоду еще ничего не купили</div>}
			{state.length > 0 && <Table className="w-lg-50 mb-3" responsive>
				<thead>
					<tr className="align-middle">
						<th>Покупатель</th>
						<th>Сумма заказа</th>
						<th>Кэшбэк</th>
					</tr>
				</thead>
				<tbody>
					{state.slice((page - 1) * limit, Math.min(page * limit, state.length)).map(({ buyer, orderCashBack, orderTotal }, index) => (
						<tr key={`${index}_order`} className="align-middle">
							<td>{buyer}</td>
							<td>{orderTotal}</td>
							<td className="fw-bold">{orderCashBack}</td>
						</tr>
					))}
				</tbody>
			</Table>}
			{state.length > 20 && <div className="w-lg-75 text-center">
				<Pagination>
					<Pagination.First />
					<Pagination.Prev />
					<Pagination.Item>{1}</Pagination.Item>
					<Pagination.Ellipsis />

					<Pagination.Item>{10}</Pagination.Item>
					<Pagination.Item>{11}</Pagination.Item>
					<Pagination.Item active>{12}</Pagination.Item>
					<Pagination.Item>{13}</Pagination.Item>
					<Pagination.Item disabled>{14}</Pagination.Item>

					<Pagination.Ellipsis />
					<Pagination.Item>{20}</Pagination.Item>
					<Pagination.Next />
					<Pagination.Last />
				</Pagination>
			</div>}
		</Container>
	)
}

export default PromocodePage