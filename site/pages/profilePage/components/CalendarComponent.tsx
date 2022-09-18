import { useEffect, useState } from "react"
import { Calendar, DateCallback, OnChangeDateRangeCallback,  } from "react-calendar"
import { useAppDispatch, useAppSelector } from "../../../application/hooks"
import { setForm } from "../../../application/profilePromocodesSlice"

const CalendarComponent = () => {
    const [minDate, setMinDate] = useState<Date | undefined>()
    const { dateFinish, dateStart } = useAppSelector(state => state.profilePromocodesSlice.form)
    const dispatch = useAppDispatch()

    const handler: OnChangeDateRangeCallback = (event) => {
        const [start = null, end = null] = event
        if ( start ) {
            dispatch(setForm({ key: "dateStart", value: start.toString() }))
        }
        if ( end ) {
            dispatch(setForm({ key: "dateFinish", value: end.toString() }))
        }
    }

    const dayHandler: DateCallback = (event) => {
        if ( dateStart === "" ) {
            dispatch(setForm({ key: "dateStart", value: event.toString() }))
            return
        }
        if ( dateFinish === "" ) {
            dispatch(setForm({ key: "dateFinish", value: event.toString() }))
        }
    }

    useEffect(() => {
		console.log(dateStart, dateFinish);
		if (dateFinish === "") {
			if (dateStart === "") {
				setMinDate(undefined)
			} else {
				setMinDate(new Date(dateStart))
			}
		} else {
			setMinDate(undefined)
		}
	}, [dateFinish, dateStart])

    return (
		<div>
			<Calendar
				defaultValue={dateStart !== "" ? new Date(dateStart) : undefined}
				value={[dateStart !== "" ? new Date(dateStart) : null, dateFinish !== "" ? new Date(dateFinish) : null]}
				onChange={handler}
				onClickDay={dayHandler}
				selectRange={true}
				minDate={minDate}
				prevLabel={
					<svg width="9" height="15" viewBox="0 0 9 15" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M7.54282 0.0429687L8.95703 1.45718L3.16414 7.25008L8.95703 13.043L7.54282 14.4572L0.33571 7.25007L7.54282 0.0429687Z"
							fill="#39261F"
						/>
					</svg>
				}
				nextLabel={
					<svg width="9" height="15" viewBox="0 0 9 15" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M1.45718 14.457L0.0429689 13.0428L5.83586 7.24993L0.0429697 1.45703L1.45718 0.0428182L8.66429 7.24993L1.45718 14.457Z"
							fill="#39261F"
						/>
					</svg>
				}
			/>
		</div>
	)
}

export default CalendarComponent