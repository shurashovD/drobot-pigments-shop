import { useEffect, useState } from "react"
import { Container, Table } from "react-bootstrap"
import { IClient } from "../../../shared"
import { useGetUsersQuery } from "../../application/users.service"
import ButtonComponent from "../../components/ButtonComponent"
import Item from "./Item"
import TableHaed from "./TableHead"

const limit = 24
const UsersPage = () => {
    const [state, setState] = useState<IClient[]>([])
    const [page, setPage] = useState(0)
    const [status, setStatus] = useState<"common" | "agent" | "delegate" | undefined>()
    const { data, isFetching, isSuccess } = useGetUsersQuery({ page, limit, status }, { refetchOnMountOrArgChange: true })

    const headHadnler = (key: string) => {
        if (key === "common" || key === "agent" || key === "delegate") {
			setStatus(key)
		} else {
			setStatus(undefined)
		}
    } 

    useEffect(() => {
        if ( data && isSuccess ) {
            if ( page === 0 ) {
                setState(data.clients)
            } else {
                setState(state => state.concat(
                    data.clients.filter(({ _id }) => state.some(client => client._id.toString() === _id.tosTring()))
                ))
            }
        }
    }, [data, isSuccess, page])

    return (
		<Container>
			<Table>
				<TableHaed
					disabled={isFetching}
					handler={headHadnler}
					value={status || "all"}
				/>
				<tbody>
					{state.map(
						({ _id, claimedStatus, name, mail, tel, status }) => (
							<Item
								key={_id.toString()}
								id={_id.toString()}
								isClaimed={!!claimedStatus}
								name={name || "Неизвестный пользователь"}
								mail={mail}
								phone={tel}
								status={status}
								claimedStatus={claimedStatus}
							/>
						)
					)}
				</tbody>
			</Table>
			<div className="text-center p-3">
				{(!data || data.length > state.length) && (
					<ButtonComponent
						variant="outline-primary"
						isLoading={isFetching}
						onClick={() => setPage((state) => state + 1)}
					>
						Ещё
					</ButtonComponent>
				)}
			</div>
		</Container>
	)
}

export default UsersPage