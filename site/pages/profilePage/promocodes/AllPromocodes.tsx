import { FC, useState } from "react"
import { Accordion, Container, Spinner } from "react-bootstrap"
import { useAppSelector } from "../../../application/hooks"
import { useGetPromocodesQuery } from "../../../application/profile.service"
import ButtonComponent from "../../../components/ButtonComponent"
import PromocodeItem from "./PromocodeItem"

const limit = 12

const AllPromocodes = () => {
    const [page, setPage] = useState(1)
    const { data, isFetching, isLoading } = useGetPromocodesQuery({ limit, page })
	const { lastPromocodeName } = useAppSelector(state => state.profilePromocodesSlice)

    const nextPage = () => {
        if ( data && data.length > page * limit ) {
            setPage(page => page + 1)
        }
    }

    return (
		<Container fluid className="m-0 p-0">
			{!data && isLoading && (
				<div className="text-center p-3">
					<Spinner variant="secondary" animation="border" />
				</div>
			)}
			{data && (
				<Accordion flush className="promocodes-accordion">
					{data.promocodes.map((item) => (
						<PromocodeItem
							promocode={item}
							key={item.id}
							created={lastPromocodeName === item.code}
						/>
					))}
				</Accordion>
			)}
			<div className="text-center p-3">
				{data && data.length > page * limit && (
					<ButtonComponent isLoading={isFetching} onClick={nextPage}>
						Ещё
					</ButtonComponent>
				)}
			</div>
		</Container>
	)
}

export default AllPromocodes