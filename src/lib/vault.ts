// Stores the admin's GitHub token in this browser, encrypted with a password
// only the owner knows. Nothing is ever sent anywhere except GitHub's own API.
const STORAGE_KEY = 'cafe-admin-vault-v1'
const PBKDF2_ITERATIONS = 250_000

type StoredVault = { salt: string; iv: string; cipher: string }

function bytesToBase64(bytes: Uint8Array): string {
  let binary = ''
  bytes.forEach((b) => (binary += String.fromCharCode(b)))
  return btoa(binary)
}

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64)
  return Uint8Array.from(binary, (c) => c.charCodeAt(0))
}

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveKey'],
  )
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt as BufferSource, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

export function hasStoredVault(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== null
}

export async function saveVault(token: string, password: string): Promise<void> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKey(password, salt)
  const cipherBuf = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv as BufferSource },
    key,
    new TextEncoder().encode(token),
  )
  const vault: StoredVault = {
    salt: bytesToBase64(salt),
    iv: bytesToBase64(iv),
    cipher: bytesToBase64(new Uint8Array(cipherBuf)),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vault))
}

/** Decrypts and returns the stored token, or throws if the password is wrong. */
export async function unlockVault(password: string): Promise<string> {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) throw new Error('No hay ningún acceso configurado en este navegador.')
  const vault: StoredVault = JSON.parse(raw)
  const key = await deriveKey(password, base64ToBytes(vault.salt))
  try {
    const plainBuf = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: base64ToBytes(vault.iv) as BufferSource },
      key,
      base64ToBytes(vault.cipher) as BufferSource,
    )
    return new TextDecoder().decode(plainBuf)
  } catch {
    throw new Error('Contraseña incorrecta.')
  }
}

export function clearVault(): void {
  localStorage.removeItem(STORAGE_KEY)
}
