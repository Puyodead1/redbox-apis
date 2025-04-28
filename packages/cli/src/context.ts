import { KeyService } from "@redbox-apis/common";

export default class Context {
  constructor(public readonly keyService: KeyService) {}
}
