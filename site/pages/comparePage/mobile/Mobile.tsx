import { useEffect, useState } from "react"
import { Container, Tab } from "react-bootstrap"
import { useAppSelector } from "../../../application/hooks"
import Categories from "./Categories"
import Properties from "./properties/Properties"

const Mobile = () => {
    const { categoryId } = useAppSelector(state => state.compareSlice)
    const [activeKey, setActiveKey] = useState<"categories" | "properties">("categories")

    useEffect(() => {
        setActiveKey(!!categoryId ? "properties" : "categories")
    }, [categoryId])

    return (
        <Container fluid className="p-0 d-lg-none">
            <Tab.Container activeKey={activeKey}>
                <Tab.Content>
                    <Categories />
                    <Properties />
                </Tab.Content>
            </Tab.Container>
        </Container>
    )
}

export default Mobile