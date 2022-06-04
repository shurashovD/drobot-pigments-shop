import { FC, useCallback, useEffect, useState } from "react"
import { Button, Col, Form, ListGroup, Modal, ModalProps, Row, Spinner } from "react-bootstrap"
import { successAlert } from "../../application/alertSlice"
import { useAddProductMutation } from "../../application/category.service"
import { useAppDispatch } from "../../application/hooks"
import { useGetFreeProductsQuery } from "../../application/moySklad.service"
import ButtonComponent from "../../components/ButtonComponent"

interface IProps extends ModalProps {
	categoryId: string
}

const AddProductsModal: FC<IProps> = (props) => {
	const [catalog, setCatalog] = useState<string | undefined>()
	const [candidates, setCandidates] = useState<string[]>([])
	const { data, isLoading } = useGetFreeProductsQuery(catalog, {
		refetchOnMountOrArgChange: true,
	})
	const [addProduct, { isLoading: addLoading, isSuccess }] =
		useAddProductMutation()
	const dispatch = useAppDispatch()
	
	const hideHandler = useCallback(() => {
		setCatalog(undefined)
		if (props.onHide) {
			props.onHide()
		}
	}, [])

	useEffect(() => {
		if (isSuccess) {
			dispatch(successAlert("Товары добавлены"))
			hideHandler()
		}
	}, [isSuccess, dispatch, hideHandler])

	const checkHandler = (ids: string[]) => {
		for (const id of ids) {
			if (candidates.some((item) => item === id)) {
				setCandidates((state) => state.filter((item) => item !== id))
			} else {
				setCandidates((state) => state.concat(id))
			}
		}
	}

	const catalogHandler = (id: string | undefined) => {
		setCandidates([])
		setCatalog(id)
	}

	return (
		<Modal fullscreen show={props.show} onHide={hideHandler}>
			<Modal.Header closeButton>
				{data && <span className="me-4">{data.catalog?.name}</span>}
				<ButtonComponent
					onClick={() => addProduct({ body: { products: candidates }, id: props.categoryId })}
					isLoading={addLoading}
					disabled={candidates.length === 0}
				>
					Добавить выбранные
				</ButtonComponent>
			</Modal.Header>
			{!isLoading && data && (
				<ListGroup as="ul" variant="flush">
					{data.catalog && (
						<ListGroup.Item>
							<Row>
								<Col xs={10} xl={6}>
									<Button
										variant="link"
										onClick={() =>
											catalogHandler(
												data.catalog?.parent?.toString()
											)
										}
									>
										..
									</Button>
								</Col>
								<Col xs={2}>
									<Form.Check
										className="m-0"
										checked={
											candidates.length > 0 &&
											data.products.every(({ _id }) =>
												candidates.some(
													(item) =>
														item === _id.toString()
												)
											)
										}
										onChange={() =>
											checkHandler(
												data.products.map(({ _id }) =>
													_id.toString()
												)
											)
										}
									/>
								</Col>
							</Row>
						</ListGroup.Item>
					)}
					{data.catalogs.map((item) => (
						<ListGroup.Item
							key={item._id?.toString()}
							as="button"
							variant="link"
							onClick={() => catalogHandler(item._id?.toString())}
							className="text-start text-primary"
						>
							{item.name}
						</ListGroup.Item>
					))}
					{data.products.map((item) => {
						return (
							<ListGroup.Item key={item._id?.toString()}>
								<Row>
									<Col xs={10} lg={6}>
										{item.name}
									</Col>
									<Col xs={2}>
										<Form.Check
											checked={candidates.some(
												(id) =>
													id === item._id?.toString()
											)}
											onChange={() =>
												checkHandler([
													item._id?.toString(),
												])
											}
										/>
									</Col>
								</Row>
							</ListGroup.Item>
						)
					})}
				</ListGroup>
			)}
			{isLoading && (
				<div className="text-center p-5">
					<Spinner animation="border" size="sm" variant="secondary" />
				</div>
			)}
		</Modal>
	)
}

export default AddProductsModal