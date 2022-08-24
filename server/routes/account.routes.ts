import { json } from 'body-parser';
import { Router, Request } from 'express';
import { getContactByPhone } from '../amoAPI/amoApi';
import ClientModel from '../models/ClientModel';
import getCounterPartyByNumber from '../moyskladAPI/counterparty';
import { checkNumber, checkPin } from '../plusofonAPI/plusofonApi';

const router = Router()

router.get('/auth', json(), async (req, res) => {
    try {
        const client = await ClientModel.findById(req.session.userId)
		if (!client) {
			return res.end()
		}
        return res.json(client)
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post('/auth/check-number', json(), async (req: Request<{}, {}, { phone: string }>, res) => {
    try {
        const { phone } = req.body
        const client = await ClientModel.findOne({ tel: phone })
		if (!client) {
			return res.status(500).json({ message: "Пользователь не найден" })
		}
        const key = await checkNumber(phone)
		req.session.plusofonKey = key
		req.session.candidateNumber = phone
        return res.end()
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post('/auth/check-pin', json(), async (req: Request<{}, {}, { pin: string }>, res) => {
    try {
        const { pin } = req.body
        if ( !req.session.plusofonKey ) {
			throw new Error('Отсутсвует ключ Plusofon')
		}
		if (!req.session.candidateNumber) {
			throw new Error("К сессии не привязан номер")
		}
		const result = await checkPin(req.session.plusofonKey, pin)
		if (result === 1 ) {
            const client = await ClientModel.findOne({ tel: req.session.candidateNumber })
            if ( !client ) {
                return res.status(500).json({ message: "Пользователь не найден" })
            }
            if ( req.session.cartId ) {
                await client.mergeCart(req.session.cartId)
                delete req.session.cartId
            }

            req.session.userId = client._id.toString()
            return res.end()
        }
        if (result === -3) {
			return res.status(500).json({ message: "Неверный код" })
		}
		return res.status(500).json({ message: "Ошибка, попробуйте ещё раз" })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post('/register', json(), async (req: Request<{}, {}, { phone: string }>, res) => {
    try {
        const { phone } = req.body
        const client = await ClientModel.findOne({ tel: req.session.candidateNumber })
		if (client) {
			return res.status(500).json({ message: "Пользователь с таким номером уже зарегистрирован" })
		}
        const key = await checkNumber(phone)
		req.session.plusofonKey = key
		req.session.candidateNumber = phone
        return res.end()
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post('/register/check-pin', json(), async (req: Request<{}, {}, { pin: string }>, res) => {
    try {
        const { pin } = req.body
        if ( !req.session.plusofonKey ) {
			throw new Error('Отсутсвует ключ Plusofon')
		}
		if (!req.session.candidateNumber) {
			throw new Error("К сессии не привязан номер")
		}
		const result = await checkPin(req.session.plusofonKey, pin)
		if (result === 1 ) {
            let client = await ClientModel.findOne({ tel: req.session.candidateNumber })
            if (client) {
			    return res.status(500).json({ message: "Пользователь с таким номером уже зарегистрирован" })
		    }
            client = await new ClientModel({ tel: req.session.candidateNumber }).save()

            const contact = await getContactByPhone(req.session.candidateNumber)
			if (contact) {
				const { id } = contact
				client.amoContactId = id
				await client.save()
			}

            const counterparty = await getCounterPartyByNumber(req.session.candidateNumber)
            if ( counterparty ) {
                const { id } = counterparty
                client.counterpartyId = id
                await client.save()
            }
            
            req.session.userId = client._id.toString()
            return res.end()
        }
        if (result === -3) {
			return res.status(500).json({ message: "Неверный код" })
		}
		return res.status(500).json({ message: "Ошибка, попробуйте ещё раз" })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

export default router