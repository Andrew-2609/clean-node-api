import validator from 'validator'
import { EmailValidatorAdapter } from './email-validator-adapter'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('EmailValidator Adapter', () => {
  test('should return false if validator returns false', () => {
    const sut = makeSut()

    jest.spyOn(
      validator,
      'isEmail'
    ).mockReturnValueOnce(false)

    const isValid = sut.isValid('invalidEmail@mail.com')

    expect(isValid).toBe(false)
  })

  test('should return true if validator returns true', () => {
    const sut = makeSut()

    const isValid = sut.isValid('validEmail@mail.com')

    expect(isValid).toBe(true)
  })

  test('should call EmailValidator with correct email', () => {
    const sut = makeSut()

    const isEmailSpy = jest.spyOn(
      validator,
      'isEmail'
    )

    sut.isValid('anyEmail@mail.com')

    expect(isEmailSpy).toHaveBeenCalledWith('anyEmail@mail.com')
  })
})
