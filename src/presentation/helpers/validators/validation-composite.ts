import { Validation } from './validation'

export class ValidationComposite implements Validation {
  private readonly validations: Validation[]

  constructor (validations: Validation[]) {
    this.validations = validations
  }

  validate (input: object): Error | null {
    this.validations.forEach(v => {
      const error = v.validate(input)
      if (error) return error
    })

    return null
  }
}
