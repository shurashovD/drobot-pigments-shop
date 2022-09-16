import express from 'express'
import { connect } from 'mongoose'
import { engine } from 'express-handlebars'
import config from 'config'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import path from 'path'
import moySkladRoutes from './routes/moySklad.routes'
import categoryRoutes from "./routes/categroies.routes"
import productsRoutes from "./routes/products.routes"
import ordersRoutes from "./routes/orders.routes"
import adminRoutes from './routes/admin.routes'
import sdekRoutes from './routes/sdek.routes'
import authRoutes from './routes/auth.routes'
import ukassaRoutes from './routes/ukassa.routes'
import paymentRoutes from './routes/payment.routes'
import amoRoutes from "./routes/amo.routes"
import accountRoutes from './routes/account.routes'
import usersRoutes from "./routes/users.routes"
import profileRoutes from "./routes/profile.routes"
import authMiddleware from './middleware/auth.middleware'
import frontLogger from './routes/frontLogger.routes'
import loyaltyRoutes from './routes/loyalty.routes'
import rests from './moyskladAPI/rests'

const PORT = 3000

const app = express()

const start = async () => {
    try {
        await connect(config.get("mongoURI"))
        app.listen(PORT, () => {
            console.log(`Server is running on PORT ${PORT}...`)
        })
    }
    catch (e) {
        console.log(e)
    }
}

app.engine('hbs', engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))

app.use(
	session({
		secret: config.get("sessionSecret"),
		resave: true,
		saveUninitialized: true,
        cookie: {
            maxAge: 40 * 24 * 3600 * 1000
        },
		store: MongoStore.create({
			mongoUrl: config.get("mongoURI"),
            ttl: 40 * 24 * 3600 * 1000
		}),
	})
)

app.use('/static', express.static(path.join(__dirname, 'static')))

app.use("/api/amo", amoRoutes)

app.use('/admin', adminRoutes)

app.use("/payment", paymentRoutes)

app.use('/api/moy-sklad', moySkladRoutes)

app.use("/api/categories", categoryRoutes)

app.use("/api/products", productsRoutes)

app.use("/api/orders", ordersRoutes)

app.use("/api/sdek", sdekRoutes)

app.use("/api/auth", authRoutes)

app.use("/api/ukassa", ukassaRoutes)

app.use("/api/account", accountRoutes)

app.use("/api/profile", authMiddleware, profileRoutes)

app.use("/api/users", usersRoutes)

app.use("/api/loyalty", loyaltyRoutes)

app.use("/api/front-handler", frontLogger)

app.get('*', (req, res) => {
    try {
        const file = path.join(__dirname, 'static', 'site', 'index.html')
        res.sendFile(file)
    }
    catch (e) {
        console.log(e);
        return res.status(500).end()
    }
})

start()