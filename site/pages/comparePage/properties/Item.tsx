import classNames from "classnames"
import { FC, useEffect, useRef } from "react"
import { Col, ListGroup, Row } from "react-bootstrap"
import { useAppSelector } from "../../../application/hooks"

interface IProps {
    title: string
    values: (string|null|undefined)[]
}

const Item: FC<IProps> = ({ title, values }) => {
    const { scrollLeft } = useAppSelector(state => state.compareSlice)
    const feed = useRef<HTMLDivElement|null>(null)

    useEffect(() => {
		if (feed.current) {
			feed.current.scrollTo({ left: scrollLeft })
		}
	}, [scrollLeft, feed])

    return (
		<ListGroup.Item className="py-5">
			<Row>
				<Col lg={3} xl={2} className="text-uppercase text-muted">
					{title}
				</Col>
				<Col lg={9} xl={10}>
					<Row className="overflow-scroll flex-nowrap no-scrollbar" ref={feed}>
						{values.map((item, index) => (
							<Col key={`${index}`} className={classNames({ "text-muted": !item })} xs={11} lg={4} xl={3}>
								{item || "Нет данных"}
							</Col>
						))}
					</Row>
				</Col>
			</Row>
		</ListGroup.Item>
	)
}

export default Item