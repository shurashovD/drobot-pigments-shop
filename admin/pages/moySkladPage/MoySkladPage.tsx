import { useEffect } from "react"
import { Col, Container, ListGroup, Row } from "react-bootstrap"
import { NavLink } from "react-router-dom"
import { useParams } from "react-router-dom"
import { useGetMoySkladQuery, useSyncMoySkladMutation } from "../../application/moySklad.service"
import ButtonComponent from "../../components/ButtonComponent"
import { useAppDispatch } from '../../application/hooks'
import { errorAlert, successAlert } from "../../application/alertSlice"
import { useSyncPointsMutation } from "../../application/sdek.service"

const MoySkladPage = () => {
    const {id} = useParams()
    const { data, isLoading } = useGetMoySkladQuery(id)
	const [sync, { isLoading: syncProcess, isError, isSuccess }] = useSyncMoySkladMutation()
	const [pointsSync, {isLoading: pointsSuncProcess, isError: pointsSyncError, isSuccess: pointsSyncSuccess }] = useSyncPointsMutation()
	const dispatch = useAppDispatch()

	useEffect(() => {
		if (isError) {
			dispatch(errorAlert('Синхронизация не выполнена'))
		}
	}, [isError])
	
	useEffect(() => {
		if (isSuccess) {
			dispatch(successAlert("Синхронизация выполнена успешно"))
		}
	}, [isSuccess])

	useEffect(() => {
		if (pointsSyncError) {
			dispatch(errorAlert("Синхронизация не выполнена"))
		}
	}, [pointsSyncError])

	useEffect(() => {
		if (pointsSyncSuccess) {
			dispatch(successAlert("Синхронизация выполнена успешно"))
		}
	}, [pointsSyncSuccess])

    return (
		<Container>
			<Row className="justify-content-end">
				<Col xs={4}>
					<ButtonComponent
						variant="success"
						onClick={pointsSync}
						isLoading={pointsSuncProcess}
						disabled={isLoading}
					>
						Синхронизация со СДЭК
					</ButtonComponent>
				</Col>
				<Col xs={4}>
					<ButtonComponent
						onClick={sync}
						isLoading={syncProcess}
						disabled={isLoading}
					>
						Синхронизация с Мой склад
					</ButtonComponent>
				</Col>
			</Row>
			<h3>{(data && data.catalog?.name) || "Корневой раздел"}</h3>
			<ListGroup variant="flush">
				{data && data.catalog && (
					<ListGroup.Item className="px-1 pb-1">
						<NavLink
							to={`/admin/moy-sklad/${
								data.catalog.parent?.toString() || ""
							}`}
						>
							..
						</NavLink>
					</ListGroup.Item>
				)}
				{data &&
					data.catalogs.map((item) => (
						<ListGroup.Item
							className="px-1 pb-1"
							key={item._id.toString()}
						>
							<NavLink
								to={`/admin/moy-sklad/${item._id.toString()}`}
							>
								{item.name}
							</NavLink>
						</ListGroup.Item>
					))}
				{data &&
					data.products.map((item) => (
						<ListGroup.Item
							className="px-1 pb-1"
							key={item._id.toString()}
						>
							{item.name}
						</ListGroup.Item>
					))}
			</ListGroup>
		</Container>
	)
}

export default MoySkladPage