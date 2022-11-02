import { MissingParamError } from '../../errors'
import { ok, badRequest } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['email', 'password']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return await new Promise((resolve) => resolve(badRequest(new MissingParamError(field))))
      }
    }

    return await new Promise((resolve) => resolve(ok(null)))
  }
}