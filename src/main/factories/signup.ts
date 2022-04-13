import { DbAddAccount } from '../../data/usescases/add-account/db-add-account'
import { BCryptAdapter } from '../../infra/cryptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { SignUpController } from '../../presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'

export const makeSignUpController = (): SignUpController => {
  const emailValidator = new EmailValidatorAdapter()

  const encryptAdapter = new BCryptAdapter(12)
  const addAccountRepository = new AccountMongoRepository()
  const addAccount = new DbAddAccount(encryptAdapter, addAccountRepository)

  return new SignUpController(emailValidator, addAccount)
}
