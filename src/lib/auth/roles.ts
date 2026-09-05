import type { UserRole } from '@/src/lib/db/models';

export function isTrustedRole(role: UserRole): boolean {
  return role === 'admin' || role === 'editor';
}
