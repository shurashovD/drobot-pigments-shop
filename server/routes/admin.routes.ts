import { Request, Router } from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import config from 'config'
import { readFile } from 'fs/promises'

const router = Router()

router.get('/', (req, res) => {
    try {
        return res.render("login")
    }
    catch (e) {
        console.log(e)
        return res.send('Что-то пошло не так...')
    }
})

router.post("/", bodyParser.urlencoded({ extended: false }), async (req: Request, res) => {
	try {
		const { login, pass } = req.body
        const { login: configLogin, password: configPassword } = config.get<any>('panel')
		if ( login === configLogin && pass === configPassword ) {
            req.session.isAdmin = true
			return res.redirect("/admin/panel")
        }
		
        return res.redirect("/admin")
	} catch (e) {
		console.log(e)
		return res.send("Что-то пошло не так...")
	}
})

router.get('/panel', async (req, res) => {
    try {
        if (req.session.isAdmin) {
            const tempPath = path.join(
				__dirname,
				"static",
				"admin",
				"index.html"
			)
			const template = await readFile(tempPath, { encoding: "utf-8" })
            return res.send(template)
        }
        return res.redirect('/admin')
    }
    catch (e) {
        console.log(e)
		return res.send("Что-то пошло не так...")
    }
})

router.get('/logout', (req, res) => {
    try {
        req.session.destroy((err) => {
            if ( err ) {
                throw err
            }
            return res.redirect("/admin/login")
        })
    }
    catch (e) {
        console.log(e)
        return res.send('Что-то пошло не так...')
    }
})

router.get('*', (req, res) => {
    return res.redirect('/admin/panel')
})

export default router