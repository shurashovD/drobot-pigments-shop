import { Router } from 'express';

const router = Router()

router.get('/', (req, res) => {
    return res.json(!!req.session.acceptCookies)
})

router.post('/', (req, res) => {
    req.session.acceptCookies = true
    return res.end()
})

export default router