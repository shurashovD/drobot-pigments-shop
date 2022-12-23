import { FC } from 'react'
import ButtonComponent from '../../../components/ButtonComponent'
import { useCreateCategoryContentMutation } from '../../../application/categoryContent.service'

const CreateContent: FC<{ categoryId: string }> = ({ categoryId }) => {
    const [create, { isLoading }] = useCreateCategoryContentMutation()

    return (
		<div className="py-3">
			<div className="mb-2">К этой странице еще не привязан контент</div>
			<div className="d-flex">
				<ButtonComponent onClick={() => create({ categoryId })} isLoading={isLoading}>
					Привязать контент
				</ButtonComponent>
			</div>
		</div>
	)
}

export default CreateContent