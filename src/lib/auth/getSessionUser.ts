import { cookies } from 'next/headers';
import { SESSION_COOKIE, verifySession, type SessionPayload } from './session';

export async function getSessionUser(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}
