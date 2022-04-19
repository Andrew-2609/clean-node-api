import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { AccountModel } from '../../domain/models'
import { ok, serverError } from '../../presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

const makeFakeAccount = (): AccountModel => ({
  id: 'validId',
  name: 'validName',
  email: 'valid.email@email.com',
  password: 'validPassword'
})

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {
    name: 'anyName',
    email: 'anyEmail@email.com',
    password: 'anyPassword',
    passwordConfirmation: 'anyPassword'
  }
})

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'anyStack'
  return serverError(fakeError)
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return await new Promise(resolve => resolve(ok(makeFakeAccount())))
    }
  }

  return new ControllerStub()
}

const makelogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError (stack: string): Promise<void> {
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

    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse).toStrictEqual(ok(makeFakeAccount()))
  })

  test('should call LogErrorRepository with error in case Controller returns a Server Error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()

    jest.spyOn(
      controllerStub,
      'handle'
    ).mockImplementationOnce(async () => await new Promise(resolve => resolve(makeFakeServerError())))

    const logSpy = jest.spyOn(
      logErrorRepositoryStub,
      'logError'
    )

    await sut.handle(makeFakeHttpRequest())

    expect(logSpy).toHaveBeenCalledWith('anyStack')
  })
})
