import { Envs } from "./env";

export function getApiUrl(path: string) {
  return new URL(`/api/${path}`, Envs.apiUrl);
}
