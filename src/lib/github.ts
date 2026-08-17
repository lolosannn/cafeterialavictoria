// Reusable across projects: change these three constants for a new site
// and give the panel's PAT access to that repository — nothing else changes.
export const REPO_OWNER = 'lolosannn'
export const REPO_NAME = 'cafeterialavictoria'
export const BRANCH = 'main'

export const MENU_PATH = 'src/data/menu.json'
export const IMAGES_DIR = 'public/menu-images'

const API_BASE = 'https://api.github.com'

export class GitHubApiError extends Error {}

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = ''
  const chunkSize = 0x8000
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize))
  }
  return btoa(binary)
}

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64.replace(/\n/g, ''))
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

function textToBase64(text: string): string {
  return bytesToBase64(new TextEncoder().encode(text))
}

function base64ToText(base64: string): string {
  return new TextDecoder().decode(base64ToBytes(base64))
}

export async function fileToBase64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  return bytesToBase64(new Uint8Array(buffer))
}

/** Confirms the token is valid and can access this repository. Throws otherwise. */
export async function verifyToken(token: string): Promise<void> {
  const res = await fetch(`${API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}`, {
    headers: authHeaders(token),
  })
  if (!res.ok) {
    throw new GitHubApiError(
      'No se pudo verificar el token. Revisá que lo hayas copiado bien y que tenga permiso de "Contents: Read and write" sobre este repositorio.',
    )
  }
}

export async function getFile(
  token: string,
  path: string,
): Promise<{ content: string; sha: string } | null> {
  const res = await fetch(
    `${API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${BRANCH}`,
    { headers: authHeaders(token) },
  )
  if (res.status === 404) return null
  if (!res.ok) throw new GitHubApiError('No se pudo leer el archivo del repositorio.')
  const data = await res.json()
  return { content: base64ToText(data.content), sha: data.sha }
}

/** Creates or updates a text file. Returns the new blob sha. */
export async function putFile(
  token: string,
  path: string,
  content: string,
  message: string,
  sha?: string,
): Promise<string> {
  return putRaw(token, path, textToBase64(content), message, sha)
}

/** Creates a binary file (e.g. an image) from base64 content. */
export async function putBinaryFile(
  token: string,
  path: string,
  base64Content: string,
  message: string,
): Promise<void> {
  await putRaw(token, path, base64Content, message)
}

async function putRaw(
  token: string,
  path: string,
  base64Content: string,
  message: string,
  sha?: string,
): Promise<string> {
  const res = await fetch(`${API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, {
    method: 'PUT',
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, content: base64Content, sha, branch: BRANCH }),
  })
  if (!res.ok) {
    if (res.status === 409) {
      throw new GitHubApiError(
        'Alguien más guardó cambios justo antes que vos. Recargá la página e intentá de nuevo.',
      )
    }
    throw new GitHubApiError('No se pudieron guardar los cambios en GitHub.')
  }
  const data = await res.json()
  return data.content.sha as string
}
