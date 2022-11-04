import classNames from "classnames"
import { FC, useEffect, useState } from "react"
import { Col, Container, ListGroup, Row } from "react-bootstrap"
import { ICompareReport } from "../../../../../shared"
import { useGetProductsQuery } from "../../../../application/compare.service"
import { useAppSelector } from "../../../../application/hooks"

interface IProps {
    title: string
    left?: string
    right?: string
}

const Item: FC<IProps> = ({ title, left, right }) => {
	return (
		<ListGroup.Item className="p-0 py-4">
			<Container>
				<Row className="g-2">
					<Col xs={12} className="text-uppercase text-muted">
						{title}
					</Col>
					<Col xs={6} className={classNames({ "text-muted": !left })}>{left || 'Нет данных'}</Col>
					<Col xs={6} className={classNames({ "text-muted": !right })}>{right || 'Нет данных'}</Col>
				</Row>
			</Container>
		</ListGroup.Item>
	)
}

const CompareList = () => {
    const { allProps, categoryId, leftFeedIndex, rightFeedIndex } = useAppSelector((state) => state.compareSlice)
	const { data } = useGetProductsQuery({ categoryId: categoryId || "" }, { skip: !categoryId, refetchOnMountOrArgChange: true })
	const [state, setState] = useState<ICompareReport["fields"]>([])

	useEffect(() => {
		if (data?.fields) {
			let state = data.fields
			if (!allProps) {
				state = state.filter(({ values }) => Array.from(new Set([values[leftFeedIndex], values[rightFeedIndex]])).length > 1)
			}
			setState(state)
		}
		if (!categoryId) {
			setState([])
		}
	}, [allProps, data, categoryId, leftFeedIndex, rightFeedIndex])

    return (
		<div>
			<Container>
				<div className="text-uppercase fs-3 mb-3">Общие характеристики</div>
                { state.length === 0 && <div className="text-muted">Различия не обнаружены</div> }
			</Container>
			<ListGroup variant="flush" className="p-0">
				{state.map(({ id, title, values }) => (
					<Item key={id} title={title} left={values[leftFeedIndex]} right={values[rightFeedIndex]} />
				))}
			</ListGroup>
		</div>
	)
}

export default CompareList