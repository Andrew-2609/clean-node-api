import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('should return an account on success', async () => {
    const sut = new AccountMongoRepository()

    const account = await sut.add({
      name: 'anyName',
      email: 'anyEmail@email.com',
      password: 'anyPassword'
    })

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('anyName')
    expect(account.email).toBe('anyEmail@email.com')
    expect(account.password).toBe('anyPassword')
  })
})
