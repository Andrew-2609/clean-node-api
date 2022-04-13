import { Express } from 'express'
import { bodyParser, contentType, cors } from '../middlewares'

export default (app: Express): void => {
  app
    .use(bodyParser)
    .use(cors)
    .use(contentType)
}
