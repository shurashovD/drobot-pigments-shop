import ButtonComponent from "../../../components/ButtonComponent"

const Coach = () => {
	return (
		<div style={{ backgroundColor: "#FDF9EF" }} className="d-flex flex-column justify-content-between align-items-center pb-6 h-100">
			<div className="text-center text-uppercase text-white bg-dark p-4 w-100 mb-2">Тренер</div>
			<div className="text-center my-6 px-4">
				<span className="text-dark">Становись тренером</span>{" "}
				Drobot Pigments и обучай работе на пигментах в соответствии с фирменной колористикой.
			</div>
			<ButtonComponent variant="outline-secondary text-primary">Скоро будет досутпно</ButtonComponent>
		</div>
	)
}

export default Coach
