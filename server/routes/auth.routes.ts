import bodyParser from 'body-parser';
import { Request, Router } from 'express';
import ClientModel from '../models/ClientModel';

const router = Router()

router.post('/', bodyParser.json(), async (req: Request<{}, {}, { tel: string }>, res) => {
    try {
        const { tel } = req.body
        let client = await ClientModel.findOne({ tel })
		if (!client) {
			client = await new ClientModel({ tel }).save()
		}
        req.session.userId = client._id.toString()
        return res.end()
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

export default router