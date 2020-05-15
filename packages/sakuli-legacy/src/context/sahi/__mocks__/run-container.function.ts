import Docker from "dockerode";
import { findPort } from "./find-port.function";

const docker = new Docker({
  socketPath: "/var/run/docker.sock",
});

export interface SimpleRunOptions {
  ports?: number[];
  localMounts?: [string, string][];
}

export interface RunContainer {
  getMappedPort(p: number): number;

  start(): Promise<void>;

  stop(): Promise<void>;

  getIP(): Promise<string>;

  container: Docker.Container;
}

let assignedPorts: number[] = [];

export async function runContainer(
  image: string,
  { ports = [], localMounts = [] }: SimpleRunOptions,
  command: string[] = [],
  waitStrategy: () => Promise<void> = Promise.resolve.bind(Promise)
): Promise<RunContainer> {
  const ExposedPorts = ports.reduce(
    (ep, p) => ({ ...ep, [`${p}/tcp`]: {} }),
    {}
  );
  const portMapping = await Promise.all(
    ports.map(async (p) => {
      const hostPort = await findPort(p, 65535, "127.0.0.1", assignedPorts);
      assignedPorts.push(hostPort);
      return [p, hostPort];
    })
  );
  const PortBindings = portMapping.reduce((pb, [containerPort, HostPort]) => {
    return {
      ...pb,
      [`${containerPort}/tcp`]: [{ HostPort: HostPort.toString() }],
    };
  }, {});
  const Binds = localMounts.map(([local, cont]) => `${local}:${cont}`);

  function getMappedPort(port: number) {
    const mapping = portMapping.find(([container]) => port === container);
    return mapping?.[1]!;
  }
  try {
    const container = await docker.createContainer({
      Image: image,
      Tty: true,
      ExposedPorts,
      HostConfig: {
        Binds,
        PortBindings,
      },
    });
    return {
      getMappedPort,
      async start() {
        await container.start();
        await waitStrategy();
      },
      async stop() {
        await container.stop();
        await container.remove();
        ports.forEach((port) => {
          const toRemove = getMappedPort(port);
          assignedPorts = assignedPorts.filter((p) => p !== toRemove);
        });
      },
      async getIP() {
        return (await container.inspect({})).NetworkSettings.IPAddress;
      },
      container,
    };
  } catch (e) {
    throw Error("Cannot start container " + image);
  }
}
