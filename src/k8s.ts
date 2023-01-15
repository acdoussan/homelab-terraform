import { Construct } from "constructs";
import { TerraformStack } from "cdktf";
import { Lxc } from "gen/providers/proxmox/lxc";
import { ProxmoxProvider } from 'gen/providers/proxmox/provider';

export class K8sStack extends TerraformStack {
  public readonly proxmoxProvider: ProxmoxProvider;
  public readonly test: Lxc;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.proxmoxProvider = new ProxmoxProvider(this, 'proxmox-provider', {
      pmApiUrl: process.env.PM_API_URL!,
      pmUser: process.env.PM_USER!,
      pmPassword: process.env.PM_PASSWORD!,
    });

    this.test = new Lxc(this, 'lxc-test', {
      cores: 2,
      memory: 2048,
      rootfs: {
        size: '20G',
        storage: 'local',
      },
      features: {
        nesting: true,
      },
      hostname: "terraform-new-container",
      network: [
        {
          name: "eth0",
          bridge: "vmbr0",
          ip: "dhcp",
        }
      ],
      ostemplate: "truenas-nfs-hdd:vztmpl/ubuntu-22.10-standard_22.10-1_amd64.tar.zst",
      password: process.env.PM_LXC_PASSWORD!,
      targetNode: "r720",
      unprivileged: true,
      start: true,
    });
  }
}
