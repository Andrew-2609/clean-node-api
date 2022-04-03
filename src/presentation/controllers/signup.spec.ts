import { MissingParamError } from '../errors/missing-param-error'
import { SignUpController } from './signup'

describe('SignUp Controller', () => {
  test('should return 400 if no name is provided', () => {
    const sut = new SignUpController()

    const httpRequest = {
      body: {
        email: 'any.email@email.com',
        password: 'anyPassword',
        passwordConfirmation: 'anyPassword'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toStrictEqual(new MissingParamError('name'))
  })

  test('should return 400 if no email is provided', () => {
    const sut = new SignUpController()

    const httpRequest = {
      body: {
        name: 'anyName',
        password: 'anyPassword',
        passwordConfirmation: 'anyPassword'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toStrictEqual(new MissingParamError('email'))
  })
})
