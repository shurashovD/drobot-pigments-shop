import { updateMsOrder } from './../moyskladAPI/orders';

const statuses = {
	new: "a3ab517a-f494-11e8-9ff4-34e80005d6af",
	builded: "a3ab53d5-f494-11e8-9ff4-34e80005d6b0",
	dispatch: "a3ab5662-f494-11e8-9ff4-34e80005d6b2",
	delivering: "644e2da9-ed66-11ec-0a80-0185000dc96c",
	delivered: "a3ab577e-f494-11e8-9ff4-34e80005d6b3",
	canceled: "70dc899b-ee2a-11ec-0a80-07c8000b5983"
}

const setMsOrderStatus = async (orderId: string, key: "new" | "builded" | "dispatch" | "delivering" | "delivered" | "canceled") => {
	const payload = {
		state: {
			meta: {
				href: `https://online.moysklad.ru/api/remap/1.2/entity/customerorder/metadata/states/${statuses[key]}`,
				type: "state",
				mediaType: "application/json",
			},
		},
	}
	await updateMsOrder(orderId, payload)
}

export default setMsOrderStatus