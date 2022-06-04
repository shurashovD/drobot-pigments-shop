import { FC, useEffect, useState } from "react"
import { Button, ButtonProps } from "react-bootstrap";

interface IProps extends ButtonProps {
    show: boolean
}

const NavCatalogBtn: FC<IProps> = (({ className, onClick, show }) => {
    const [classList, setClassList] = useState<"show" | "hide" | "isShowing" | "isHiding">("hide")

    useEffect(() => {
        if ( show ) {
            setClassList('isShowing')
            setTimeout(() => {
                setClassList('show')
            }, 200)
        }
        else {
            setClassList("isHiding")
			setTimeout(() => {
				setClassList("hide")
			}, 200)
        }
    }, [show])

    return (
		<Button
			variant="link"
			className="d-none d-lg-flex align-items-center text-white text-uppercase m-0 p-0"
			onClick={onClick}
		>
			<span className={`nav-catalog-btn-${classList}`} />
			<span>Каталог</span>
		</Button>
	)
})

export default NavCatalogBtn