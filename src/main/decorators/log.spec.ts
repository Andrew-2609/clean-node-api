import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

describe('LogController Decorator', () => {
  test('should call inner controller handle function', async () => {
    class ControllerStub implements Controller {
      async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse: HttpResponse = {
          statusCode: 200,
          body: {}
        }
        return await new Promise(resolve => resolve(httpResponse))
      }
    }

    const controllerStub = new ControllerStub()

    const sut = new LogControllerDecorator(controllerStub)

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
})
