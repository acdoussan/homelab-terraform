import { Construct } from "constructs";
import { TerraformStack } from "cdktf";
import { Lxc } from "gen/providers/proxmox/lxc";
import { ProxmoxProvider } from 'gen/providers/proxmox/provider';

export class K8sStack extends TerraformStack {
  public readonly proxmoxProvider: ProxmoxProvider;
  public readonly nodes: Record<string, Lxc> = {};

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.proxmoxProvider = new ProxmoxProvider(this, 'proxmox-provider', {
      pmApiUrl: process.env.PM_API_URL!,
      pmUser: process.env.PM_USER!,
      pmPassword: process.env.PM_PASSWORD!,
    });

    const nodes = {
      'k8s-ctrl-1': {
        vmid: 200,
        cores: 2,
        memory: 2048,
        network: [
          {
            name: "eth0",
            bridge: "vmbr0",
            ip: "dhcp",
            hwaddr: '1E:88:40:19:F2:7B',
          },
        ],
        targetNode: 'hp1',
      },
      'k8s-ctrl-2': {
        vmid: 201,
        cores: 2,
        memory: 2048,
        network: [
          {
            name: "eth0",
            bridge: "vmbr0",
            ip: "dhcp",
            hwaddr: 'DE:FC:7E:CC:24:6B',
          },
        ],
        targetNode: 'hp2',
      },
      'k8s-ctrl-3': {
        vmid: 202,
        cores: 2,
        memory: 2048,
        network: [
          {
            name: "eth0",
            bridge: "vmbr0",
            ip: "dhcp",
            hwaddr: 'D2:B0:2B:08:2B:0E',
          },
        ],
        targetNode: 'r720',
      },
      'k8s-wkr-1': {
        vmid: 203,
        cores: 2,
        memory: 4096,
        network: [
          {
            name: "eth0",
            bridge: "vmbr0",
            ip: "dhcp",
            hwaddr: 'EA:E3:F9:60:9F:17',
          },
        ],
        targetNode: 'hp1',
      },
      'k8s-wkr-2': {
        vmid: 204,
        cores: 2,
        memory: 4096,
        network: [
          {
            name: "eth0",
            bridge: "vmbr0",
            ip: "dhcp",
            hwaddr: 'B6:C1:ED:17:AF:39',
          },
        ],
        targetNode: 'hp2',
      },
      'k8s-wkr-3': {
        vmid: 205,
        cores: 16,
        memory: 1024 * 20, // 20gb
        network: [
          {
            name: "eth0",
            bridge: "vmbr0",
            ip: "dhcp",
            hwaddr: '12:2D:5A:93:08:9C',
          },
        ],
        targetNode: 'r720',
      },
    };

    for (const [hostname, config] of Object.entries(nodes)) {
      this.nodes[hostname] = new Lxc(this, `lxc-${hostname}`, {
        rootfs: {
          size: '20G',
          storage: 'local',
        },
        features: {
          nesting: true,
        },
        ostemplate: "truenas-nfs-hdd:vztmpl/ubuntu-22.10-standard_22.10-1_amd64.tar.zst",
        password: process.env.PM_LXC_PASSWORD!,
        unprivileged: true,
        start: true,
        onboot: true,
        sshPublicKeys: process.env.PM_LXC_PUBLIC_SSH_KEY!,
        hostname,
        ...config,
      });
    }
  }
}
