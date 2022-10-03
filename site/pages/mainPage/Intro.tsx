import { useCallback, useState } from "react"
import ReactPlayer from "react-player"

const Intro = () => {
    const [url, setUrl] = useState<string | undefined>()
    
    const container = useCallback((container: HTMLDivElement) => {
        if (container) {
            const url = container.offsetWidth > 576 ? "/static/assets/intro.mp4" : "/static/assets/m-intro.mp4"
            setUrl(url)
        }
    }, [])

    return (
        <div id="intro-container" className="mb-6" ref={container}>
            {url && <ReactPlayer url={url} muted={true} loop={true} playing={true} width="100%" height="100%" />}
        </div>
	)
}

export default Intro