import { DbAddAccount } from './db-add-account'
import { AccountModel, AddAccountModel, AddAccountRepository, Encrypter } from './db-add-account-protocols'

const makeFakeAccount = (): AccountModel => ({
  id: 'validId',
  name: 'validName',
  email: 'validEmail',
  password: 'hashedPassword'
})

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
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }

  return new AddAccountRepositoryStub()
}

const makeFakeAccountData = (): AddAccountModel => ({
  name: 'validName',
  email: 'validEmail',
  password: 'validPassword'
})

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

    await sut.add(makeFakeAccountData())

    expect(encryptSpy).toHaveBeenCalledWith(makeFakeAccountData().password)
  })

  test('should not handle thrown exception directly in Encrypter if it throws', async () => {
    const { sut, encrypterStub } = makeSut()

    jest.spyOn(
      encrypterStub,
      'encrypt'
    ).mockImplementation(async () => {
      return await new Promise((resolve, reject) => reject(new Error()))
    })

    const accountPromise = sut.add(makeFakeAccountData())

    await expect(accountPromise).rejects.toThrow()
  })

  test('should call AddAccountRepository with correct data', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()

    const addSpy = jest.spyOn(
      addAccountRepositoryStub,
      'add'
    )

    await sut.add(makeFakeAccountData())

    expect(addSpy).toHaveBeenCalledWith(Object.assign({}, makeFakeAccountData(), { password: 'hashedPassword' }))
  })

  test('should not handle thrown exception directly in AddAccountRepository if it throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()

    jest.spyOn(
      addAccountRepositoryStub,
      'add'
    ).mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error()))
    })

    const accountPromise = sut.add(makeFakeAccountData())

    await expect(accountPromise).rejects.toThrow()
  })

  test('should return an account on success', async () => {
    const { sut } = makeSut()

    const account = await sut.add(makeFakeAccountData())

    expect(account).toStrictEqual(makeFakeAccount())
  })
})
