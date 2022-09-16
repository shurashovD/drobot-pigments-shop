import { ICategory } from '../../../shared/index'
import { FC, useCallback, useState } from 'react'
import ImageComponent from '../../components/ImageComponent'
import { NavLink } from 'react-router-dom'

interface IProps {
    category?: ICategory
}

const CategoryItem: FC<IProps> = ({ category }) => {
	const [width, setWidth] = useState('auto')
	const [title, setTitle] = useState<string[]>([])

	const container = useCallback(() => {
		function getStringWidthPx(text: string): number {
			const element = document.createElement("span")
			element.style.opacity = "0"
			element.style.position = "fixed"
			element.style.top = "-999px"
			element.textContent = text
			const id = `tested-string_${category?._id?.toString()}`
			element.id = id
			document.body.insertAdjacentElement("beforeend", element)
			const testedElement = document.getElementById(id)
			const width = testedElement?.offsetWidth
			testedElement?.parentNode?.removeChild(testedElement)
			return width || 0
		}
		
		if ( category?.title ) {
			let words = category.title.split(' ').filter(item => item.length > 0)
			let halfWordsLength = Math.round(words.length / 2)

			if ( words[halfWordsLength - 1]?.toLowerCase() === 'drobot' ) {
				const mediana = `${words[halfWordsLength - 1]} ${words[halfWordsLength]}`
				words = [
					...words.slice(0, halfWordsLength - 1),
					mediana,
					...words.slice(halfWordsLength + 1),
				]
				--halfWordsLength
			}

			const firstHalf = words.slice(0, halfWordsLength).join(' ')
			const secondHalf = words.slice(halfWordsLength).join(" ")
			const text = (firstHalf.length > secondHalf.length) ? firstHalf : secondHalf
			const width = getStringWidthPx(text)
			setWidth(`${width + 32}px`)
			setTitle(words)
		}
	}, [])

    return (
		<div className="position-relative" ref={container}>
			<ImageComponent src={category?.photo[0] || "/static/"} />
			<NavLink
				className="w-100 p-2 px-xl-4 text-uppercase text-primary bg-secondary position-absolute bottom-0 start-0 end-0 d-flex align-items-center category-card__label"
				to={`/category/${category?._id?.toString()}/[]`}
			>
				<div className="text-wrap" style={{ width }}>
					{title.map((item, index) => (
						<span
							key={`${category?._id.toString()}_${index}`}
							style={{
								whiteSpace:
									item.split(" ").length === 1
										? "break-spaces"
										: "nowrap",
							}}
						>
							{item}{" "}
						</span>
					))}
				</div>
			</NavLink>
		</div>
	)
}

export default CategoryItem