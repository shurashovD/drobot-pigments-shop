import { Container, Spinner, Table } from "react-bootstrap"
import { useGetHooksQuery } from "../../../application/sdek.service"
import Footer from "./Footer"
import Item from "./Item"

const SdekHooks = () => {
    const { data, isLoading, isFetching } = useGetHooksQuery()

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
							<th>Сущность</th>
							<th>URL</th>
							<th>Удалить</th>
						</tr>
					</thead>
					<tbody>
						{data.map(({ type, url, uuid }) => (
							<Item key={uuid} id={uuid} entityType={type} url={url} disabled={isFetching} />
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

export default SdekHooks