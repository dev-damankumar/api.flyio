export class GQLError extends Error {
  extensions: {
    code: string;
  };

  constructor(message: string, code: string) {
    super(message);

    Object.setPrototypeOf(this, GQLError.prototype);

    this.extensions = {
      code,
    };
  }
}
