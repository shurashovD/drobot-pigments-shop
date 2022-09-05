import { useEffect, useRef } from "react"
import { Spinner } from "react-bootstrap"
import { useGetDeliveryDetailQuery, useGetPointsQuery } from "../../../application/order.service"
import PvzListItem from "./PvzListItem"

const PvzList = () => {
    const { data: detail } = useGetDeliveryDetailQuery(undefined)
    const { data: list, isFetching } = useGetPointsQuery(undefined)
    const container = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if ( detail?.code && container.current ) {
            const buttons = container.current.getElementsByTagName('button')
            const pvz = Array.from(buttons).find(({ dataset }) => (dataset.code === detail.code))
            if ( pvz ) {
                container.current.scrollTo({ top: pvz.offsetTop, behavior: 'smooth' })
            }
        }
    }, [container, detail])

    return (
		<div id="pvz-list" className="border p-2 position-relative" ref={container}>
			{isFetching && (
				<div className="text-center p-3">
					<Spinner animation="border" variant="secondary" />
				</div>
			)}
			<div className="d-flex flex-column">
				{!isFetching &&
					list &&
					list.map(({ code, name }) => (
						<PvzListItem key={code} code={code} name={name} />
					))}
			</div>
		</div>
	)
}

export default PvzList