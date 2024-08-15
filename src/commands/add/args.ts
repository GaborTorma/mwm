import { getArg } from '../../utils/args'

export async function getUrl(url: string) {
  return getArg(url, 'Enter the url of the repo')
}

export async function getDir(dir: string) {
  return getArg(dir, 'Enter the dir of the new repo')
}
