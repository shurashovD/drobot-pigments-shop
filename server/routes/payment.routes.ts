import { Request, Router } from "express";
import OrderModel from "../models/OrderModel";

const router = Router()

router.get('/:id', async (req: Request<{id: string}>, res) => {
    try {
        const { id } = req.params
        const order = await OrderModel.findById(id)
        if ( order?.payment ) {
            order.payment.probably = true
            await order.save()
        }
        
        return res.send('<h3>Работа с оплатой завершена.</h3><h4>Закройте эту вкладку и вернитесь в магазин.</h4>')
    }
    catch (e) {
        console.log(e)
        return res.status(500).send('Что-то пошло не так...')
    }
})

export default router