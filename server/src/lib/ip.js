import os from "os";

export function getLocalIp() {
  const interfaces = os.networkInterfaces();

  for (let name of Object.keys(interfaces)) {
    for (let item of interfaces[name]) {
      if (item.family === "IPv4" && !item.internal) {
        return item.address;
      }
    }
  }

  return "localhost";
}
