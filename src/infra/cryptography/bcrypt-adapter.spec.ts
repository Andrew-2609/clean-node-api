import bcrypt from 'bcrypt'
import { BCryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hash'))
  }
}))

describe('BCrypt Adapter', () => {
  test('should call bcrypt with correct values', async () => {
    const salt = 12
    const sut = new BCryptAdapter(salt)

    const hashSpy = jest.spyOn(
      bcrypt,
      'hash'
    )

    await sut.encrypt('anyValue')

    expect(hashSpy).toHaveBeenCalledWith('anyValue', salt)
  })

  test('should return hashed value on success', async () => {
    const salt = 12
    const sut = new BCryptAdapter(salt)

    const hash = await sut.encrypt('anyValue')

    expect(hash).toBe('hash')
  })
})
