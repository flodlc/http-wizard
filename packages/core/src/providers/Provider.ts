export interface TypeProvider {
  readonly input: unknown;
  readonly output: unknown;
}

export type CallTypeProvider<I, F extends TypeProvider> = (F & {
  input: I;
})['output'];
