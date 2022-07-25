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
		store: MongoStore.create({
			mongoUrl: config.get("mongoURI"),
            ttl: 60 * 24 * 3600
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