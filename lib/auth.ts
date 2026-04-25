// Demo authentication - NOT for production use

export type UserRole = "patient" | "doctor";

const DEMO_CREDENTIALS = [
  { username: "patient", password: "1234", role: "patient" as UserRole, name: "John Smith" },
  { username: "doctor", password: "1234", role: "doctor" as UserRole, name: "Dr. Sarah Johnson" },
];

const AUTH_KEY = "medbridge_auth";

export interface AuthUser {
  username: string;
  name: string;
  role: UserRole;
  loggedInAt: string;
}

export function login(username: string, password: string): AuthUser | null {
  const user = DEMO_CREDENTIALS.find(
    (cred) => cred.username === username && cred.password === password
  );
  
  if (user) {
    const authUser: AuthUser = {
      username: user.username,
      name: user.name,
      role: user.role,
      loggedInAt: new Date().toISOString(),
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
    return authUser;
  }
  return null;
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

export function getUserRole(): UserRole | null {
  const user = getAuthUser();
  return user?.role || null;
}
