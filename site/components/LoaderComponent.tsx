import { Spinner } from 'react-bootstrap'

const LoaderComponent = () => {
    return (
        <div className="position-fixed top-0 bottom-0 start-0 end-0 bg-white bg-opacity-75 d-flex">
            <Spinner animation="border" variant="secondary" className="m-auto" />
        </div>
    )
}

export default LoaderComponent