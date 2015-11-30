export declare interface Functor<T> {
  map: <U>(f: (v: T) => U) => Functor<U>;
}

export class Some<T> implements Functor<T> {
  value: T;
  constructor(value: T) {
    this.value = value;
  }
  map<U>(f: (v: T) => U): Some<U> {
    return new Some(f(this.value));
  }
}

export class None<T> implements Functor<T> {
  map(f: (v: any) => any): None<any> {
    return this;
  }
}

export type Maybe<T> = Some<T> | None<T>;
export const some = <T>(v: T) => new Some<T>(v);
export const none = <T>() => new None<T>();
