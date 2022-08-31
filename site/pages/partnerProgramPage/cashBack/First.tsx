const First = () => {
    return (
		<div className="text-center h-100 d-flex flex-column">
			<div style={{ width: "44px", height: "40px" }} className="d-flex align-items-center justify-content-center w-100">
				<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M7.00967 2.5H32.9903C34.0206 2.5 35.0087 2.91676 35.7372 3.6586C36.4657 4.40043 36.875 5.40658 36.875 6.4557V32.9193C36.875 33.9684 36.4657 34.9746 35.7372 35.7164C35.0087 36.4582 34.0206 36.875 32.9903 36.875H7.00967C5.97939 36.875 4.99131 36.4582 4.26279 35.7164C3.53428 34.9746 3.125 33.9684 3.125 32.9193V6.4557C3.125 5.40658 3.53428 4.40043 4.26279 3.6586C4.99131 2.91676 5.97939 2.5 7.00967 2.5V2.5Z"
						stroke="#B88E5B"
						strokeWidth="0.8"
						strokeLinecap="round"
					/>
					<path d="M11.25 8.125V14.375" stroke="#B88E5B" strokeWidth="0.8" strokeLinecap="round" />
					<path d="M8.125 11.25H14.375" stroke="#B88E5B" strokeWidth="0.8" strokeLinecap="round" />
					<path d="M9.375 25.625L13.75 30.625" stroke="#B88E5B" strokeWidth="0.8" strokeLinecap="round" />
					<path d="M9.375 30.625L13.75 25.625" stroke="#B88E5B" strokeWidth="0.8" strokeLinecap="round" />
					<path d="M25 11.25H32.5" stroke="#B88E5B" strokeWidth="0.8" strokeLinecap="round" />
					<path d="M25 25.625H32.5" stroke="#B88E5B" strokeWidth="0.8" strokeLinecap="round" />
					<path d="M25 30H32.5" stroke="#B88E5B" strokeWidth="0.8" strokeLinecap="round" />
					<path d="M20.625 2.5V36.25" stroke="#B88E5B" strokeWidth="0.8" strokeLinecap="round" />
					<path d="M3.125 18.75H36.875" stroke="#B88E5B" strokeWidth="0.8" strokeLinecap="round" />
				</svg>
			</div>
			<div className="text-center text-uppercase text-dark my-3">Как рассчитывается кэшбэк?</div>
			<div className="text-center">С каждой продажи по промокоду вам начисляется 10% от суммы покупки.</div>
		</div>
	)
}

export default First