export class SibraError {
  readonly id: string
  readonly message: string

  constructor(message: string) {
    this.message = message
    this.id = crypto.randomUUID()
  }
}
