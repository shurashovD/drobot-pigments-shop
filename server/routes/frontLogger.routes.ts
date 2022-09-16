import { json } from 'body-parser';
import { Router } from "express";
import { logger } from '../handlers/errorLogger';

const router = Router()

router.post('/', json(), (req, res) => {
    const { body } = req
    logger.error(body)
    return res.end()
})

export default router