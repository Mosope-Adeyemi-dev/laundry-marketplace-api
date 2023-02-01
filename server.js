const app = require('./app')
const connectDb = require('./config/db')

const PORT = process.env.PORT || 4000

connectDb().then(() => {
    app.listen(PORT, () => {
        console.log(`active ${PORT}`)
    })
}).catch((err) => {
    throw new Error('Unable to start server')
});