import { Stack } from "react-bootstrap"
import SuccessAlert from "../profile/SuccessAlert"
import WarningAlert from "../profile/WarningAlert"

const MobileAlerts = () => {
    return (
        <Stack gap={3} className="pb-3">
            <SuccessAlert />
            <WarningAlert />
        </Stack>
    )
}

export default MobileAlerts