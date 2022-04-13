export default {
  port: process.env.port ?? 5050,
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://172.17.0.2:27017/clean-node-api'
}
