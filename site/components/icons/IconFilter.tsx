import { FC } from "react"

interface IProps {
	stroke: string
}

const IconFilter: FC<IProps> = ({ stroke }) => {
    return (
		<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
			<path d="M20.5928 13H22.88" stroke="#39261F" strokeWidth="1.5" />
			<path d="M3.12012 13H15.7179" stroke="#39261F" strokeWidth="1.5" />
			<path d="M10.7817 6.48779H22.8799" stroke="#39261F" strokeWidth="1.5" />
			<path d="M3.12012 6.48779H5.91512" stroke="#39261F" strokeWidth="1.5" />
			<path d="M14.2188 19.5122H22.88" stroke="#39261F" strokeWidth="1.5" />
			<path d="M3.12012 19.5122H9.34387" stroke="#39261F" strokeWidth="1.5" />
			<path
				d="M8.34863 8.79938C9.69483 8.79938 10.7861 7.70807 10.7861 6.36188C10.7861 5.01568 9.69483 3.92438 8.34863 3.92438C7.00244 3.92438 5.91113 5.01568 5.91113 6.36188C5.91113 7.70807 7.00244 8.79938 8.34863 8.79938Z"
				stroke="#39261F"
				strokeWidth="1.5"
			/>
			<path
				d="M18.1553 15.4375C19.5015 15.4375 20.5928 14.3462 20.5928 13C20.5928 11.6538 19.5015 10.5625 18.1553 10.5625C16.8091 10.5625 15.7178 11.6538 15.7178 13C15.7178 14.3462 16.8091 15.4375 18.1553 15.4375Z"
				stroke="#39261F"
				strokeWidth="1.5"
			/>
			<path
				d="M11.7812 21.9497C13.1274 21.9497 14.2188 20.8584 14.2188 19.5122C14.2188 18.166 13.1274 17.0747 11.7812 17.0747C10.4351 17.0747 9.34375 18.166 9.34375 19.5122C9.34375 20.8584 10.4351 21.9497 11.7812 21.9497Z"
				stroke="#39261F"
				strokeWidth="1.5"
			/>
		</svg>
	)
}

export default IconFilter


