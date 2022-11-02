import { AddAccountRepository } from '../../../../data/protocols/db/add-account-repository'
import { AccountModel } from '../../../../domain/models'
import { AddAccountModel } from '../../../../domain/usecases'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const { insertedId } = await (await MongoHelper.getCollection('accounts')).insertOne(accountData)
    return MongoHelper.map(insertedId, accountData)
  }
}
