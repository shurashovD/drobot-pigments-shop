import { useEffect, useRef, useState } from "react"
import { Collapse } from "react-bootstrap"
import ReactPlayer from "react-player"
import { useAppSelector } from "../../application/hooks"

const Intro = () => {
    const { filterObject } = useAppSelector(state => state.filtersSlice)
    const [url, setUrl] = useState<string | undefined>()
    const [ready, setReady] = useState(false)
    const container = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
		if (container.current && filterObject) {
            const zoneId = "629dfa131a7f483e3680e933"
            const arrowId = "629dfa701a7f483e3680e958"
            const browsId = "62de95c575e91f834a882b90"
            const trichoId = "62de96bb75e91f834a882ca5"
            const correctorsId = "62de96c475e91f834a882cb3"
            const contentId = "62de965975e91f834a882c4a"
            const organicId = "62de968775e91f834a882c75"
            const mineralId = "62de969675e91f834a882c89"
            const hybridId = "62de969075e91f834a882c83"
            const zoneFilters = filterObject.find(({ filterId }) => filterId === zoneId)
            const contentFilters = filterObject.find(({ filterId }) => filterId === contentId)
            if (zoneFilters) {
                const fileName = container.current.offsetWidth > 576 ? "video.mp4" : "m_video.mp4"
                let category,
					content,
					path = "/static/assets/videos"
                let validContent = false
                const arrow = zoneFilters.values.includes(arrowId)
                const brows = zoneFilters.values.includes(browsId)
                const tricho = zoneFilters.values.includes(trichoId)
                const correctors = zoneFilters.values.includes(correctorsId)
                if (brows) {
					category = "brows"
				}
				if (arrow) {
					category = "arrow"
				}
				if (correctors) {
					category = "correctors"
				}
				if (tricho) {
					category = "tricho"
				}
                const validZone = zoneFilters.values.length === 1

                if ( contentFilters ) {
                    const hybrid = contentFilters.values.includes(hybridId)
					const mineral = contentFilters.values.includes(mineralId)
					const organic = contentFilters.values.includes(organicId)
					validContent = contentFilters.values.filter((item) => item).length === 1
					
					if (hybrid) {
						content = "hybrid"
					}
					if (mineral) {
						content = "mineral"
					}
					if (organic) {
						content = "organic"
					}
                }
                
                if ( validZone ) {
                    if ( category ) {
                        path += `/${category}`
                    }
                    if ( content && validContent ) {
                        path += `/${content}`
                    }
                    setUrl(`${path}/${fileName}`)
                } else {
                    setUrl(undefined)
                }
            } else {
                setUrl(undefined)
            }
		} else {
            setUrl(undefined)
        }
	}, [container, filterObject])

    useEffect(() => {
        setReady(false)
    }, [url])

	return (
		<div id="intro-category" ref={container}>
			<Collapse in={ready}>
				<div>
                    <ReactPlayer
                        url={url}
                        muted={true}
                        loop={true}
                        playing={true}
                        width="100%"
                        height="100%"
                        onReady={() => setReady(true)}
                    />
				</div>
			</Collapse>
		</div>
	)
}

export default Intro