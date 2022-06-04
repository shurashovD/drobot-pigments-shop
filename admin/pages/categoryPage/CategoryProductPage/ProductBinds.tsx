import { ChangeEvent, FC, useEffect, useState } from "react"
import { Form, ListGroup } from "react-bootstrap"
import { Product } from "../../../../shared"
import { useCreateBindMutation } from "../../../application/product.service"
import ButtonComponent from "../../../components/ButtonComponent"
import ProductBindsEdit from "./ProductBindsEditItem"
import ProductBindsItem from "./ProductBindsItem"

interface IProps {
    productId: string
    disabled: boolean
    binds: Product['binds']
}

const ProductBinds: FC<IProps> = ({ binds, disabled, productId }) => {
    const [state, setState] = useState({ bindTitle: '', productLabel: '' })
    const [edited, setEdited] = useState<string | undefined>()
    const [createBind, { isLoading, isSuccess }] = useCreateBindMutation()

    useEffect(() => {
        if ( isSuccess ) {
            setState({ bindTitle: "", productLabel: "" })
        }
    }, [isSuccess])

    return (
		<ListGroup variant="flush">
			{binds.map(({ id, title, productLabel, products }) =>
				id === edited ? (
					<ProductBindsEdit
						key={id}
						bindId={id}
						bindProductLabel={productLabel}
						cancelHandler={() => setEdited(undefined)}
						disabled={disabled}
						productId={productId}
						title={title}
					/>
				) : (
					<ProductBindsItem
						key={id}
						bindId={id}
						childrenCount={products.length}
						disabled={disabled}
						editHandler={(id: string) => setEdited(id)}
						productLabel={productLabel}
						productId={productId}
						title={title}
					/>
				)
			)}
			{ binds.length === 0 && <ListGroup.Item className="vstack gap-2">
				<Form.Label>
					<span>Название новой связи</span>
					<Form.Control
						name="bindTitle"
						value={state.bindTitle}
						onChange={(e: ChangeEvent<HTMLInputElement>) =>
							setState((state) => ({
								...state,
								[e.target.name]: e.target.value,
							}))
						}
						placeholder="Новая связь"
					/>
				</Form.Label>
				<Form.Label>
					<span>Название товара в связи</span>
					<Form.Control
						name="productLabel"
						value={state.productLabel}
						onChange={(e: ChangeEvent<HTMLInputElement>) =>
							setState((state) => ({
								...state,
								[e.target.name]: e.target.value,
							}))
						}
					/>
				</Form.Label>
				<ButtonComponent
					isLoading={isLoading}
					disabled={
						disabled ||
						state.bindTitle === "" ||
						state.productLabel === ""
					}
					onClick={() =>
						createBind({
							id: productId,
							body: state,
						})
					}
				>
					Создать
				</ButtonComponent>
			</ListGroup.Item> }
		</ListGroup>
	)
}

export default ProductBinds