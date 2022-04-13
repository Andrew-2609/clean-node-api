import { NextFunction, Request, Response } from 'express'

export const cors = (req: Request, res: Response, next: NextFunction): void => {
  res
    .set('access-controll-allow-origin', '*')
    .set('access-controll-allow-methods', '*')
    .set('access-controll-allow-headers', '*')
  next()
}
