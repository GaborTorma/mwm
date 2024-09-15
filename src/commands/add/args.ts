import { getStringArg } from '../../utils/args'

export async function getUrl(url: string) {
  return getStringArg(url, 'Enter the url of the repo')
}

export async function getDir(dir: string) {
  return getStringArg(dir, 'Enter the dir of the new repo')
}
