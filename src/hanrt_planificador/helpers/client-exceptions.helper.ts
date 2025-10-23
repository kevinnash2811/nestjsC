import { HanrtPlanificadorEntity } from "../entities";

export class ClientException extends Error {
  public readonly isClientError: boolean = true;
  public readonly statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.name = 'ClientException';
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, ClientException.prototype);
  }
}