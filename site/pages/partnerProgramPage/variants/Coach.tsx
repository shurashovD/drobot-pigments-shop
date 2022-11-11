const Coach = () => {
	return (
		<div className="h-100">
			<div className="text-center text-uppercase text-white p-4 bg-dark">для ТРЕНЕРОВ</div>
			<div className="text-center p-4 py-6 d-flex flex-column h-100" style={{ backgroundColor: "#f1f1f1" }}>
				<p>
					<b>Подай заявку,</b>
					<br />
					<span>пройди инструктаж и получи статус </span>
					<span className="white-space">"ТРЕНЕР DROBOT Pigments"</span>
				</p>
				<hr className="bg-dark mx-auto" style={{ width: "40px" }} />
				<p>
					<b>Приобретай продукцию</b>
					<br />
					<span>
						для дальнейшей перепродажи с плавающей <b>скидкой до 35%</b> в зависимости от суммы единовременного заказа
					</span>
				</p>
				<hr className="bg-dark mx-auto" style={{ width: "40px" }} />
				<p>
					<b>Придумай и активируй</b>
					<br />
					<span>свой агентский промокод</span>
				</p>
				<hr className="bg-dark mx-auto" style={{ width: "40px" }} />
				<p>
					<b>Работай на пигментах</b>
					<br />
					<span>и рассказывай о них своим подписчикам и ученикам</span>
				</p>
				<hr className="bg-dark mx-auto" style={{ width: "40px" }} />
				<p>
					<b>На каждую покупку</b>
					<br />
					<span>по твоему промокоду для твоих подписчиков и учеников будет </span>
					<b className="white-space">скидка - 10%</b>
				</p>
				<hr className="bg-dark mx-auto" style={{ width: "40px" }} />
				<p>
					<b>С каждой покупки</b>
					<br />
					<span>
						по твоему промокоду тебе будет начисляться <b>кэшбэк</b>, который ты можешь использовать <b>для приобретения продукции</b> в
						нашем интернет-магазине или <b>выводить наличными</b>.
					</span>
				</p>
				<hr className="bg-dark mx-auto" style={{ width: "40px" }} />
				<p>
					<b>Тебе не нужно вкладывать и "замораживать"</b>
					<br />
					<span>деньги в продукции!</span>
				</p>
				<div className="mt-auto text-center">
					<a
						href="https://docs.google.com/forms/d/19zxTipbaic-7lwIKXa1pRtndQFD2qBJmK3BVZdUoPQw/edit"
						target="_blank"
						className="btn btn-dark text-white text-uppercase mw-50"
					>
						Стать тренером
					</a>
				</div>
			</div>
		</div>
	)
}

export default Coach