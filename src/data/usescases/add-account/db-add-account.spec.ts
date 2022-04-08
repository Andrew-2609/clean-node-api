import { DbAddAccount } from './db-add-account'
import { Encrypter } from './db-add-account-protocols'

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => resolve('hashedPassword'))
    }
  }

  return new EncrypterStub()
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const sut = new DbAddAccount(encrypterStub)

  return {
    sut,
    encrypterStub
  }
}

describe('DbAddAccount Usecase', () => {
  test('should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()

    const encryptSpy = jest.spyOn(
      encrypterStub,
      'encrypt'
    )

    const accountData = {
      name: 'validName',
      email: 'validEmail',
      password: 'validPassword'
    }

    await sut.add(accountData)

    expect(encryptSpy).toHaveBeenCalledWith(accountData.password)
  })

  test('should not handle thrown exception directly in Encrypter if it throws', async () => {
    const { sut, encrypterStub } = makeSut()

    jest.spyOn(
      encrypterStub,
      'encrypt'
    ).mockImplementation(async () => {
      return await new Promise((resolve, reject) => reject(new Error()))
    })

    const accountData = {
      name: 'validName',
      email: 'validEmail',
      password: 'validPassword'
    }

    const accountPromise = sut.add(accountData)

    await expect(accountPromise).rejects.toThrow()
  })
})
