export type BaseReturnType<T> = {
  hasError: boolean;
  errorMessage: string | null;
  data: T | null;
};
