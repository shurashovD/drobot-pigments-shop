import { useCallback, useState } from "react"
import { Image } from "react-bootstrap"
const image = require("../../../img/partner-program-header.jpg")
const mImage = require("../../../img/m_partner-program-header.jpg")

const Header = () => {
    const [src, setSrc] = useState<string|undefined>()

    const container = useCallback((container: HTMLDivElement) => {
        const lg = container?.offsetWidth > 768
        setSrc(lg ? image : mImage)
    }, [])

    return (
        <div ref={container} className="text-center">
            { src && <Image src={src} fluid /> }
        </div>
    )
}

export default Header