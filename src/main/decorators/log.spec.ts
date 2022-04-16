import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          id: 'anyId',
          name: 'anyName',
          email: 'anyEmail@email.com',
          password: 'anyPassword'
        }
      }
      return await new Promise(resolve => resolve(httpResponse))
    }
  }

  return new ControllerStub()
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const sut = new LogControllerDecorator(controllerStub)

  return {
    sut,
    controllerStub
  }
}

describe('LogController Decorator', () => {
  test('should call inner controller handle function', async () => {
    const { sut, controllerStub } = makeSut()

    const handleSpy = jest.spyOn(
      controllerStub,
      'handle'
    )

    const httpRequest = {
      body: {
        name: 'anyName',
        email: 'anyEmail@email.com',
        password: 'anyPassword',
        passwordConfirmation: 'anyPassword'
      }
    }

    await sut.handle(httpRequest)

    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('should return wrapped controller handle result', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'anyName',
        email: 'anyEmail@email.com',
        password: 'anyPassword',
        passwordConfirmation: 'anyPassword'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toStrictEqual({
      statusCode: 200,
      body: {
        id: 'anyId',
        name: 'anyName',
        email: 'anyEmail@email.com',
        password: 'anyPassword'
      }
    })
  })
})
