import { Spinner } from "react-bootstrap"
import { useGetDiscountQuery } from "../../../application/profile.service"

const DiscountComponent = () => {
    const { data, isFetching } = useGetDiscountQuery(undefined, { refetchOnMountOrArgChange: true })

    return (
		<div>
			{isFetching && (
				<div className="text-center p-3">
					<Spinner variant="secondary" animation="border" />
				</div>
			)}
			{!isFetching && data?.discountPercentValue && <div className="fs-3 mb-2">{data.discountPercentValue}%</div>}
			{!isFetching && data?.nextLevelRequires && data?.nextLevelRequires.map((item, index) => (
				<div className="text-muted mb-3" key={`level_${index}`}>{item}</div>
			))}
		</div>
	)
}

export default DiscountComponent