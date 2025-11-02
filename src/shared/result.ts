export type Result<T, E> = Ok<T> | Err<E>;

export class Ok<T> {
  readonly isOk = true;
  readonly isErr = false;
  constructor(public readonly value: T) {}
}

export class Err<E> {
  readonly isOk = false;
  readonly isErr = true;
  constructor(public readonly error: E) {}
}

// helpers
export const ok = <T>(value: T): Result<T, never> => new Ok(value);
export const err = <E>(error: E): Result<never, E> => new Err(error);

export const isOk = <T, E>(result: Result<T, E>): result is Ok<T> =>
  result.isOk;
export const isErr = <T, E>(result: Result<T, E>): result is Err<E> =>
  result.isErr;
