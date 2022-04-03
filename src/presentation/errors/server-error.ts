export class ServerError extends Error {
  constructor () {
    super('An unexpected error has occurred. Please, try again later, or contact the developers!')
    this.name = 'ServerError'
  }
}
