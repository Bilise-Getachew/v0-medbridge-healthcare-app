// Demo authentication - NOT for production use
const DEMO_CREDENTIALS = {
  username: "admin",
  password: "1234",
};

const AUTH_KEY = "medbridge_auth";

export interface AuthUser {
  username: string;
  loggedInAt: string;
}

export function login(username: string, password: string): boolean {
  if (username === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password) {
    const user: AuthUser = {
      username,
      loggedInAt: new Date().toISOString(),
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return true;
  }
  return false;
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function getAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(AUTH_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as AuthUser;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getAuthUser() !== null;
}
