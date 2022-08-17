import { json } from 'body-parser';
import { Router } from "express";

const router = Router()

router.post('/', json(), (req, res) => {
    const { body } = req
    console.log(body)
    return res.end()
})

export default router