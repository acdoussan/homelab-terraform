import { App, AppOptions } from "cdktf";
import { K8sStack } from 'src/k8s';

export class HomelabApp extends App {
  public readonly k8sStack: K8sStack;

  constructor(options?: AppOptions) {
    super(options);

    this.k8sStack = new K8sStack(this, "k8s");
  }
}
