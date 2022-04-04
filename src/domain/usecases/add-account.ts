import { AccountModel } from '../models'

export interface AddAccountModel {
  name: string
  emai: string
  password: string
}

export interface AddAccount {
  add: (account: AddAccountModel) => AccountModel
}
