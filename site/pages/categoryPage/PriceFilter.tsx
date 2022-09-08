import { ChangeEvent, FC, FocusEvent, useEffect, useState } from "react"
import { Accordion, Form } from "react-bootstrap"
import { setMaxPrice, setMinPrice } from "../../application/filtersSlice"
import { useAppDispatch, useAppSelector } from "../../application/hooks"
import Range from "./Range"

interface IProps {
    min: number,
    max: number
}

const PriceFilter: FC<IProps> = ({ min, max }) => {
    const [state, setState] = useState({ min: min.toString(), max: max.toString() })
    const { minPrice, maxPrice } = useAppSelector(state => state.filtersSlice)
    const dispatch = useAppDispatch()

    const inputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        const { name } = event.target
        if ( value === '' ) {
            setState((state) => ({ ...state, [event.target.name]: value }))
        }
        if ( !isNaN(+value) ) {
            if ( name === "min" ) {
                setState((state) => ({ ...state, min: Math.min(+state.max - 1, +value).toString() }))
                if ( +value >= min ) {
                    dispatch(setMinPrice(+value))
                }
            }
            if ( name === "max" ) {
                setState((state) => ({ ...state, max: Math.min(max, +value).toString() }))
                if ( +value >= +state.min + 1 ) {
                    dispatch(setMaxPrice(+value))
                }
            }
        }
    }

    const blurHandler = (event: FocusEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        if ( event.target.value === '' ) {
			if (name === "min") {
				setState((state) => ({ ...state, min: minPrice?.toString() || min?.toString() }))
			}
			if (name === "max") {
				setState((state) => ({ ...state, max: maxPrice?.toString() || max?.toString() }))
			}
        }
        if ( name === "max" && +value < +state.min + 1 ) {
            setState((state) => ({ ...state, max: maxPrice?.toString() || max?.toString() }))
        }
    }

    const rangeChange = ({ min, max }: { min: number, max: number }) => {
        setState({ min: Math.round(min).toString(), max: Math.round(max).toString() })
        dispatch(setMaxPrice(Math.round(max)))
        dispatch(setMinPrice(Math.round(min)))
    }

    useEffect(() => {
        if ( !maxPrice ) {
            dispatch(setMaxPrice(max))
        } else {
            setState(state => ({ ...state, max: maxPrice.toString() }))
        }
        if (!minPrice) {
			dispatch(setMinPrice(min))
		} else {
			setState((state) => ({ ...state, min: minPrice.toString() }))
		}
    }, [min, max, maxPrice, minPrice, dispatch, setMinPrice, setMaxPrice])

    return (
		<Accordion.Item eventKey="price-fliter" className="mb-6 bg-transparent">
			<Accordion.Header className="text-uppercase">Цена</Accordion.Header>
			<Accordion.Body>
				<div className="d-flex align-items-center mb-4">
					<Form.Control onChange={inputChange} value={state.min} name="min" onBlur={blurHandler} className="px-2 py-3" />
					<div className="mx-2">-</div>
					<Form.Control onChange={inputChange} value={state.max} name="max" onBlur={blurHandler} className="px-2 py-3" />
				</div>
				<div>
					<Range max={max} min={min} onChage={rangeChange} maxValue={maxPrice || max} minValue={minPrice || min} />
				</div>
			</Accordion.Body>
		</Accordion.Item>
	)
}

export default PriceFilter