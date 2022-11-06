import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { SignUpController } from './signup'
import { AccountModel, AddAccount, AddAccountModel, EmailValidator, HttpRequest, Validation } from './signup-protocols'

const makeFakeAccount = (): AccountModel => ({
  id: 'validId',
  name: 'validName',
  email: 'valid.email@email.com',
  password: 'validPassword'
})

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
  validationStub: Validation
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new AddAccountStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: object): Error|null {
      return null
    }
  }
  return new ValidationStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()

  const sut = new SignUpController(emailValidatorStub, addAccountStub, validationStub)

  return {
    sut,
    emailValidatorStub,
    addAccountStub,
    validationStub
  }
}

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {
    name: 'anyName',
    email: 'any.email@email.com',
    password: 'anyPassword',
    passwordConfirmation: 'anyPassword'
  }
})

describe('SignUp Controller', () => {
  test('should return 400 if no name is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'any.email@email.com',
        password: 'anyPassword',
        passwordConfirmation: 'anyPassword'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toStrictEqual(badRequest(new MissingParamError('name')))
  })

  test('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'anyName',
        password: 'anyPassword',
        passwordConfirmation: 'anyPassword'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toStrictEqual(badRequest(new MissingParamError('email')))
  })

  test('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'anyName',
        email: 'any.email@email.com',
        passwordConfirmation: 'anyPassword'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toStrictEqual(badRequest(new MissingParamError('password')))
  })

  test('should return 400 if no passwordConfirmation is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'anyName',
        email: 'any.email@email.com',
        password: 'anyPassword'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toStrictEqual(badRequest(new MissingParamError('passwordConfirmation')))
  })

  test('should return 400 if passwordConfirmation does not match provided password', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'anyName',
        email: 'any.email@email.com',
        password: 'anyPassword',
        passwordConfirmation: 'anyPassword1'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toStrictEqual(badRequest(new InvalidParamError('passwordConfirmation')))
  })

  test('should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(
      emailValidatorStub,
      'isValid'
    ).mockReturnValueOnce(false)

    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse).toStrictEqual(badRequest(new InvalidParamError('email')))
  })

  test('should call for EmailValidator with proper email from request body', async () => {
    const { sut, emailValidatorStub } = makeSut()

    const isValidSpy = jest.spyOn(
      emailValidatorStub,
      'isValid'
    )

    const httpRequest = makeFakeHttpRequest()

    await sut.handle(httpRequest)

    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
  })

  test('should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(
      emailValidatorStub,
      'isValid'
    ).mockImplementationOnce(() => { throw new Error() })

    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse).toStrictEqual(serverError(new Error()))
  })

  test('should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()

    jest.spyOn(
      addAccountStub,
      'add'
    ).mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error()))
    })

    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse).toStrictEqual(serverError(new Error()))
  })

  test('should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()

    const addSpy = jest.spyOn(addAccountStub, 'add')

    const httpRequest = makeFakeHttpRequest()

    await sut.handle(httpRequest)

    const { passwordConfirmation, ...accountData } = httpRequest.body

    expect(addSpy).toHaveBeenCalledWith(accountData)
  })

  test('should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse).toStrictEqual(ok(makeFakeAccount()))
  })

  test('should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()

    const validateSpy = jest.spyOn(validationStub, 'validate')

    const httpRequest = makeFakeHttpRequest()

    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
})
