import { DbAddAccount } from '../../data/usescases/add-account/db-add-account'
import { BCryptAdapter } from '../../infra/cryptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { SignUpController } from '../../presentation/controllers/signup/signup'
import { Controller } from '../../presentation/protocols'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { LogControllerDecorator } from '../decorators/log'

export const makeSignUpController = (): Controller => {
  const emailValidator = new EmailValidatorAdapter()

  const encryptAdapter = new BCryptAdapter(12)
  const addAccountRepository = new AccountMongoRepository()
  const addAccount = new DbAddAccount(encryptAdapter, addAccountRepository)

  const signUpController = new SignUpController(emailValidator, addAccount)

  return new LogControllerDecorator(signUpController)
}
