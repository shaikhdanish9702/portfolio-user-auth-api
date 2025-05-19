/* eslint-disable import/order */
require('dotenv').config()
const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const authRoutes = require('./src/routes/auth.routes')
const bookRoutes = require('./src/routes/book.routes')
const userRoutes = require('./src/routes/user.routes')
const logger = require('./src/utils/logger')

const app = express()

// CORS options
const corsOptions = {
  origin: 'http://localhost:8081'
}

app.use(cors(corsOptions))
app.use(bodyParser.json()) // parse application/json
app.use(bodyParser.urlencoded({ extended: true })) // parse application/x-www-form-urlencoded

// Database setup
const db = require('./src/models')
db.sequelize.sync().then(() => {
  logger.info('Database synced.')
})

// Simple root route
app.get('/', (req, res) => {
  res.json({ message: 'Hi there, welcome to this tutorial.' })
})

// Mount API routes
app.use('/book', bookRoutes) // All /book routes
app.use('/auth', authRoutes) // All /auth routes
app.use('/user', userRoutes) // All /user routes

// Set port and start server
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`)
})
