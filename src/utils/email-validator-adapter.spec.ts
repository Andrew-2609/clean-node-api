import validator from 'validator'
import { EmailValidatorAdapter } from './email-validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

describe('EmailValidator Adapter', () => {
  test('should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()

    jest.spyOn(
      validator,
      'isEmail'
    ).mockReturnValueOnce(false)

    const isValid = sut.isValid('invalidEmail@mail.com')

    expect(isValid).toBe(false)
  })

  test('should return true if validator returns true', () => {
    const sut = new EmailValidatorAdapter()

    const isValid = sut.isValid('validEmail@mail.com')

    expect(isValid).toBe(true)
  })
})
