import { App, AppOptions } from "cdktf";
import { K3sStack } from 'src/k3s';

export class HomelabApp extends App {
  public readonly k3sStack: K3sStack;

  constructor(options?: AppOptions) {
    super(options);

    this.k3sStack = new K3sStack(this, "k3s");
  }
}
