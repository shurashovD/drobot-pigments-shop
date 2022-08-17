import { FC, useEffect, useRef } from "react"

interface IProps {
    alt: string
    src?: string
}

const AvatarComponent: FC<IProps> = ({ alt }) => {
	const container = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		const handler = () => {
			if (container.current) {
				container.current.style.height = container.current.offsetWidth + "px"
			}
		}

		window.addEventListener('resize', handler)

		if ( container.current ) {
			container.current.style.height = container.current.offsetWidth + "px"
		}

		return () => {
			window.removeEventListener("resize", handler)
		}
	}, [container])

    return (
		<div className="rounded-circle fs-3 text-uppercase text-primary d-flex bg-secondary" ref={container}>
			<span className="m-auto">{alt}</span>
		</div>
	)
}

export default AvatarComponent