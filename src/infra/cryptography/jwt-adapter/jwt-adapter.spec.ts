import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return await new Promise((resolve) => resolve('anyToken'))
  }
}))

describe('Jwt Adapter', () => {
  test('should call sign with the correct parameters', async () => {
    const sut = new JwtAdapter('secret')

    const signSpy = jest.spyOn(jwt, 'sign')

    await sut.encrypt('anyId')

    expect(signSpy).toHaveBeenCalledWith({ id: 'anyId' }, 'secret')
  })

  test('should return a token on sign success', async () => {
    const sut = new JwtAdapter('secret')
    const accessToken = await sut.encrypt('anyId')
    expect(accessToken).toBe('anyToken')
  })

  test('should not handle thrown exception directly in JwtAdapter if it throws', async () => {
    const sut = new JwtAdapter('secret')

    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => { throw new Error() })

    const promise = sut.encrypt('anyId')

    await expect(promise).rejects.toThrow()
  })
})
