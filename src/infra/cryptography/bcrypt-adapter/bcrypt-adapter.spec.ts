import bcrypt from 'bcrypt'
import { BCryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hash'))
  }
}))

const salt = 12
const makeSut = (): BCryptAdapter => {
  return new BCryptAdapter(salt)
}

describe('BCrypt Adapter', () => {
  test('should call bcrypt with correct values', async () => {
    const sut = makeSut()

    const hashSpy = jest.spyOn(
      bcrypt,
      'hash'
    )

    await sut.encrypt('anyValue')

    expect(hashSpy).toHaveBeenCalledWith('anyValue', salt)
  })

  test('should return hashed value on success', async () => {
    const sut = makeSut()

    const hash = await sut.encrypt('anyValue')

    expect(hash).toBe('hash')
  })

  test('should not handle thrown exception directly in BCryptAdapter if it throws', async () => {
    const sut = makeSut()

    jest.spyOn(
      sut,
      'encrypt'
    ).mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error()))
    })

    const hashPromise = sut.encrypt('anyValue')

    await expect(hashPromise).rejects.toThrow()
  })
})
