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
		}),
	})
)

app.use('/static', express.static(path.join(__dirname, 'static')))

app.use('/admin', adminRoutes)

app.use('/api/moy-sklad', moySkladRoutes)

app.use("/api/categories", categoryRoutes)

app.use("/api/products", productsRoutes)

app.use("/api/orders", ordersRoutes)

start()