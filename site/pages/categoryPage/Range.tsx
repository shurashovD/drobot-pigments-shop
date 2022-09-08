import { ChangeEvent, FC, useEffect, useState } from "react"
import { Form } from "react-bootstrap"

interface IProps {
    min: number
    max: number
    onChage: (args: { min: number, max: number }) => void
    minValue: number,
    maxValue: number
}

const Range: FC<IProps> = ({ min, max, minValue, maxValue, onChage }) => {
    const [left, setLeft] = useState({ min: 0, max: 100 })        // числа от 0 до 100

    const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const value = +event.target.value
        if ( value >= left.min && value <= left.max ) {
            if (Math.abs(value - left.min) > Math.abs(left.max - value)) {
				setLeft((state) => ({ ...state, max: value }))
                onChage({
					min: min + 0.01 * left.min * (max - min),
					max: min + 0.01 * value * (max - min),
				})
			} else {
				setLeft((state) => ({ ...state, min: value }))
                onChage({
					min: min + 0.01 * value * (max - min),
					max: min + 0.01 * left.max * (max - min),
				})
			}
            return
        }
        if (value <= left.min) {
			setLeft((state) => ({ ...state, min: value }))
            onChage({
				min: min + 0.01 * value * (max - min),
				max: min + 0.01 * left.max * (max - min),
			})
			return
		}
		if (value >= left.max) {
			setLeft((state) => ({ ...state, max: value }))
            onChage({
				min: min + 0.01 * left.min * (max - min),
				max: min + 0.01 * value * (max - min),
			})
			return
		}
    }

    useEffect(() => {
        setLeft({
			min: ((Math.max(min, minValue) - min) / (max - min)) * 100,
			max: ((Math.min(max, maxValue) - min) / (max - min)) * 100
		})
    }, [minValue, maxValue, min, max])

    return (
		<div className="position-relative" style={{ height: "20px" }}>
			<div className="position-absolute w-100 end-0 top-50 start-50 translate-middle" style={{ height: "1px", backgroundColor: "#AB9A9A" }} />
			<div className="position-absolute top-50 translate-middle rounded-circle p-1 bg-primary" style={{ left: `${left.min}%`, transition: '0.1s' }} />
			<div className="position-absolute top-50 translate-middle rounded-circle p-1 bg-primary" style={{ left: `${left.max}%`, transition: '0.1s' }} />
			<div className="position-absolute top-50 translate-middle bg-primary"
                style={{ height: "3px", left: `${left.min + (left.max - left.min) / 2}%`, width: `${left.max - left.min}%`, transition: '0.1s' }} />
            <Form.Range
                className="position-absolute w-100 end-0 top-50 start-50 translate-middle opacity-0"
                onChange={changeHandler}
                style={{ zIndex: 3 }}
            />
		</div>
	)
}

export default Range