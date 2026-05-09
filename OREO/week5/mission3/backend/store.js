const users = new Map()
const refreshTokens = new Set()

let nextId = 1

export function findUserByEmail(email) {
  return users.get(email) ?? null
}

export function findUserById(id) {
  for (const u of users.values()) {
    if (u.id === id) return u
  }
  return null
}

export function createUser({ email, password, name, provider = 'local' }) {
  const user = { id: nextId++, email, password, name, provider }
  users.set(email, user)
  return user
}

export function upsertGoogleUser({ email, name }) {
  const existing = users.get(email)
  if (existing) return existing
  return createUser({ email, password: null, name, provider: 'google' })
}

export function registerRefreshToken(token) {
  refreshTokens.add(token)
}

export function isRefreshTokenActive(token) {
  return refreshTokens.has(token)
}

export function revokeRefreshToken(token) {
  refreshTokens.delete(token)
}

createUser({
  email: 'umc@umc.com',
  password: '1234',
  name: '오레오',
})
