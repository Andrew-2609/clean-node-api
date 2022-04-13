export default {
  port: process.env.port ?? 5050,
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://localhost:27017/clean-node-api'
}
