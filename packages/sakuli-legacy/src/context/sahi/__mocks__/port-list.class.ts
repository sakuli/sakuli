export class PortList {
  private ports: number[] = [];

  blockPort(port: number) {
    this.ports.push(port);
  }

  realesePort(port: number) {
    this.ports = this.ports.filter((p) => p !== port);
  }

  isBlocked(port: number) {
    return this.ports.includes(port);
  }
}

export const blockedPorts = new PortList();
