import { Container, Spinner, Table } from "react-bootstrap"
import { useGetHooksQuery } from "../../../application/moySklad.service"
import Footer from "./Footer"
import Item from "./Item"

const MsHooks = () => {
	const { data, isLoading, isFetching } = useGetHooksQuery(undefined, { refetchOnMountOrArgChange: true })

	return (
		<Container>
			{isLoading && (
				<div className="text-center p-5">
					<Spinner animation="border" variant="secondary" size="sm" />
				</div>
			)}
			{!isLoading && data && (
				<Table>
					<thead>
						<tr className="align-middle text-center">
							<th>Действие</th>
							<th>Сущность</th>
							<th>URL</th>
							<th>Статус</th>
							<th>Удалить</th>
						</tr>
					</thead>
					<tbody>
						{data.map(({ action, url, enabled, entityType, id }) => (
							<Item key={id} id={id} entityType={entityType} action={action} url={url} disabled={isFetching} enabled={enabled} />
						))}
					</tbody>
					<tfoot>
						<Footer disabled={isFetching} />
					</tfoot>
				</Table>
			)}
		</Container>
	)
}

export default MsHooks