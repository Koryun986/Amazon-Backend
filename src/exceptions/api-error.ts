export class ApiError extends Error {
  status: number;
  errors: Error[];

  constructor(status: number, message: string, errors: Error[] = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError() {
    return new ApiError(401, "Un Authorized Error")
  }

  static BadRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }
}