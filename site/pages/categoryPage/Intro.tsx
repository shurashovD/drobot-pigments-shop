import { FC, useEffect, useRef, useState } from "react"
import ReactPlayer from "react-player"
import { useGetContentQuery } from "../../application/category.service"

const Intro: FC<{ categoryId: string }> = ({ categoryId }) => {
    const { data: content } = useGetContentQuery({ categoryId }, { refetchOnMountOrArgChange: true })
    const [url, setUrl] = useState<string | undefined>()
    const container = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
		if (content && content.videos[0]) {
			//const fileName = container.current.offsetWidth > 576 ? "video.mp4" : "m_video.mp4"
			setUrl(content.videos[0])
		} else {
			setUrl(undefined)
		}
	}, [container, content])

    if ( !url ) {
        return null
    }

	return (
		<div id="intro-category" ref={container} className="position-relativer">
			<ReactPlayer
                className="position-absolute top-0 start-0"
				controls={false}
				url={url}
				muted={true}
				loop={true}
				playing={true}
				width="100%"
				height="100%"
			/>
		</div>
	)
}

export default Intro