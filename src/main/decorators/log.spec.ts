import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { serverError } from '../../presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

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

const makelogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log (stack: string): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }

  return new LogErrorRepositoryStub()
}

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const logErrorRepositoryStub = makelogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
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

  test('should call LogErrorRepository with error in case Controller returns a Server Error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()

    const fakeError = new Error()
    fakeError.stack = 'anyStak'

    jest.spyOn(
      controllerStub,
      'handle'
    ).mockImplementationOnce(async () => await new Promise(resolve => resolve(serverError(fakeError))))

    const logSpy = jest.spyOn(
      logErrorRepositoryStub,
      'log'
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

    expect(logSpy).toHaveBeenCalledWith(fakeError.stack)
  })
})
