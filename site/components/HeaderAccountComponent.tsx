import { useAppSelector } from "../application/hooks"
import IconAccount from "./icons/IconAccount"
import IconAccountSign from "./icons/IconAccountSign"

const HeaderAccountComponent = () => {
    const isAuth = useAppSelector(state => !!state.profileSlice.client)

    return isAuth ? (
        <IconAccountSign stroke={"#ffffff"} />
    ) : (<IconAccount stroke={"#ffffff"} />)
}

export default HeaderAccountComponent