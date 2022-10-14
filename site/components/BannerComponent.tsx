import { FC, useCallback, useState } from "react"
import ImageComponent from "./ImageComponent"

interface IProps {
    folder: string
    widthToHeight: number
    mobileWidthToHeight: number
}

const BannerComponent: FC<IProps> = ({ folder, mobileWidthToHeight, widthToHeight }) => {
    const [src, setSrc] = useState<string|undefined>()
    const [size, setSize] = useState(mobileWidthToHeight)
    const path = `/static/assets/banners/${folder}`
    
    const container = useCallback((container: HTMLDivElement) => {
        if ( container ) {
            if (container.offsetWidth > 576) {
                setSrc(`${path}/banner.jpg`)
                setSize(widthToHeight)
            } else {
                setSrc(`${path}/m_banner.jpg`)
                setSize(mobileWidthToHeight)
            }
        }
    }, [path])

    return <div ref={container}>{src && <ImageComponent src={src} widthToHeight={size} />}</div>
}

export default BannerComponent