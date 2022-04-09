import { DbAddAccount } from './db-add-account'
import { AccountModel, AddAccountModel, AddAccountRepository, Encrypter } from './db-add-account-protocols'

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => resolve('hashedPassword'))
    }
  }

  return new EncrypterStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'validId',
        name: 'validName',
        email: 'validEmail',
        password: 'hashedPassword'
      }
      return await new Promise(resolve => resolve(fakeAccount))
    }
  }

  return new AddAccountRepositoryStub()
}

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)

  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub
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

  test('should call AddAccountRepository with correct data', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()

    const addSpy = jest.spyOn(
      addAccountRepositoryStub,
      'add'
    )

    const accountData = {
      name: 'validName',
      email: 'validEmail',
      password: 'validPassword'
    }

    await sut.add(accountData)

    expect(addSpy).toHaveBeenCalledWith(Object.assign({}, accountData, { password: 'hashedPassword' }))
  })

  test('should not handle thrown exception directly in AddAccountRepository if it throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()

    jest.spyOn(
      addAccountRepositoryStub,
      'add'
    ).mockImplementationOnce(async () => {
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
