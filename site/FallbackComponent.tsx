import { Spinner } from "react-bootstrap"

const FallbackComponent = () => {
    return (
		<div className="text-center py-6">
			<Spinner animation="border" variant="secondary" />
		</div>
	)
}

export default FallbackComponent