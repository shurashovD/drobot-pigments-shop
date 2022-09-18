import { Spinner } from "react-bootstrap"
import { useGetDiscountQuery } from "../../../application/profile.service"

const DiscountComponent = () => {
    const { data, isFetching } = useGetDiscountQuery(undefined, { refetchOnMountOrArgChange: true })
	const formatter = new Intl.NumberFormat('ru', { style: 'percent' })

    return (
		<div>
			{isFetching && (
				<div className="text-center p-3">
					<Spinner variant="secondary" animation="border" />
				</div>
			)}
			<div className="fs-3 mb-3">
				{data && data.discountPercentValue && formatter.format(+data.discountPercentValue / 100)}
			</div>
			{!isFetching && data?.nextLevelRequires && data?.nextLevelRequires.map((item, index) => (
				<div className="text-muted mb-3" key={`level_${index}`}>{item}</div>
			))}
		</div>
	)
}

export default DiscountComponent