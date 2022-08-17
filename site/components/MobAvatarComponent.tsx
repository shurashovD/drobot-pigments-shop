import { FC, useEffect, useRef } from "react"

interface IProps {
    alt: string
	resizing?: boolean
    src?: string
}

const MobAvatarComponent: FC<IProps> = ({ alt, resizing }) => {
	const container = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		setTimeout(() => {
			if ( container.current ) {
				container.current.style.height = container.current.offsetWidth + 'px'
			}
		})
	}, [container, resizing])

	return (
		<div
			className="rounded-circle fs-3 text-uppercase text-primary d-flex border border-secondary"
			ref={container}
		>
			<span className="m-auto">{alt}</span>
		</div>
	)
}

export default MobAvatarComponent