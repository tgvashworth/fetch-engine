/// <reference path="../.d.test.ts" />

export class Result {
  static type: string;
  public type: string;
  public id: number;
  constructor(id: number) {
    this.id = id;
  }
}
export class Complete extends Result {
  static type: string = "complete";
  public type: string = "complete";
  public result: any;
  constructor(id: number, result: any) {
    super(id);
    this.result = result;
  }
}
export class Incomplete extends Result {
  static type: string = "incomplete";
  public type: string = "incomplete";
  public why: Error;
  constructor(id: number, why: Error) {
    super(id);
    this.why = why;
  }
}
