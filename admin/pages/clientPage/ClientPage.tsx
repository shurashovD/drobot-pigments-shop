import { Button, Container, Spinner } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"
import { useGetClientQuery } from "../../application/users.service"
import ClientInfo from "./ClientInfo"
import Promocodes from "./promocodes/Promocodes"

const ClientPage = () => {
    const { id = '' } = useParams()
    const { data, isLoading } = useGetClientQuery({ id })
    const navigate = useNavigate()

    return (
        <Container>
            <Button className="mb-4 text-muted" variant="link" onClick={() => navigate(-1)}>&larr; назад</Button>
            {isLoading && <div className="text-center p-3">
                <Spinner animation="border" />
            </div>}
            { data && <ClientInfo availableCashBack={data.cashBack || 0} name={data.name || ''} totalCashBack={data.totalCashBack || 0} clientId={id} /> }
            { data && <Promocodes clientId={id} /> }
        </Container>
    )
}

export default ClientPage