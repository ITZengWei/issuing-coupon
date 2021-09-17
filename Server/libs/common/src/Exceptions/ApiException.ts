import { HttpException, HttpStatus } from '@nestjs/common'


export class ApiException extends HttpException {
  private errorMessage: string
  // private errorCode

  constructor(errorMessage, errorStatusCode) {
    super(errorMessage, errorStatusCode)
    console.log('进来了', errorMessage, errorStatusCode)
    this.errorMessage = errorMessage
  }

  getErrorMessage(): string {
    return this.errorMessage;
  }
}