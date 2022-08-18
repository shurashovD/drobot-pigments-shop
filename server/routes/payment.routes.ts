import { Request, Router } from "express";
import errorHandler from "../handlers/errorLogger";
import OrderModel from "../models/OrderModel";

const router = Router()

router.get('/:id', async (req: Request<{id: string}>, res) => {
    try {
        const { id } = req.params
        const order = await OrderModel.findById(id)
        if ( !order ) {
            const err = new Error()
            err.userError = true
            err.sersviceInfo = `Заказ ${id} не найден. Страница редиректа Ю-Касса`
            throw err
        }
        if ( order.payment ) {
            order.payment.probably = true
            await order.save()
        }
        
        return res.send('<h3>Работа с оплатой завершена.</h3><h4>Закройте эту вкладку и вернитесь в магазин.</h4>')
    }
    catch (e: any) { errorHandler(e, req, res) }
})

export default router