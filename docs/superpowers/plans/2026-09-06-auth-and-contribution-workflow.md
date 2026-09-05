# Auth, Contribution-Aware Wiki Editor, Live Public Site, Site Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship real authentication, turn the Wiki Page editor into a
contribution-aware workflow (admin/editor publish directly; contributor/
reader submissions go through a review queue with admin preview), wire the
public site to real MongoDB data instead of mock arrays, and add a
block-based editor for standalone site pages (About, etc.).

**Architecture:** Custom credentials auth (bcryptjs + `jose` JWT in an
httpOnly cookie) gates a role check (`admin`/`editor` = trusted,
`contributor`/`reader` = review-gated) that's threaded through the existing
`Page`/`Wiki`/`Revision` block-editor stack already built for the Wiki Page
feature. Three new live-data block types plus a `renderOverride` hook on
the existing block renderer let one wiki "cover page" (a normal `Page`
document) replace the hand-built wiki hub route. Homepage sections swap
their mock arrays for server-fetched props with no interaction changes.
Site pages reuse the same `Page`/block/editor machinery with `wiki` made
optional.

**Tech Stack:** Next.js 16 (App Router, Server Components, async
`params`/`cookies()`), Mongoose 9, `bcryptjs` + `jose` (new deps), existing
`dnd-kit` block editor, TipTap text editor, Tailwind v4 theme tokens in
`app/globals.css`.

**Spec:** `docs/superpowers/specs/2026-09-06-auth-and-contribution-workflow-design.md`

## Global Constraints

- Custom auth only — bcryptjs (password hashing, Node runtime only) +
  `jose` (JWT sign/verify, Edge-safe so `middleware.ts` can use it) — no
  NextAuth.
- Reuse the existing `NEXTAUTH_SECRET` value already in `.env.local` as the
  JWT signing secret — no new env var.
- Never trust a client-supplied `role` on registration — always `'reader'`.
- Role trust check used everywhere: `admin`/`editor` = trusted (direct
  publish); `contributor`/`reader` = review-gated. One shared helper
  (`isTrustedRole`), never re-implemented per route.
- No test framework exists in this repo (`package.json` has no
  jest/vitest). Follow the project's established verification convention
  (see `PROGRESS.md`'s "Verified end-to-end against local MongoDB" notes):
  every task is verified by running `npx tsc --noEmit` (type safety) plus
  exercising the real flow against the local dev server + local MongoDB
  (curl for APIs, manual browser check for UI), not by writing new unit
  tests.
- All new UI uses the existing theme tokens/utility classes already in
  `app/globals.css` (`card`, `btn btn-primary`, `btn btn-secondary`,
  `ad-zone`, etc.) and existing components (`ImagePicker`, admin card-grid
  patterns) — no new hardcoded colors, no new design system.
- `getSystemAuthorId()` (`src/lib/db/getSystemAuthor.ts`) is a placeholder
  that Task 5 deletes — every one of its 6 call sites must be migrated
  first (Tasks 1-5 track this explicitly; do not delete until all are
  done).

---

## Phase A — Auth

### Task 1: Password + session utilities

**Files:**
- Create: `src/lib/auth/password.ts`
- Create: `src/lib/auth/session.ts`
- Create: `src/lib/auth/getSessionUser.ts`
- Create: `src/lib/auth/roles.ts`
- Modify: `package.json` (add `bcryptjs`, `jose`)

**Interfaces:**
- Produces: `hashPassword(plain: string): Promise<string>`,
  `verifyPassword(plain: string, hash: string): Promise<boolean>` (from
  `password.ts`).
- Produces: `SESSION_COOKIE: string`, `SessionPayload { sub: string; role:
  UserRole }`, `signSession(payload: SessionPayload): Promise<string>`,
  `verifySession(token: string): Promise<SessionPayload | null>` (from
  `session.ts`). Must have **zero Node-only imports** (no bcryptjs) so
  Task 3's Edge middleware can import it directly.
- Produces: `getSessionUser(): Promise<SessionPayload | null>` (from
  `getSessionUser.ts`, Node runtime only — uses `next/headers` `cookies()`).
- Produces: `isTrustedRole(role: UserRole): boolean` (from `roles.ts`).

- [ ] **Step 1: Install dependencies**

```bash
npm install bcryptjs jose
```

- [ ] **Step 2: Write `src/lib/auth/password.ts`**

```ts
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
```

- [ ] **Step 3: Write `src/lib/auth/session.ts`**

```ts
import { SignJWT, jwtVerify } from 'jose';
import type { UserRole } from '@/src/lib/db/models';

// No Node-only imports here (no bcryptjs) — middleware.ts runs on the Edge
// runtime and imports this file directly to verify sessions.
export const SESSION_COOKIE = 'session';
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 days

export interface SessionPayload {
  sub: string;
  role: UserRole;
}

function getSecretKey() {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error('NEXTAUTH_SECRET is not set');
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ role: payload.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (typeof payload.sub !== 'string' || typeof payload.role !== 'string') return null;
    return { sub: payload.sub, role: payload.role as UserRole };
  } catch {
    return null;
  }
}

export const SESSION_MAX_AGE_SECONDS = SESSION_DURATION_SECONDS;
```

- [ ] **Step 4: Write `src/lib/auth/getSessionUser.ts`**

```ts
import { cookies } from 'next/headers';
import { SESSION_COOKIE, verifySession, type SessionPayload } from './session';

export async function getSessionUser(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}
```

- [ ] **Step 5: Write `src/lib/auth/roles.ts`**

```ts
import type { UserRole } from '@/src/lib/db/models';

export function isTrustedRole(role: UserRole): boolean {
  return role === 'admin' || role === 'editor';
}
```

- [ ] **Step 6: Verify with a throwaway script**

Run (from repo root, after setting a real `NEXTAUTH_SECRET` value in
`.env.local` — the placeholder `your-secret-key-change-in-production` works
fine for local dev, just confirm it's non-empty):

```bash
node -e "
require('dotenv').config({ path: '.env.local' });
const { SignJWT, jwtVerify } = require('jose');
(async () => {
  const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
  const token = await new SignJWT({ role: 'admin' }).setProtectedHeader({ alg: 'HS256' }).setSubject('abc123').setExpirationTime('7d').sign(secret);
  const { payload } = await jwtVerify(token, secret);
  console.log('OK', payload.sub, payload.role);
})();
"
```

Expected: `OK abc123 admin` (if `dotenv` isn't available, hardcode a test
secret string in the script instead of loading `.env.local`).

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json src/lib/auth
git commit -m "feat(auth): add password hashing and JWT session utilities

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01YT5MVaXncBzHesYjjtXSom"
```

---

### Task 2: Auth API routes (register, login, logout, me)

**Files:**
- Create: `app/api/auth/register/route.ts`
- Create: `app/api/auth/login/route.ts`
- Create: `app/api/auth/logout/route.ts`
- Create: `app/api/auth/me/route.ts`

**Interfaces:**
- Consumes: `hashPassword`, `verifyPassword` from Task 1's `password.ts`;
  `signSession`, `SESSION_COOKIE`, `SESSION_MAX_AGE_SECONDS` from
  `session.ts`; `getSessionUser` from `getSessionUser.ts`; `User` model
  from `@/src/lib/db/models`; `connectDB` from `@/src/lib/db/connection`.
- Produces: `POST /api/auth/register` and `POST /api/auth/login` both
  return `{ user: { id, name, email, role } }` and set the session cookie.
  `POST /api/auth/logout` clears it. `GET /api/auth/me` returns `{ user:
  {...} | null }`.

- [ ] **Step 1: Write `app/api/auth/register/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { User } from '@/src/lib/db/models';
import { hashPassword } from '@/src/lib/auth/password';
import { signSession, SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from '@/src/lib/auth/session';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const email: string = (body.email ?? '').trim().toLowerCase();
  const password: string = body.password ?? '';
  const name: string = (body.name ?? '').trim();

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
  }
  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }
  if (await User.exists({ email })) {
    return NextResponse.json({ error: 'An account with that email already exists' }, { status: 409 });
  }

  // role is always 'reader' on self-registration — never trust client input here.
  const user = await User.create({
    email,
    password: await hashPassword(password),
    name,
    role: 'reader',
  });

  const token = await signSession({ sub: user._id.toString(), role: user.role });
  const res = NextResponse.json(
    { user: { id: user._id, name: user.name, email: user.email, role: user.role } },
    { status: 201 }
  );
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return res;
}
```

- [ ] **Step 2: Write `app/api/auth/login/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { User } from '@/src/lib/db/models';
import { verifyPassword } from '@/src/lib/auth/password';
import { signSession, SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from '@/src/lib/auth/session';

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const email: string = (body.email ?? '').trim().toLowerCase();
  const password: string = body.password ?? '';

  const user = await User.findOne({ email });
  if (!user || !(await verifyPassword(password, user.password))) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }
  if (!user.isActive) {
    return NextResponse.json({ error: 'This account has been deactivated' }, { status: 403 });
  }

  user.lastLogin = new Date();
  await user.save();

  const token = await signSession({ sub: user._id.toString(), role: user.role });
  const res = NextResponse.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return res;
}
```

- [ ] **Step 3: Write `app/api/auth/logout/route.ts`**

```ts
import { NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/src/lib/auth/session';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, '', { path: '/', maxAge: 0 });
  return res;
}
```

- [ ] **Step 4: Write `app/api/auth/me/route.ts`**

```ts
import { NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { User } from '@/src/lib/db/models';
import { getSessionUser } from '@/src/lib/auth/getSessionUser';

export async function GET() {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ user: null });

  await connectDB();
  const user = await User.findById(session.sub).select('name email role avatar preferences');
  if (!user) return NextResponse.json({ user: null });

  return NextResponse.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, preferences: user.preferences },
  });
}
```

- [ ] **Step 5: Verify against the running dev server**

Start the dev server if it isn't already running (`npm run dev`), MongoDB
must be running locally, then:

```bash
curl -i -c cookies.txt -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"tester@example.com","password":"password123","name":"Tester"}'
```

Expected: `201`, JSON body with `user.role: "reader"`, and a `Set-Cookie:
session=...` header.

```bash
curl -s -b cookies.txt http://localhost:3000/api/auth/me
```

Expected: `{"user":{"id":"...","name":"Tester","email":"tester@example.com","role":"reader",...}}`.

```bash
curl -i -X POST http://localhost:3000/api/auth/logout -b cookies.txt -c cookies.txt
curl -s -b cookies.txt http://localhost:3000/api/auth/me
```

Expected: logout returns `200`; the follow-up `me` call returns
`{"user":null}`. Also confirm duplicate registration is rejected:

```bash
curl -s -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" \
  -d '{"email":"tester@example.com","password":"password123","name":"Tester"}'
```

Expected: `409` with an error message. Clean up `cookies.txt` when done
(`rm cookies.txt`).

- [ ] **Step 6: Commit**

```bash
git add app/api/auth
git commit -m "feat(auth): add register/login/logout/me API routes

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01YT5MVaXncBzHesYjjtXSom"
```

---

### Task 3: Route protection middleware

**Files:**
- Create: `middleware.ts` (repo root, alongside `package.json`)

**Interfaces:**
- Consumes: `SESSION_COOKIE`, `verifySession` from Task 1's `session.ts`.

- [ ] **Step 1: Write `middleware.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE, verifySession } from '@/src/lib/auth/session';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySession(token) : null;

  if (!session) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('next', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  if (session.role !== 'admin' && session.role !== 'editor') {
    return NextResponse.redirect(new URL('/', req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
```

- [ ] **Step 2: Verify**

With no session cookie:

```bash
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" http://localhost:3000/admin
```

Expected: `307` (or `308`) redirecting to a URL containing `/login?next=%2Fadmin`.

Register+login as a `reader` (Task 2), then request `/admin` with that
cookie — expect a redirect to `/`. This step will fully pass once Task 6
promotes a real admin user; for now confirm the redirect behavior for both
the no-session and wrong-role cases using the `reader` account from Task
2's verification.

- [ ] **Step 3: Commit**

```bash
git add middleware.ts
git commit -m "feat(auth): protect /admin routes with session + role middleware

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01YT5MVaXncBzHesYjjtXSom"
```

---

### Task 4: Public Login/Register pages

**Files:**
- Create: `app/(site)/login/page.tsx`
- Create: `app/(site)/register/page.tsx`
- Modify: `src/components/layout/Header.tsx` (the `/login`/`/register`
  links already exist at lines 75-80 and 116-129 — no change needed there,
  they'll now resolve to real pages)

**Interfaces:**
- Consumes: `POST /api/auth/login`, `POST /api/auth/register` from Task 2.

- [ ] **Step 1: Write `app/(site)/login/page.tsx`**

```tsx
'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Login failed');
      const next = searchParams.get('next');
      if (next) router.push(next);
      else router.push(body.user.role === 'admin' || body.user.role === 'editor' ? '/admin' : '/');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm card p-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">Welcome back</h1>
        <p className="text-sm text-foreground-muted mb-6">Sign in to continue reading and contributing.</p>
        {error && <p className="mb-4 text-sm text-[var(--tag-red)]">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block">
            <span className="block text-xs text-foreground-muted mb-1">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-accent transition-colors"
            />
          </label>
          <label className="block">
            <span className="block text-xs text-foreground-muted mb-1">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-accent transition-colors"
            />
          </label>
          <button type="submit" disabled={submitting} className="btn btn-primary w-full disabled:opacity-60">
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <p className="text-sm text-foreground-muted mt-4 text-center">
          No account? <Link href="/register" className="text-accent hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
```

- [ ] **Step 2: Write `app/(site)/register/page.tsx`**

Mirror the login page's structure exactly (same card layout, same
`min-h-[calc(100vh-72px)]` wrapper), with fields `name`, `email`,
`password`, posting to `/api/auth/register`, and on success redirecting to
`/` (a fresh self-registration is always a `reader`, never `/admin`):

```tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Registration failed');
      router.push('/');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm card p-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">Create your account</h1>
        <p className="text-sm text-foreground-muted mb-6">Join to track your reading and contribute to wikis.</p>
        {error && <p className="mb-4 text-sm text-[var(--tag-red)]">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block">
            <span className="block text-xs text-foreground-muted mb-1">Name</span>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-accent transition-colors"
            />
          </label>
          <label className="block">
            <span className="block text-xs text-foreground-muted mb-1">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-accent transition-colors"
            />
          </label>
          <label className="block">
            <span className="block text-xs text-foreground-muted mb-1">Password</span>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-accent transition-colors"
            />
          </label>
          <button type="submit" disabled={submitting} className="btn btn-primary w-full disabled:opacity-60">
            {submitting ? 'Creating account…' : 'Sign Up'}
          </button>
        </form>
        <p className="text-sm text-foreground-muted mt-4 text-center">
          Already have an account? <Link href="/login" className="text-accent hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Type-check and manually verify in the browser**

```bash
npx tsc --noEmit
```

Expected: no errors. Then start the dev server, visit
`http://localhost:3000/register`, create an account, confirm redirect to
`/`; visit `/login`, sign in with the same account, confirm redirect to
`/`; visit `/admin` while logged in as this `reader` account, confirm
redirect back to `/` (per Task 3's middleware).

- [ ] **Step 4: Commit**

```bash
git add "app/(site)/login" "app/(site)/register"
git commit -m "feat(auth): add public login and register pages

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01YT5MVaXncBzHesYjjtXSom"
```

---

### Task 5: Replace the placeholder author everywhere + real admin topbar

**Files:**
- Modify: `app/api/admin/pages/route.ts` (line 54)
- Modify: `app/api/admin/pages/[id]/route.ts` (line 33)
- Modify: `app/api/admin/pages/[id]/revisions/[revisionId]/rollback/route.ts` (line 20)
- Modify: `app/api/admin/wikis/route.ts` (line 39)
- Modify: `app/api/admin/media/route.ts`
- Modify: `app/api/admin/settings/route.ts`
- Modify: `src/components/admin/shell/AdminTopBar.tsx`
- Delete: `src/lib/db/getSystemAuthor.ts`

**Interfaces:**
- Consumes: `getSessionUser` from Task 1.

- [ ] **Step 1: Update each of the 6 API route files**

For each file, replace the import:

```ts
import { getSystemAuthorId } from '@/src/lib/db/getSystemAuthor';
```

with:

```ts
import { getSessionUser } from '@/src/lib/auth/getSessionUser';
```

and replace the call site (e.g. in `app/api/admin/pages/route.ts:54`):

```ts
const authorId = await getSystemAuthorId();
```

with:

```ts
const session = await getSessionUser();
if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
const authorId = session.sub;
```

Apply the same substitution in `app/api/admin/pages/[id]/route.ts`,
`.../rollback/route.ts`, and `app/api/admin/wikis/route.ts`. For
`app/api/admin/media/route.ts` and `app/api/admin/settings/route.ts`, read
the file first to find the exact `getSystemAuthorId()` call site (they
weren't shown in full during planning) and apply the same pattern —
`settings/route.ts`'s `GET`/`PATCH` should 401 the same way and otherwise
operate on `session.sub` instead of the placeholder id.

- [ ] **Step 2: Delete the placeholder**

```bash
git rm src/lib/db/getSystemAuthor.ts
```

- [ ] **Step 3: Update `src/components/admin/shell/AdminTopBar.tsx`**

Replace the static "A" avatar with the real logged-in user's initial/name
and a working logout button. Fetch `/api/auth/me` client-side (this
component is already `'use client'`):

```tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Me {
  name: string;
  email: string;
}

export default function AdminTopBar() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    fetch('/api/auth/me').then((r) => r.json()).then(({ user }) => setMe(user));
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-4 md:px-6 bg-background">
      <input
        type="search"
        placeholder="Search…"
        className="w-64 max-w-[40vw] px-3 py-1.5 text-sm bg-background-secondary border border-border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-accent transition-colors"
      />
      <div className="flex items-center gap-3">
        {me && <span className="text-sm text-foreground-muted hidden sm:block">{me.name}</span>}
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-contrast text-sm font-bold">
          {me?.name?.[0]?.toUpperCase() ?? '?'}
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="text-xs text-foreground-muted hover:text-foreground transition-colors"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Create a real admin account to develop against**

Since there's no admin UI yet to promote a user, register normally
(`POST /api/auth/register`, always creates `role: 'reader'`) then flip the
role directly in Mongo for local development:

```bash
mongosh wiki-platform --eval 'db.users.updateOne({ email: "tester@example.com" }, { $set: { role: "admin" } })'
```

- [ ] **Step 5: Verify end-to-end**

```bash
npx tsc --noEmit
```

Expected: no errors (confirms every call site was migrated — a leftover
`getSystemAuthorId()` import would now fail to resolve). Then, logged in
as the promoted admin account in the browser: visit `/admin`, create a
wiki via `/admin/wiki/new`, save a page, confirm it saves successfully
(the page's `author`/`lastEditedBy` should now be the real admin user's
id — spot-check with `mongosh wiki-platform --eval 'db.pages.find().sort({_id:-1}).limit(1)'`),
and confirm the topbar shows the real name with a working "Log out" that
returns you to `/login`.

- [ ] **Step 6: Commit**

```bash
git add app/api/admin src/components/admin/shell/AdminTopBar.tsx
git commit -m "feat(auth): wire real sessions into admin writes, remove placeholder author

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01YT5MVaXncBzHesYjjtXSom"
```

---

## Phase B — Contribution-aware wiki editor

### Task 6: Schema changes (Wiki, Page, Revision, PageArchetype)

**Files:**
- Modify: `src/lib/db/models/Wiki.ts`
- Modify: `src/lib/db/models/Page.ts`
- Modify: `src/lib/db/models/Revision.ts`
- Modify: `src/lib/blocks/templates.ts`

**Interfaces:**
- Produces: `Wiki.status: 'draft' | 'pending' | 'approved'` (default
  `'draft'`), `Wiki.coverPage?: ObjectId ref Page`, `Wiki.reviewNote?:
  string`. `Page.status` gains `'pending'` (now `'draft' | 'pending' |
  'published' | 'archived'`), `Page.reviewNote?: string`.
  `Revision.status: 'pending' | 'applied' | 'rejected'` (default
  `'applied'`). `PageArchetype` gains `'cover'`.

- [ ] **Step 1: Modify `src/lib/db/models/Wiki.ts`**

Add to `IWiki` (after `isFeatured: boolean;`):

```ts
  status: 'draft' | 'pending' | 'approved';
  coverPage?: mongoose.Types.ObjectId;
  reviewNote?: string;
```

Add to `WikiSchema` (after the `isFeatured` field):

```ts
    status: {
      type: String,
      enum: ['draft', 'pending', 'approved'],
      default: 'draft',
    },
    coverPage: {
      type: Schema.Types.ObjectId,
      ref: 'Page',
    },
    reviewNote: {
      type: String,
      maxlength: 2000,
    },
```

Add an index: `WikiSchema.index({ status: 1 });`

- [ ] **Step 2: Modify `src/lib/db/models/Page.ts`**

Change `export type PageStatus = 'draft' | 'published' | 'archived';` to:

```ts
export type PageStatus = 'draft' | 'pending' | 'published' | 'archived';
```

Update the `status` field's `enum` array to
`['draft', 'pending', 'published', 'archived']`. Add to `IPage` (after
`status: PageStatus;`): `reviewNote?: string;`, and to `PageSchema` (after
the `status` field):

```ts
    reviewNote: {
      type: String,
      maxlength: 2000,
    },
```

- [ ] **Step 3: Modify `src/lib/db/models/Revision.ts`**

Add to `IRevision` (after `isMinorEdit: boolean;`):
`status: 'pending' | 'applied' | 'rejected';`. Add to `RevisionSchema`
(after `isMinorEdit`):

```ts
    status: {
      type: String,
      enum: ['pending', 'applied', 'rejected'],
      default: 'applied',
    },
```

Add an index: `RevisionSchema.index({ status: 1 });`

- [ ] **Step 4: Modify `src/lib/blocks/templates.ts`**

Change line 13 from:

```ts
export type PageArchetype = 'overview' | 'character' | 'location' | 'episode' | 'blank';
```

to:

```ts
export type PageArchetype = 'overview' | 'character' | 'location' | 'episode' | 'cover' | 'blank';
```

Do **not** add a `'cover'` entry to the `PAGE_TEMPLATES` array — the cover
template is auto-applied at wiki-creation time (Task 7), never
user-picked from `TemplatePicker`, so it lives in a separate exported
builder function added in Task 7, not in this shared list.

- [ ] **Step 5: Type-check**

```bash
npx tsc --noEmit
```

Expected: this will show errors in existing code that switches on
`PageStatus` or `PageArchetype` exhaustively without a `default` case
(e.g. `BlockRenderer.tsx`'s `SortableBlock`/`PropertiesPanel` if any
switch on archetype — check the compiler output and add `case 'pending':`
/ `case 'cover':` branches wherever TypeScript flags a non-exhaustive
switch; most call sites use these as plain string comparisons and won't
need changes).

- [ ] **Step 6: Commit**

```bash
git add src/lib/db/models/Wiki.ts src/lib/db/models/Page.ts src/lib/db/models/Revision.ts src/lib/blocks/templates.ts
git commit -m "feat(wiki): add draft/pending/approved status fields for the review workflow

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01YT5MVaXncBzHesYjjtXSom"
```

---

### Task 7: Live-data block types + renderOverride + extracted display components

**Files:**
- Modify: `src/lib/blocks/types.ts`
- Modify: `src/components/blocks/BlockRenderer.tsx`
- Create: `src/components/wiki/WikiStatsDisplay.tsx`
- Create: `src/components/wiki/TrendingPagesDisplay.tsx`
- Create: `src/components/wiki/RecentActivityDisplay.tsx`
- Create: `src/lib/blocks/coverTemplate.ts`

**Interfaces:**
- Produces: 3 new `BlockType`s (`wikiStats`, `trendingPages`,
  `recentActivity`), each with an empty/config-only `props` shape (no
  live data stored — see spec's "Phase B" live-data-block design).
  `BlockListRenderer` gains an optional `renderOverride?: (block: Block) =>
  React.ReactNode | null` prop, checked before falling back to the generic
  `BlockRenderer`.
- Produces: `buildCoverPageBlocks(): Block[]` from `coverTemplate.ts` — the
  auto-applied template for a wiki's cover page (hero via infobox-style
  heading, `wikiStats`, `trendingPages`, `recentActivity`, `cardGrid`
  blocks).
- Consumes (by later Task 9): `WikiStatsDisplay`, `TrendingPagesDisplay`,
  `RecentActivityDisplay` take pre-computed data as props (no DB access of
  their own) and render the exact JSX currently inline in the wiki hub
  route.

- [ ] **Step 1: Add the 3 block types to `src/lib/blocks/types.ts`**

Add to the `BlockType` union (after `'adSlot'`):
`| 'wikiStats' | 'trendingPages' | 'recentActivity'`.

Add prop interfaces (after `AdSlotProps`):

```ts
export interface WikiStatsProps {}

export interface TrendingPagesProps {
  limit: number;
}

export interface RecentActivityProps {
  limit: number;
}
```

Add to `BlockPropsMap`:

```ts
  wikiStats: WikiStatsProps;
  trendingPages: TrendingPagesProps;
  recentActivity: RecentActivityProps;
```

Add to `BLOCK_LABELS`:

```ts
  wikiStats: 'Wiki Stats',
  trendingPages: 'Trending Pages',
  recentActivity: 'Recent Activity',
```

Add to `BLOCK_DESCRIPTIONS`:

```ts
  wikiStats: 'Live page/view counters for this wiki (renders on the wiki cover page only)',
  trendingPages: "This wiki's most-viewed/most-searched pages, computed live",
  recentActivity: "This wiki's latest edits, computed live",
```

Add to `DEFAULT_BLOCK_PROPS`:

```ts
  wikiStats: {},
  trendingPages: { limit: 4 },
  recentActivity: { limit: 5 },
```

- [ ] **Step 2: Add renderOverride support + placeholder cases to `src/components/blocks/BlockRenderer.tsx`**

Change the `BlockListRenderer` signature (line 16) from:

```tsx
export function BlockListRenderer({ blocks }: { blocks: Block[] }) {
```

to:

```tsx
export function BlockListRenderer({
  blocks,
  renderOverride,
}: {
  blocks: Block[];
  // Lets a server-rendering caller (the wiki hub route) substitute live,
  // pre-computed content for specific blocks (wikiStats/trendingPages/
  // recentActivity) instead of the static editor-preview placeholder.
  // Returning null/undefined falls through to the generic BlockRenderer.
  renderOverride?: (block: Block) => React.ReactNode | null | undefined;
}) {
```

Update both places blocks are rendered inside `BlockListRenderer` (the TOC
render and the `mainBlocks.map`/sidebar map) to check the override first.
For the main-blocks loop (around line 30):

```tsx
        {mainBlocks.map((block) => (
          <div key={block.id} className="mb-6 last:mb-0">
            {renderOverride?.(block) ?? <BlockRenderer block={block} headings={headings} />}
          </div>
        ))}
```

Apply the identical `renderOverride?.(block) ?? <BlockRenderer .../>`
pattern to the sidebar loop and the `toc` render.

Add 3 new `case` branches to the `BlockRenderer` switch (after the
`adSlot` case, before `default`) — static placeholders matching the
existing `adSlot`/`EmptyMediaPlaceholder` precedent, shown in the admin
editor and anywhere no `renderOverride` is supplied:

```tsx
    case 'wikiStats':
    case 'trendingPages':
    case 'recentActivity':
      return (
        <div className="ad-zone">
          <span>{BLOCK_LABELS[block.type]} — live on the published wiki cover page</span>
        </div>
      );
```

Add `BLOCK_LABELS` to the import at the top of the file:
`import { BLOCK_LABELS } from '@/src/lib/blocks/types';` (merge into the
existing `import type { Block } from ...` line if present, or add
alongside it — `BLOCK_LABELS` is a value import, not `type`).

- [ ] **Step 3: Extract `src/components/wiki/WikiStatsDisplay.tsx`**

Lift the exact JSX currently at
`app/(site)/wiki/[wikiSlug]/page.tsx:113-126` (the pages/views counter
row) into a standalone component:

```tsx
export default function WikiStatsDisplay({ pageCount, totalViews }: { pageCount: number; totalViews: number }) {
  return (
    <div className="border-b border-border bg-background-secondary">
      <div className="container py-4">
        <div className="flex items-center gap-8 flex-wrap">
          <div>
            <span className="text-2xl font-bold text-accent">{pageCount.toLocaleString()}</span>
            <span className="text-foreground-muted text-sm ml-2">pages</span>
          </div>
          <div>
            <span className="text-2xl font-bold text-accent">{totalViews.toLocaleString()}</span>
            <span className="text-foreground-muted text-sm ml-2">views</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Extract `src/components/wiki/TrendingPagesDisplay.tsx`**

Lift the exact JSX from `app/(site)/wiki/[wikiSlug]/page.tsx:140-156`:

```tsx
'use client';

import Link from 'next/link';

interface TrendingPage {
  _id: string;
  slug: string;
  pageType: string;
  title: string;
  viewCount: number;
  searchCount: number;
}

export default function TrendingPagesDisplay({ wikiSlug, pages }: { wikiSlug: string; pages: TrendingPage[] }) {
  if (pages.length === 0) return null;
  return (
    <section>
      <h2 className="text-xl font-bold text-foreground mb-4">🔥 Trending Pages</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {pages.map((page) => (
          <Link key={page._id} href={`/wiki/${wikiSlug}/${page.slug}`} className="card p-4 hover:border-accent group">
            <span className="text-xs text-accent font-medium capitalize">{page.pageType}</span>
            <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors mt-1">{page.title}</h3>
            <p className="text-sm text-foreground-muted mt-1">
              {page.viewCount.toLocaleString()} views
              {page.searchCount > 0 && ` · ${page.searchCount.toLocaleString()} searches`}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Extract `src/components/wiki/RecentActivityDisplay.tsx`**

Lift the exact JSX from `app/(site)/wiki/[wikiSlug]/page.tsx:158-185`:

```tsx
'use client';

import Link from 'next/link';

interface ActivityItem {
  _id: string;
  title: string;
  editSummary?: string;
  editorName: string;
  createdAt: string;
  pageSlug?: string;
}

export default function RecentActivityDisplay({ wikiSlug, items }: { wikiSlug: string; items: ActivityItem[] }) {
  if (items.length === 0) return null;
  return (
    <section>
      <h2 className="text-xl font-bold text-foreground mb-4">Recent Activity</h2>
      <div className="card divide-y divide-border">
        {items.map((item) => (
          <div key={item._id} className="p-4 flex items-start justify-between">
            <div>
              {item.pageSlug ? (
                <Link href={`/wiki/${wikiSlug}/${item.pageSlug}`} className="font-medium text-foreground hover:text-accent transition-colors">
                  {item.title}
                </Link>
              ) : (
                <span className="font-medium text-foreground">{item.title}</span>
              )}
              {item.editSummary && <p className="text-sm text-foreground-muted mt-1">{item.editSummary}</p>}
            </div>
            <div className="text-right shrink-0 ml-4">
              <p className="text-sm text-accent">{item.editorName}</p>
              <p className="text-xs text-foreground-muted">{new Date(item.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Write `src/lib/blocks/coverTemplate.ts`**

```ts
import { Block, createBlock } from './types';

// Auto-applied the moment a Wiki is created (see Task 9's POST /api/admin/wikis)
// — never picked from TemplatePicker, so it lives outside PAGE_TEMPLATES.
export function buildCoverPageBlocks(wikiName: string, description?: string): Block[] {
  return [
    createBlock('richText', { html: `<p>${description || `The ${wikiName} wiki.`}</p>` }),
    createBlock('wikiStats', {}),
    createBlock('heading', { text: 'Trending Pages', level: 2 }),
    createBlock('trendingPages', { limit: 4 }),
    createBlock('heading', { text: 'Recent Activity', level: 2 }),
    createBlock('recentActivity', { limit: 5 }),
    createBlock('heading', { text: 'Browse Pages', level: 2 }),
    createBlock('cardGrid', { columns: 3, items: [] }),
  ];
}
```

Note: the `heading` blocks immediately preceding `trendingPages`/
`recentActivity` are **not** rendered as headings by the live override in
Task 9 — they stay as ordinary heading blocks (so they still show up in
the table of contents and are fully editable), while the block
immediately after each gets its content substituted. This matches how the
existing hub page already pairs a `<h2>` with its section content.

- [ ] **Step 7: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 8: Commit**

```bash
git add src/lib/blocks/types.ts src/components/blocks/BlockRenderer.tsx src/components/wiki src/lib/blocks/coverTemplate.ts
git commit -m "feat(wiki): add live-data block types and extract wiki hub display components

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01YT5MVaXncBzHesYjjtXSom"
```

---

### Task 8: Role-gated wiki creation + publish/submit-for-review status endpoint

**Files:**
- Modify: `app/api/admin/wikis/route.ts`
- Create: `app/api/admin/wikis/[id]/status/route.ts`

**Interfaces:**
- Consumes: `getSessionUser`, `isTrustedRole`, `buildCoverPageBlocks`,
  `Page`/`Wiki` models.
- Produces: `POST /api/admin/wikis` now also creates the wiki's cover
  `Page` and sets `Wiki.coverPage`; every new wiki starts `status:
  'draft'` regardless of role. `PATCH /api/admin/wikis/[id]/status` with
  body `{ action: 'publish' | 'submit' }` — `publish` (trusted, own wiki,
  draft→approved), `submit` (owner, draft→pending). Approve/decline of a
  *pending* wiki is deliberately NOT duplicated here — that's the review
  queue's job (Task 12's `POST /api/admin/review/wiki/[id]`), so there is
  exactly one code path that flips `pending → approved|draft`.

- [ ] **Step 1: Modify `app/api/admin/wikis/route.ts`**

Replace the whole `POST` handler:

```ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { Page, Wiki } from '@/src/lib/db/models';
import { getSessionUser } from '@/src/lib/auth/getSessionUser';
import { slugify } from '@/src/lib/slugify';
import { buildCoverPageBlocks } from '@/src/lib/blocks/coverTemplate';

export async function GET() {
  await connectDB();
  const wikis = await Wiki.find().populate('category', 'name slug').sort({ name: 1 });
  return NextResponse.json({ wikis });
}

export async function POST(req: NextRequest) {
  await connectDB();
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const name: string = body.name?.trim();
  const categoryId: string = body.categoryId;
  const description: string | undefined = body.description;
  const coverImage: string | undefined = body.coverImage;

  if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  if (!categoryId) return NextResponse.json({ error: 'Category is required' }, { status: 400 });

  const baseSlug = slugify(name);
  let slug = baseSlug;
  let suffix = 1;
  while (await Wiki.exists({ slug })) {
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  const wiki = await Wiki.create({
    name,
    slug,
    description,
    coverImage,
    category: categoryId,
    createdBy: session.sub,
    status: 'draft',
  });

  const coverPage = await Page.create({
    wiki: wiki._id,
    pageType: 'cover',
    title: name,
    slug: '_cover',
    blocks: buildCoverPageBlocks(name, description),
    coverImage,
    author: session.sub,
    lastEditedBy: session.sub,
    status: 'draft',
  });

  wiki.coverPage = coverPage._id;
  await wiki.save();

  return NextResponse.json({ wiki }, { status: 201 });
}
```

- [ ] **Step 2: Write `app/api/admin/wikis/[id]/status/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { Wiki } from '@/src/lib/db/models';
import { getSessionUser } from '@/src/lib/auth/getSessionUser';
import { isTrustedRole } from '@/src/lib/auth/roles';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const wiki = await Wiki.findById(id);
  if (!wiki) return NextResponse.json({ error: 'Wiki not found' }, { status: 404 });

  const isOwner = wiki.createdBy.toString() === session.sub;
  const trusted = isTrustedRole(session.role);
  if (!isOwner && !trusted) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const action: string = body.action;

  // Only owner/self-service actions live here. Approve/decline of a
  // *pending* wiki belongs solely to the review queue (Task 12's
  // POST /api/admin/review/wiki/[id]) — one code path for that transition.
  if (action === 'publish') {
    if (!trusted) return NextResponse.json({ error: 'Only admin/editor can publish directly' }, { status: 403 });
    if (wiki.status !== 'draft') return NextResponse.json({ error: 'Only a draft wiki can be published' }, { status: 400 });
    wiki.status = 'approved';
  } else if (action === 'submit') {
    if (wiki.status !== 'draft') return NextResponse.json({ error: 'Only a draft wiki can be submitted' }, { status: 400 });
    wiki.status = 'pending';
  } else {
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  }

  await wiki.save();
  return NextResponse.json({ wiki });
}
```

- [ ] **Step 3: Update `GET /api/admin/wikis`, `GET /api/admin/pages`, and public queries to respect the new statuses**

The admin list routes (`GET /api/admin/wikis`, `GET /api/admin/pages`)
should keep showing everything regardless of status (admins need to see
drafts/pending to review them) — no change needed there. Confirm the
*public* wiki hub route's `Wiki.findOne({ slug })` (Task 9 rewrites this
file anyway) will need a `status: 'approved'` filter — tracked as part of
Task 9, not duplicated here.

- [ ] **Step 4: Verify**

Log in as the `reader`/`tester@example.com` account from earlier tasks
(demote back from admin temporarily, or register a second account) and:

```bash
curl -s -b cookies.txt -X POST http://localhost:3000/api/admin/wikis \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Wiki","categoryId":"<a real category id>","description":"A test"}'
```

Expected: `201`, response includes `wiki.status: "draft"` and
`wiki.coverPage` set to an id. Confirm the cover page exists:

```bash
mongosh wiki-platform --eval 'db.pages.findOne({ pageType: "cover" })'
```

Then submit it:

```bash
curl -s -b cookies.txt -X PATCH http://localhost:3000/api/admin/wikis/<id>/status \
  -H "Content-Type: application/json" -d '{"action":"submit"}'
```

Expected: `200`, `wiki.status: "pending"`. Confirm a non-owner user gets
`403` attempting `{"action":"publish"}` on someone else's draft wiki
(ownership check). Approve/decline of this now-`pending` wiki is verified
in Task 12, via the review queue endpoint — not here.

- [ ] **Step 5: Commit**

```bash
git add app/api/admin/wikis
git commit -m "feat(wiki): auto-create cover page on wiki creation, add draft/submit/approve workflow

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01YT5MVaXncBzHesYjjtXSom"
```

---

### Task 9: Rewrite the public wiki hub route to render the cover page's blocks

**Files:**
- Modify: `app/(site)/wiki/[wikiSlug]/page.tsx` (full rewrite)

**Interfaces:**
- Consumes: `BlockListRenderer` (with `renderOverride`) from Task 7,
  `WikiStatsDisplay`/`TrendingPagesDisplay`/`RecentActivityDisplay` from
  Task 7, `getTrendingPages` from existing `trending.ts`.

- [ ] **Step 1: Rewrite `app/(site)/wiki/[wikiSlug]/page.tsx`**

Keep `generateMetadata` and the `q`-search branch exactly as they are
today (lines 1-78 stay conceptually the same — only `loadWiki`'s query
gains a `status: 'approved'` filter). Replace the default-export
non-search branch to fetch the cover page and render its blocks with a
`renderOverride` supplying live data for the 3 new block types:

```tsx
async function loadWiki(wikiSlug: string) {
  await connectDB();
  const wiki = await Wiki.findOne({ slug: wikiSlug, status: 'approved' }).populate('category', 'name').lean();
  if (!wiki) return null;
  return wiki;
}
```

In the non-search branch, after loading `wiki`, fetch its cover page and
compute the same aggregations the old code computed inline:

```tsx
  const coverPage = wiki.coverPage
    ? await Page.findById(wiki.coverPage).lean()
    : null;

  const publishedFilter = { wiki: wiki._id, status: 'published' as const };
  const [totalViews, trendingPages, categoryAgg] = await Promise.all([
    Page.aggregate([{ $match: publishedFilter }, { $group: { _id: null, total: { $sum: '$viewCount' } } }]),
    getTrendingPages(publishedFilter, 4),
    Page.aggregate([
      { $match: publishedFilter },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]),
  ]);
  const pageIds = (await Page.find(publishedFilter).select('_id').lean()).map((p) => p._id);
  const recentRevisions = await Revision.find({ contentType: 'page', contentId: { $in: pageIds } })
    .populate('editedBy', 'name')
    .populate({ path: 'contentId', select: 'title slug', model: 'Page' })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const recentActivityItems = recentRevisions.map((rev) => {
    const content = rev.contentId as unknown as { title?: string; slug?: string } | null;
    return {
      _id: rev._id.toString(),
      title: content?.title ?? rev.title,
      editSummary: rev.editSummary,
      editorName: (rev.editedBy as unknown as { name?: string })?.name ?? 'Unknown',
      createdAt: rev.createdAt.toISOString(),
      pageSlug: content?.slug,
    };
  });

  const renderOverride = (block: Block): React.ReactNode | null => {
    switch (block.type) {
      case 'wikiStats':
        return <WikiStatsDisplay pageCount={wiki.pageCount} totalViews={totalViews[0]?.total ?? 0} />;
      case 'trendingPages':
        return (
          <TrendingPagesDisplay
            wikiSlug={wikiSlug}
            pages={trendingPages.map((p) => ({
              _id: p._id.toString(), slug: p.slug, pageType: p.pageType,
              title: p.title, viewCount: p.viewCount, searchCount: p.searchCount,
            }))}
          />
        );
      case 'recentActivity':
        return <RecentActivityDisplay wikiSlug={wikiSlug} items={recentActivityItems} />;
      default:
        return null;
    }
  };
```

Replace the hand-built hero/stats/trending/activity/sidebar JSX (old lines
100-219) with:

```tsx
  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="relative h-64 md:h-80 overflow-hidden bg-background-tertiary">
        {wiki.coverImage && <img src={wiki.coverImage} alt={wiki.name} className="w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">{wiki.name} Wiki</h1>
            {wiki.description && <p className="text-foreground-muted max-w-2xl">{wiki.description}</p>}
          </div>
        </div>
      </div>

      <div className="container py-8">
        <form action={`/wiki/${wikiSlug}`} method="get" className="mb-8">
          <input
            type="search"
            name="q"
            placeholder={`Search ${wiki.name} Wiki...`}
            className="w-full px-5 py-4 rounded-xl bg-card border border-border text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
          />
        </form>

        {coverPage ? (
          <BlockListRenderer blocks={coverPage.blocks as Block[]} renderOverride={renderOverride} />
        ) : (
          <p className="text-foreground-muted">
            No pages published yet. <Link href="/admin/wiki/new" className="text-accent hover:underline">Add the first one →</Link>
          </p>
        )}

        {categoryAgg.length > 0 && (
          <div className="card p-4 mt-8 max-w-sm">
            <h3 className="font-bold text-foreground mb-3">Categories</h3>
            <div className="space-y-2">
              {categoryAgg.map((cat: { _id: string; count: number }) => (
                <div key={cat._id} className="flex items-center justify-between text-sm">
                  <span className="text-foreground-muted">{cat._id}</span>
                  <span className="text-xs text-foreground-muted bg-background-secondary px-2 py-0.5 rounded">{cat.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <form action={`/wiki/${wikiSlug}/random`} className="card p-4 mt-6 max-w-sm">
          <h3 className="font-bold text-foreground mb-3">Quick Links</h3>
          <button type="submit" className="block text-foreground-muted hover:text-accent transition-colors text-sm">
            Random page →
          </button>
        </form>
      </div>
    </div>
  );
}
```

Add the needed imports at the top: `BlockListRenderer` from
`@/src/components/blocks/BlockRenderer`, `WikiStatsDisplay` from
`@/src/components/wiki/WikiStatsDisplay`, `TrendingPagesDisplay` from
`@/src/components/wiki/TrendingPagesDisplay`, `RecentActivityDisplay` from
`@/src/components/wiki/RecentActivityDisplay`, and
`import type { Block } from '@/src/lib/blocks/types';`.

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Verify in the browser**

With the admin-promoted account, publish the test wiki's cover page
(`PATCH /api/admin/pages/[coverPageId]` with `{ status: 'published' }` —
this endpoint already exists) and the wiki itself
(`PATCH /api/admin/wikis/[id]/status` with `{ action: 'publish' }`). Visit
`/wiki/<slug>` in the browser: confirm the hero renders, the "Wiki Stats"
placeholder is replaced by real page/view counts, "Trending Pages" and
"Recent Activity" sections render (or the correct "no pages yet" state if
none exist), and the page no longer 404s or shows stale hand-built markup.
Also confirm a `status: 'draft'`/`'pending'` wiki now correctly 404s at
its public `/wiki/<slug>` URL (the `status: 'approved'` filter in
`loadWiki`).

- [ ] **Step 4: Commit**

```bash
git add "app/(site)/wiki/[wikiSlug]/page.tsx"
git commit -m "feat(wiki): render the wiki hub page from its cover Page's blocks

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01YT5MVaXncBzHesYjjtXSom"
```

---

### Task 10: Role-gated page create/edit (pending pages + pending revisions)

**Files:**
- Modify: `app/api/admin/pages/route.ts`
- Modify: `app/api/admin/pages/[id]/route.ts`

**Interfaces:**
- Consumes: `getSessionUser`, `isTrustedRole`.
- Produces: `POST /api/admin/pages` sets `status: 'draft'` for trusted
  roles (unchanged default) or `status: 'pending'` for
  contributor/reader. `PATCH /api/admin/pages/[id]` — if the requester is
  not trusted AND the existing page is already `status: 'published'`,
  instead of mutating the live page it creates a `Revision` with
  `status: 'pending'` storing the proposed `title`+`blocks` and returns
  `{ pendingRevision }` instead of `{ page }`; every other case (trusted
  role, or non-trusted editing their own not-yet-published page) behaves
  exactly as today.

- [ ] **Step 1: Modify `app/api/admin/pages/route.ts`'s `POST` handler**

After the existing `authorId`/session line (now `session.sub` from Task
5), determine the initial status:

```ts
  const status = isTrustedRole(session.role) ? 'draft' : 'pending';
```

Pass `status` into `Page.create({ ... status })` (replacing the hardcoded
`status: 'draft'`). Add the import
`import { isTrustedRole } from '@/src/lib/auth/roles';`.

- [ ] **Step 2: Modify `app/api/admin/pages/[id]/route.ts`'s `PATCH` handler**

Restructure around the trust/publication check. After loading `existing`
and resolving `session`:

```ts
  const trusted = isTrustedRole(session.role);

  if (!trusted && existing.status === 'published') {
    // Non-trusted edit to a live page: propose a pending revision instead
    // of mutating the page directly.
    const latest = await Revision.findOne({ contentType: 'page', contentId: existing._id }).sort({ version: -1 });
    const version = (latest?.version ?? 0) + 1;
    const pendingRevision = await Revision.create({
      contentType: 'page',
      contentId: existing._id,
      title: title ?? existing.title,
      content: JSON.stringify(blocks ?? existing.blocks),
      editedBy: session.sub,
      editSummary,
      version,
      status: 'pending',
    });
    return NextResponse.json({ pendingRevision }, { status: 202 });
  }
```

Insert this block immediately after `const existing = await
Page.findById(id); if (!existing) ...`, before the existing
`snapshotPageRevision`/mutate/save logic (which now only runs for the
trusted-or-not-yet-published case, unchanged otherwise). Add the
`Revision` import (`import { Page, Revision } from '@/src/lib/db/models';`)
and `isTrustedRole` import.

- [ ] **Step 3: Verify**

As the non-trusted test user, create a new page (should come back
`status: "pending"`):

```bash
curl -s -b cookies.txt -X POST http://localhost:3000/api/admin/pages \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Page","wikiId":"<id>","blocks":[]}'
```

Expected: `page.status: "pending"`. As admin, publish an existing page
(`PATCH .../[id]` with `{status:'published'}`), then as the non-trusted
user, `PATCH` that same page with new `blocks` — expect `202` and a
`pendingRevision` object with `status: "pending"`, and confirm via
`mongosh` that the live `Page.blocks` is unchanged. As admin, edit the
same published page directly — expect the normal `200`/`{page}` response
(admin edits still apply immediately).

- [ ] **Step 4: Commit**

```bash
git add app/api/admin/pages
git commit -m "feat(wiki): gate page create/edit by role — pending pages and pending revisions for untrusted roles

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01YT5MVaXncBzHesYjjtXSom"
```

---

### Task 11: Public "Edit" entry point on wiki pages

**Files:**
- Create: `app/(site)/wiki/[wikiSlug]/[pageSlug]/edit/page.tsx`
- Modify: `app/(site)/wiki/[wikiSlug]/[pageSlug]/page.tsx` (add the Edit
  link)

**Interfaces:**
- Consumes: `PageBuilder`/`TextEditor` (existing admin builder
  components — reused as-is, they're generic over any `Page`), `GET
  /api/auth/me`, `GET/PATCH /api/admin/pages/[id]`.

- [ ] **Step 1: Add the Edit link to the public page route**

In `app/(site)/wiki/[wikiSlug]/[pageSlug]/page.tsx`, in the top bar (around
line 85-92, next to the view count), add an Edit link. Since this is a
Server Component, gate visibility with `getSessionUser()`:

```tsx
import { getSessionUser } from '@/src/lib/auth/getSessionUser';
```

Inside `WikiReadPage`, after loading `page`/`wiki`:

```tsx
  const session = await getSessionUser();
```

In the top bar's flex row, add after the view-count span:

```tsx
          {session && (
            <Link href={`/wiki/${wikiSlug}/${pageSlug}/edit`} className="text-accent hover:underline font-medium">
              Edit
            </Link>
          )}
```

- [ ] **Step 2: Write `app/(site)/wiki/[wikiSlug]/[pageSlug]/edit/page.tsx`**

A client page that loads the live page's current data, shows the same
`PageBuilder`/`TextEditor` used in admin (imported directly — they're
generic React components, not admin-route-specific), and saves via
`PATCH /api/admin/pages/[id]`, handling both the trusted (`{page}`) and
non-trusted (`{pendingRevision}`, `202`) responses:

```tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageBuilder from '@/src/components/admin/builder/PageBuilder';
import type { PageBuilderSaveData } from '@/src/lib/blocks/types';

interface PageDoc {
  _id: string;
  title: string;
  blocks: PageBuilderSaveData['blocks'];
  templateKey?: string;
  coverImage?: string;
}

export default function PublicEditPage() {
  const params = useParams<{ wikiSlug: string; pageSlug: string }>();
  const router = useRouter();
  const [page, setPage] = useState<PageDoc | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/auth/me').then((r) => r.json()).then(({ user }) => setLoggedIn(!!user));
  }, []);

  useEffect(() => {
    fetch(`/api/public/pages?wikiSlug=${params.wikiSlug}&pageSlug=${params.pageSlug}`)
      .then((r) => r.json())
      .then(({ page }) => setPage(page));
  }, [params.wikiSlug, params.pageSlug]);

  if (loggedIn === false) {
    return <p className="container py-16 text-foreground-muted">You must be signed in to edit this page.</p>;
  }
  if (!page) return <p className="container py-16 text-foreground-muted">Loading…</p>;

  const handleSave = async (data: PageBuilderSaveData) => {
    setSaving(true);
    setNotice(null);
    try {
      const res = await fetch(`/api/admin/pages/${page._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Failed to save');
      if (res.status === 202) {
        setNotice('Your edit was submitted for admin review — it will go live once approved.');
      } else {
        router.push(`/wiki/${params.wikiSlug}/${params.pageSlug}`);
      }
    } catch (e) {
      setNotice(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container py-8">
      {notice && <div className="mb-4 px-4 py-2 rounded-lg bg-accent-muted text-accent text-sm">{notice}</div>}
      <PageBuilder
        initialTitle={page.title}
        initialBlocks={page.blocks}
        initialTemplateKey={page.templateKey}
        initialCoverImage={page.coverImage}
        showEditSummary
        onSave={handleSave}
        saving={saving}
      />
    </div>
  );
}
```

- [ ] **Step 3: Create the small public read endpoint it depends on**

Create `app/api/public/pages/route.ts` (a read-only, published-or-owned
lookup by wiki+page slug — needed because the existing
`GET /api/admin/pages/[id]` requires already knowing the Mongo `_id`,
which the public edit route doesn't have, only slugs):

```ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { Page, Wiki } from '@/src/lib/db/models';

export async function GET(req: NextRequest) {
  await connectDB();
  const wikiSlug = req.nextUrl.searchParams.get('wikiSlug');
  const pageSlug = req.nextUrl.searchParams.get('pageSlug');
  if (!wikiSlug || !pageSlug) {
    return NextResponse.json({ error: 'wikiSlug and pageSlug are required' }, { status: 400 });
  }
  const wiki = await Wiki.findOne({ slug: wikiSlug }).select('_id');
  if (!wiki) return NextResponse.json({ page: null }, { status: 404 });
  const page = await Page.findOne({ wiki: wiki._id, slug: pageSlug, status: 'published' })
    .select('title blocks templateKey coverImage');
  if (!page) return NextResponse.json({ page: null }, { status: 404 });
  return NextResponse.json({ page });
}
```

- [ ] **Step 4: Type-check and verify in the browser**

```bash
npx tsc --noEmit
```

Log in as the non-trusted test user, visit a published page, confirm the
Edit link appears, click it, change some content, Save — expect the
"submitted for admin review" notice and confirm (via `mongosh`) a new
`Revision` with `status: "pending"` exists and the live page is
unchanged. Log out and revisit the same page — confirm the Edit link is
gone.

- [ ] **Step 5: Commit**

```bash
git add "app/(site)/wiki/[wikiSlug]/[pageSlug]" app/api/public
git commit -m "feat(wiki): add a public Edit entry point for logged-in users

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01YT5MVaXncBzHesYjjtXSom"
```

---

### Task 12: Admin review queue (list + approve/decline)

**Files:**
- Create: `app/api/admin/review/route.ts`
- Create: `app/api/admin/review/[type]/[id]/route.ts`
- Create: `app/admin/review/page.tsx`
- Modify: `src/components/admin/shell/AdminSidebar.tsx`

**Interfaces:**
- Produces: `GET /api/admin/review` returns `{ items: ReviewItem[] }`
  merging pending `Wiki`s, pending `Page`s, and pending `Revision`s
  (each tagged `{ kind: 'wiki'|'page'|'revision', ... }`), newest first.
  `POST /api/admin/review/[type]/[id]` with body `{ decision: 'approve' |
  'decline', reviewNote?, publishStatus?: 'draft'|'published' }` where
  `type` is `wiki`|`page`|`revision`.

- [ ] **Step 1: Write `app/api/admin/review/route.ts`**

```ts
import { NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { Page, Revision, Wiki } from '@/src/lib/db/models';
import { getSessionUser } from '@/src/lib/auth/getSessionUser';
import { isTrustedRole } from '@/src/lib/auth/roles';

export async function GET() {
  const session = await getSessionUser();
  if (!session || !isTrustedRole(session.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  await connectDB();

  const [wikis, pages, revisions] = await Promise.all([
    Wiki.find({ status: 'pending' }).populate('createdBy', 'name email').sort({ updatedAt: -1 }).lean(),
    Page.find({ status: 'pending' }).populate('author', 'name email').populate('wiki', 'name slug').sort({ updatedAt: -1 }).lean(),
    Revision.find({ status: 'pending' }).populate('editedBy', 'name email').populate({ path: 'contentId', select: 'title slug wiki', model: 'Page' }).sort({ createdAt: -1 }).lean(),
  ]);

  const items = [
    ...wikis.map((w) => ({ kind: 'wiki' as const, id: w._id.toString(), title: w.name, submittedBy: (w.createdBy as unknown as { name?: string })?.name, updatedAt: w.updatedAt })),
    ...pages.map((p) => ({ kind: 'page' as const, id: p._id.toString(), title: p.title, submittedBy: (p.author as unknown as { name?: string })?.name, updatedAt: p.updatedAt })),
    ...revisions.map((r) => ({ kind: 'revision' as const, id: r._id.toString(), title: r.title, submittedBy: (r.editedBy as unknown as { name?: string })?.name, updatedAt: r.createdAt })),
  ].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return NextResponse.json({ items });
}
```

- [ ] **Step 2: Write `app/api/admin/review/[type]/[id]/route.ts`**

```ts
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { Page, Revision, Wiki } from '@/src/lib/db/models';
import { getSessionUser } from '@/src/lib/auth/getSessionUser';
import { isTrustedRole } from '@/src/lib/auth/roles';
import { snapshotPageRevision } from '@/src/lib/db/pageRevisions';
import type { Block } from '@/src/lib/blocks/types';

export async function POST(req: NextRequest, { params }: { params: Promise<{ type: string; id: string }> }) {
  const session = await getSessionUser();
  if (!session || !isTrustedRole(session.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  await connectDB();
  const { type, id } = await params;
  const body = await req.json();
  const decision: 'approve' | 'decline' = body.decision;
  const reviewNote: string | undefined = body.reviewNote;
  const publishStatus: 'draft' | 'published' = body.publishStatus ?? 'published';

  if (type === 'wiki') {
    const wiki = await Wiki.findById(id);
    if (!wiki) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    wiki.status = decision === 'approve' ? 'approved' : 'draft';
    if (decision === 'decline') wiki.reviewNote = reviewNote;
    await wiki.save();
    return NextResponse.json({ wiki });
  }

  if (type === 'page') {
    const page = await Page.findById(id);
    if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (decision === 'approve') {
      page.status = publishStatus;
      if (publishStatus === 'published' && !page.publishedAt) page.publishedAt = new Date();
    } else {
      page.status = 'draft';
      page.reviewNote = reviewNote;
    }
    await page.save();
    return NextResponse.json({ page });
  }

  if (type === 'revision') {
    const revision = await Revision.findById(id);
    if (!revision) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (decision === 'approve') {
      const page = await Page.findById(revision.contentId);
      if (!page) return NextResponse.json({ error: 'Target page no longer exists' }, { status: 404 });
      await snapshotPageRevision(page, session.sub, `Approved contribution from review queue`);
      page.title = revision.title;
      page.blocks = JSON.parse(revision.content) as Block[];
      page.lastEditedBy = new mongoose.Types.ObjectId(session.sub);
      page.editCount += 1;
      await page.save();
      revision.status = 'applied';
      await revision.save();
      return NextResponse.json({ page });
    }
    revision.status = 'rejected';
    await revision.save();
    return NextResponse.json({ revision });
  }

  return NextResponse.json({ error: 'Unknown type' }, { status: 400 });
}
```

- [ ] **Step 3: Write `app/admin/review/page.tsx`**

A card-list UI matching the existing admin card-grid visual language
(`/admin/wikis`, `/admin/pages`) — one row per item with title,
submitter, kind badge, "Preview" link (to Task 13's preview route,
`/admin/preview/{kind}/{id}`), and Approve/Decline buttons:

```tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface ReviewItem {
  kind: 'wiki' | 'page' | 'revision';
  id: string;
  title: string;
  submittedBy?: string;
  updatedAt: string;
}

export default function ReviewQueuePage() {
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetch('/api/admin/review').then((r) => r.json()).then(({ items }) => setItems(items ?? [])).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const decide = async (item: ReviewItem, decision: 'approve' | 'decline') => {
    setBusyId(item.id);
    try {
      await fetch(`/api/admin/review/${item.kind}/${item.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision }),
      });
      load();
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <p className="text-foreground-muted">Loading…</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Review Queue</h1>
      {items.length === 0 ? (
        <p className="text-foreground-muted">Nothing pending review.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={`${item.kind}-${item.id}`} className="card p-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <span className="text-xs uppercase tracking-wide text-accent font-medium">{item.kind}</span>
                <h3 className="font-semibold text-foreground truncate">{item.title}</h3>
                <p className="text-xs text-foreground-muted">
                  {item.submittedBy ?? 'Unknown'} · {new Date(item.updatedAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link href={`/admin/preview/${item.kind}/${item.id}`} className="btn btn-secondary text-sm py-1.5" target="_blank">
                  Preview
                </Link>
                <button disabled={busyId === item.id} onClick={() => decide(item, 'approve')} className="btn btn-primary text-sm py-1.5 disabled:opacity-60">
                  Approve
                </button>
                <button disabled={busyId === item.id} onClick={() => decide(item, 'decline')} className="btn btn-secondary text-sm py-1.5 disabled:opacity-60">
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Wire the sidebar nav item**

In `src/components/admin/shell/AdminSidebar.tsx`, the "Community" group
(lines 46-51) currently lists `{ label: 'Submissions', icon: Inbox }` with
no `href` (greyed out). Change it to a real link:

```ts
      { label: 'Review Queue', href: '/admin/review', icon: Inbox },
```

(rename from "Submissions" to "Review Queue" to match what it now is —
keep "Users" greyed out, that's still backlog per `PROGRESS.md`).

- [ ] **Step 5: Verify end-to-end**

As the non-trusted test user, submit a wiki (Task 8) and a pending
revision (Task 10). As admin, visit `/admin/review`, confirm both appear,
approve the wiki (confirm its public `/wiki/<slug>` now 200s), decline the
revision (confirm the live page is unchanged and the revision's status is
`rejected` via `mongosh`).

- [ ] **Step 6: Commit**

```bash
git add app/api/admin/review app/admin/review src/components/admin/shell/AdminSidebar.tsx
git commit -m "feat(admin): add unified review queue for pending wikis/pages/revisions

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01YT5MVaXncBzHesYjjtXSom"
```

---

### Task 13: Admin/owner preview (bypasses the status gate)

**Files:**
- Create: `app/admin/preview/wiki/[id]/page.tsx`
- Create: `app/admin/preview/page/[id]/page.tsx`
- Create: `app/admin/preview/revision/[id]/page.tsx`

**Interfaces:**
- Consumes: `BlockListRenderer`, `WikiStatsDisplay`/
  `TrendingPagesDisplay`/`RecentActivityDisplay` (same rendering path as
  the public route, Task 9), but fetching by Mongo `_id` and ignoring
  `status` entirely (admin-only, gated by the existing `middleware.ts`
  since these routes are under `/admin/**`).

- [ ] **Step 1: Write `app/admin/preview/wiki/[id]/page.tsx`**

A Server Component nearly identical to Task 9's public hub route, but:
fetches `Wiki.findById(id)` (no `status` filter), always shows a "Pending
— not yet public" banner, and additionally lists the wiki's other pages
(any status) below the cover-page render, since a reviewer needs to see
the whole wiki, not just its cover. Note a deliberate, acknowledged gap:
this preview does **not** pass a `renderOverride`, so the 3 live-data
blocks (wikiStats/trendingPages/recentActivity) show their static
editor placeholder here instead of real numbers — computing live
aggregate data for a wiki that may have zero published pages yet isn't
worth the duplicated query logic for a review-only view. Everything
else the reviewer actually needs to judge (the authored copy, images,
card grids, and the list of other pages) renders exactly as it will
live:

```tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import connectDB from '@/src/lib/db/connection';
import { Page, Wiki } from '@/src/lib/db/models';
import { BlockListRenderer } from '@/src/components/blocks/BlockRenderer';
import type { Block } from '@/src/lib/blocks/types';

export default async function AdminWikiPreview({ params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const wiki = await Wiki.findById(id).lean();
  if (!wiki) notFound();
  const coverPage = wiki.coverPage ? await Page.findById(wiki.coverPage).lean() : null;
  const otherPages = await Page.find({ wiki: wiki._id, pageType: { $ne: 'cover' } })
    .select('title slug pageType status')
    .lean();

  return (
    <div>
      <div className="mb-4 px-4 py-2 rounded-lg bg-[var(--tag-yellow-bg,theme(colors.amber.500/0.15))] text-sm font-medium">
        Pending preview — status: {wiki.status}. Not visible to the public yet.
      </div>
      <h1 className="text-3xl font-bold text-foreground mb-1">{wiki.name} Wiki</h1>
      {wiki.description && <p className="text-foreground-muted mb-6">{wiki.description}</p>}
      {coverPage ? (
        <BlockListRenderer blocks={coverPage.blocks as Block[]} />
      ) : (
        <p className="text-foreground-muted">No cover page.</p>
      )}
      {otherPages.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-foreground mb-3">Pages in this wiki</h2>
          <ul className="space-y-1">
            {otherPages.map((p) => (
              <li key={p._id.toString()}>
                <Link href={`/admin/preview/page/${p._id}`} className="text-accent hover:underline">{p.title}</Link>
                <span className="text-xs text-foreground-muted ml-2">({p.status})</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

Use a plain utility class instead of an undefined CSS var if
`--tag-yellow-bg` doesn't exist — check `app/globals.css` for the actual
available `--tag-*` tokens (the codebase already uses `--tag-red`/
`--tag-red-bg` per `WikiPicker.tsx`'s error styling) and substitute a real
existing token, e.g. `bg-[var(--tag-red-bg)] text-[var(--tag-red)]` is
available and adequate for a "not live yet" banner even though it's
red-toned rather than yellow — don't invent a new CSS variable.

- [ ] **Step 2: Write `app/admin/preview/page/[id]/page.tsx`**

Same idea, single page, no status filter:

```tsx
import { notFound } from 'next/navigation';
import connectDB from '@/src/lib/db/connection';
import { Page } from '@/src/lib/db/models';
import { BlockListRenderer } from '@/src/components/blocks/BlockRenderer';
import type { Block } from '@/src/lib/blocks/types';

export default async function AdminPagePreview({ params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const page = await Page.findById(id).lean();
  if (!page) notFound();

  return (
    <div>
      <div className="mb-4 px-4 py-2 rounded-lg bg-[var(--tag-red-bg)] text-[var(--tag-red)] text-sm font-medium">
        Pending preview — status: {page.status}. Not visible to the public yet.
      </div>
      <h1 className="text-4xl font-bold text-foreground mb-6">{page.title}</h1>
      <BlockListRenderer blocks={page.blocks as Block[]} />
    </div>
  );
}
```

- [ ] **Step 3: Write `app/admin/preview/revision/[id]/page.tsx`**

Renders the *proposed* content from a pending `Revision` (its `content` is
`JSON.stringify(blocks)`, per `pageRevisions.ts`'s existing convention):

```tsx
import { notFound } from 'next/navigation';
import connectDB from '@/src/lib/db/connection';
import { Revision } from '@/src/lib/db/models';
import { BlockListRenderer } from '@/src/components/blocks/BlockRenderer';
import type { Block } from '@/src/lib/blocks/types';

export default async function AdminRevisionPreview({ params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const revision = await Revision.findById(id).lean();
  if (!revision) notFound();
  const blocks = JSON.parse(revision.content) as Block[];

  return (
    <div>
      <div className="mb-4 px-4 py-2 rounded-lg bg-[var(--tag-red-bg)] text-[var(--tag-red)] text-sm font-medium">
        Proposed edit preview — not yet applied to the live page.
      </div>
      <h1 className="text-4xl font-bold text-foreground mb-6">{revision.title}</h1>
      <BlockListRenderer blocks={blocks} />
    </div>
  );
}
```

- [ ] **Step 4: Add a "Preview" link from the wiki editor for admin's own drafts**

In `app/admin/wiki/[id]/edit/page.tsx` (read it first to find the right
spot — likely near the existing "View history" link mentioned in
`PROGRESS.md`), add a link to `/admin/preview/page/[id]` so admin can
preview their own in-progress page the same way a reviewer previews a
contribution. Also add a "Preview whole wiki" link
(`/admin/preview/wiki/[wikiId]`) somewhere reachable from `/admin/wikis`
(e.g. a "Preview" button alongside each wiki's card).

- [ ] **Step 5: Verify**

Visit `/admin/preview/wiki/<id>` for the still-`pending` test wiki from
Task 8 — confirm it renders the cover page content with the "Pending
preview" banner even though the public `/wiki/<slug>` 404s for the same
wiki. Same check for a pending page and a pending revision.

- [ ] **Step 6: Commit**

```bash
git add app/admin/preview app/admin/wiki app/admin/wikis
git commit -m "feat(admin): add pending-content preview routes for wikis/pages/revisions

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01YT5MVaXncBzHesYjjtXSom"
```

---

### Task 14: User account dashboard (Continue Reading + My Contributions)

**Files:**
- Modify: `src/lib/db/models/Page.ts` (view-count increment gains a
  `ReadingProgress` upsert)
- Modify: `app/(site)/wiki/[wikiSlug]/[pageSlug]/page.tsx`
- Create: `app/api/account/reading-progress/route.ts`
- Create: `app/api/account/contributions/route.ts`
- Create: `app/(site)/account/page.tsx`
- Modify: `src/components/layout/Header.tsx` (add an "Account" link when
  logged in)

**Interfaces:**
- Produces: `GET /api/account/reading-progress` returns the current
  session user's 6 most recent `ReadingProgress` docs (populated
  page+wiki title/slug/coverImage). `GET /api/account/contributions`
  returns the current session user's own `Wiki`/`Page`/`Revision`
  submissions with status.

- [ ] **Step 1: Record reading progress on page view**

In `app/(site)/wiki/[wikiSlug]/[pageSlug]/page.tsx`, alongside the
existing fire-and-forget view-count increment (line 65:
`void Page.updateOne({ _id: page._id }, { $inc: { viewCount: 1 } }).exec();`),
add a session-gated upsert:

```tsx
  const session = await getSessionUser();
  void Page.updateOne({ _id: page._id }, { $inc: { viewCount: 1 } }).exec();
  if (session) {
    void ReadingProgress.updateOne(
      { user: session.sub, contentType: 'page', contentId: page._id },
      { $set: { lastReadAt: new Date() }, $setOnInsert: { startedAt: new Date() } },
      { upsert: true }
    ).exec();
  }
```

(This reuses the `session` variable Task 11 already introduced in this
same file for the Edit link — don't declare it twice.) Add `ReadingProgress`
to the `@/src/lib/db/models` import.

- [ ] **Step 2: Write `app/api/account/reading-progress/route.ts`**

```ts
import { NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { Page, ReadingProgress } from '@/src/lib/db/models';
import { getSessionUser } from '@/src/lib/auth/getSessionUser';

export async function GET() {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();

  const progress = await ReadingProgress.find({ user: session.sub, contentType: 'page' })
    .sort({ lastReadAt: -1 })
    .limit(6)
    .lean();

  const pages = await Page.find({ _id: { $in: progress.map((p) => p.contentId) } })
    .select('title slug coverImage wiki')
    .populate('wiki', 'name slug')
    .lean();
  const pageById = new Map(pages.map((p) => [p._id.toString(), p]));

  const items = progress
    .map((p) => {
      const page = pageById.get(p.contentId.toString());
      if (!page) return null;
      const wiki = page.wiki as unknown as { name: string; slug: string };
      return {
        pageTitle: page.title,
        pageSlug: page.slug,
        coverImage: page.coverImage,
        wikiName: wiki.name,
        wikiSlug: wiki.slug,
        lastReadAt: p.lastReadAt,
      };
    })
    .filter(Boolean);

  return NextResponse.json({ items });
}
```

- [ ] **Step 3: Write `app/api/account/contributions/route.ts`**

```ts
import { NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { Page, Revision, Wiki } from '@/src/lib/db/models';
import { getSessionUser } from '@/src/lib/auth/getSessionUser';

export async function GET() {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();

  const [wikis, pages, revisions] = await Promise.all([
    Wiki.find({ createdBy: session.sub }).select('name slug status coverImage reviewNote updatedAt').sort({ updatedAt: -1 }).lean(),
    Page.find({ author: session.sub, pageType: { $ne: 'cover' } }).select('title slug status coverImage reviewNote wiki updatedAt').populate('wiki', 'slug').sort({ updatedAt: -1 }).lean(),
    Revision.find({ editedBy: session.sub, status: { $ne: 'applied' } }).select('title status createdAt').sort({ createdAt: -1 }).lean(),
  ]);

  return NextResponse.json({ wikis, pages, revisions });
}
```

- [ ] **Step 4: Write `app/(site)/account/page.tsx`**

An image-led card-grid dashboard matching the aesthetic of
`FeaturedWikisSection`/admin card grids (cover thumbnails, hover states):

```tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface ReadingItem {
  pageTitle: string; pageSlug: string; coverImage?: string; wikiName: string; wikiSlug: string; lastReadAt: string;
}
interface Contributions {
  wikis: { _id: string; name: string; slug: string; status: string; coverImage?: string; reviewNote?: string }[];
  pages: { _id: string; title: string; slug: string; status: string; coverImage?: string; reviewNote?: string; wiki: { slug: string } }[];
  revisions: { _id: string; title: string; status: string; createdAt: string }[];
}

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-background-tertiary text-foreground-muted',
  pending: 'bg-accent-muted text-accent',
  approved: 'bg-[var(--tag-green-bg,theme(colors.emerald.500/0.15))] text-[var(--tag-green,theme(colors.emerald.600))]',
  published: 'bg-[var(--tag-green-bg,theme(colors.emerald.500/0.15))] text-[var(--tag-green,theme(colors.emerald.600))]',
  rejected: 'bg-[var(--tag-red-bg)] text-[var(--tag-red)]',
};

export default function AccountDashboard() {
  const [reading, setReading] = useState<ReadingItem[]>([]);
  const [contributions, setContributions] = useState<Contributions | null>(null);

  useEffect(() => {
    fetch('/api/account/reading-progress').then((r) => r.json()).then(({ items }) => setReading(items ?? []));
    fetch('/api/account/contributions').then((r) => r.json()).then(setContributions);
  }, []);

  return (
    <div className="container py-10 space-y-12">
      <h1 className="text-3xl font-bold text-foreground">Your Dashboard</h1>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-4">Continue Reading</h2>
        {reading.length === 0 ? (
          <p className="text-foreground-muted">Pages you read will show up here.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reading.map((item) => (
              <Link key={`${item.wikiSlug}-${item.pageSlug}`} href={`/wiki/${item.wikiSlug}/${item.pageSlug}`} className="card overflow-hidden group">
                <div className="aspect-video bg-background-tertiary overflow-hidden relative">
                  {item.coverImage && (
                    <Image src={item.coverImage} alt={item.pageTitle} fill className="object-cover group-hover:scale-105 transition-transform" />
                  )}
                </div>
                <div className="p-3">
                  <p className="text-xs text-accent">{item.wikiName}</p>
                  <h3 className="font-semibold text-foreground text-sm">{item.pageTitle}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-4">My Contributions</h2>
        {!contributions || (contributions.wikis.length === 0 && contributions.pages.length === 0 && contributions.revisions.length === 0) ? (
          <p className="text-foreground-muted">Wikis and pages you create or edit will show up here with their review status.</p>
        ) : (
          <div className="space-y-2">
            {contributions.wikis.map((w) => (
              <div key={w._id} className="card p-3 flex items-center justify-between">
                <span className="text-foreground">{w.name} <span className="text-foreground-muted text-xs">(wiki)</span></span>
                <span className={`text-xs px-2 py-0.5 rounded ${STATUS_STYLES[w.status]}`}>{w.status}</span>
              </div>
            ))}
            {contributions.pages.map((p) => (
              <div key={p._id} className="card p-3 flex items-center justify-between">
                <span className="text-foreground">{p.title} <span className="text-foreground-muted text-xs">(page)</span></span>
                <span className={`text-xs px-2 py-0.5 rounded ${STATUS_STYLES[p.status]}`}>{p.status}</span>
              </div>
            ))}
            {contributions.revisions.map((r) => (
              <div key={r._id} className="card p-3 flex items-center justify-between">
                <span className="text-foreground">{r.title} <span className="text-foreground-muted text-xs">(edit)</span></span>
                <span className={`text-xs px-2 py-0.5 rounded ${STATUS_STYLES[r.status]}`}>{r.status}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
```

- [ ] **Step 5: Add the Account link to the Header**

In `src/components/layout/Header.tsx`, the "Sign In / Sign Up" block
(lines 73-81 desktop, 116-129 mobile) is unconditional. Fetch
`/api/auth/me` client-side (`Header` is already `'use client'`) and swap
to an "Account" link + "Log out" when logged in, mirroring the pattern
already used in `AdminTopBar.tsx` (Task 5):

```tsx
  const [me, setMe] = useState<{ name: string } | null>(null);
  useEffect(() => {
    fetch('/api/auth/me').then((r) => r.json()).then(({ user }) => setMe(user));
  }, []);
```

Replace the desktop "Sign In / Sign Up" block's contents with a
conditional: if `me`, render `<Link href="/account">Account</Link>` plus a
logout button (same `fetch('/api/auth/logout', {method:'POST'})` +
`router.refresh()` pattern as `AdminTopBar`); otherwise keep the existing
Sign In/Sign Up links unchanged. Apply the same conditional to the mobile
menu block.

- [ ] **Step 6: Type-check and verify in the browser**

```bash
npx tsc --noEmit
```

Logged in as the test reader: visit a couple of published wiki pages,
then visit `/account` — confirm they appear under "Continue Reading" with
cover images (or a placeholder aspect-ratio box if no cover image is
set), and that your earlier pending wiki/page/revision submissions from
Tasks 8/10/12 appear under "My Contributions" with the correct status
badges (including one that's since been approved/declined, if you ran
those verification steps in order). Confirm the Header now shows
"Account"/"Log out" instead of "Sign In"/"Sign Up" while logged in.

- [ ] **Step 7: Commit**

```bash
git add app/api/account "app/(site)/account" "app/(site)/wiki/[wikiSlug]/[pageSlug]/page.tsx" src/components/layout/Header.tsx
git commit -m "feat(account): add user dashboard with continue-reading and contributions tracking

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01YT5MVaXncBzHesYjjtXSom"
```

---

## Phase C — Public site wired to real data

### Task 15: Homepage becomes a Server Component — Category + Featured Wikis

**Files:**
- Modify: `app/(site)/page.tsx`
- Modify: `src/components/home/CategorySection.tsx`
- Modify: `src/components/home/FeaturedWikisSection.tsx`

**Interfaces:**
- Produces: `CategorySection` and `FeaturedWikisSection` accept data via
  props (`categories: CategoryData[]`, `wikis: WikiData[]`) instead of
  holding hardcoded arrays; both stay `'use client'` for their existing
  hover/carousel interactions, just receiving real data now.

- [ ] **Step 1: Read both component files in full**

Read `src/components/home/CategorySection.tsx` and
`src/components/home/FeaturedWikisSection.tsx` completely (only their
type interfaces were seen during planning, not their JSX/mock array
bodies) to find: the exact mock array to delete, and every place inside
the component that references it, before touching them.

- [ ] **Step 2: Convert `CategorySection` to accept props**

Change the component signature from reading its own hardcoded array to:

```tsx
export default function CategorySection({ categories }: { categories: Category[] }) {
```

Delete the hardcoded mock array; keep every other line (JSX, hover
classes, `.map()` logic) unchanged — it already maps over a `Category[]`-
shaped array, so the render body needs no changes once the prop replaces
the local constant. If any mock fields don't exist on the real `Category`
Mongo model (e.g. `image`, `color` per the interface seen in planning),
keep those exact field names and populate them in Task 15 Step 4's data
fetch using sensible fallbacks (e.g. `icon` from the model, a fixed
palette keyed by index for `color` if `Category` has no color field —
check the model; don't invent new DB fields for cosmetic-only data if a
computed fallback is simpler).

- [ ] **Step 3: Convert `FeaturedWikisSection` to accept props**

Same pattern: `export default function FeaturedWikisSection({ wikis }:
{ wikis: Wiki[] })`, delete the mock array, keep the render body as-is
(it already expects the `Wiki` shape seen in planning: `id, slug, title,
franchise, cover, category, pages, contributors, trending`). Map real
`Wiki`/`Category` documents onto that exact shape in Task 15 Step 4 —
`franchise` and `contributors` have no direct model equivalent; use
`category.name` for `franchise` and `0` (or omit if the component
tolerates `undefined`, per what Step 1's full read reveals) for
`contributors` since there's no per-wiki contributor count field yet
(documented gap, not a blocker).

- [ ] **Step 4: Convert `app/(site)/page.tsx` to a Server Component and fetch real data**

Remove any `'use client'` if present (it wasn't shown as having one in
`Read`'s earlier output — confirm), add the DB imports, and fetch before
returning JSX:

```tsx
import connectDB from '@/src/lib/db/connection';
import { Category, Wiki } from '@/src/lib/db/models';
import {
  HeroSection, CategorySection, FeaturedWikisSection, TrendingPagesSection,
  CommunitySection, RecentActivitySection, PublishCTASection, AdBanner, NewsletterSection,
} from '@/src/components/home';

async function getHomeData() {
  await connectDB();
  const [categories, wikis] = await Promise.all([
    Category.find({ isActive: true }).sort({ order: 1 }).lean(),
    Wiki.find({ status: 'approved' }).populate('category', 'name').sort({ isFeatured: -1, pageCount: -1 }).limit(8).lean(),
  ]);
  return { categories, wikis };
}

export default async function HomePage() {
  const { categories, wikis } = await getHomeData();
  return (
    <>
      <HeroSection />
      <div className="container py-6"><AdBanner zone="homepage-hero" /></div>
      <CategorySection categories={categories.map((c) => ({
        id: c._id.toString(), name: c.name, slug: c.slug, icon: c.icon ?? '📚',
        count: 0, description: c.description ?? '', image: c.coverImage ?? '', color: 'accent',
      }))} />
      <FeaturedWikisSection wikis={wikis.map((w) => ({
        id: w._id.toString(), slug: w.slug, title: w.name,
        franchise: (w.category as unknown as { name?: string })?.name ?? 'General',
        cover: w.coverImage ?? '', category: (w.category as unknown as { name?: string })?.name ?? 'General',
        pages: w.pageCount, contributors: 0, trending: w.isFeatured,
      }))} />
      <div className="container py-6"><AdBanner zone="homepage-feed" /></div>
      <TrendingPagesSection />
      <CommunitySection />
      {/* remaining sections unchanged for this task — Task 16 wires them */}
    </>
  );
}
```

(The `count: 0`/`contributors: 0` placeholders are flagged explicitly —
Step 1's full read of each component may reveal a natural real value to
compute instead, e.g. `count` as "wikis in this category" via an
aggregation; if so, compute it instead of hardcoding 0. Don't leave a
silently-wrong `0` if a one-line aggregation gives the real number.)

- [ ] **Step 5: Type-check and verify in the browser**

```bash
npx tsc --noEmit
```

Visit `/` with at least one `status: 'approved'` wiki and an active
category in the DB (from earlier tasks' verification data) — confirm
`CategorySection` and `FeaturedWikisSection` show real names/slugs
instead of the old mock franchise names, and that links navigate to the
correct real `/wiki/<slug>` URLs. Also confirm the homepage doesn't
crash when there are zero wikis (empty array renders whatever empty state
Step 1's full read shows the component already has, or add a minimal one
if it has none — a `.length === 0` guard with a one-line message, not a
new component).

- [ ] **Step 6: Commit**

```bash
git add "app/(site)/page.tsx" src/components/home/CategorySection.tsx src/components/home/FeaturedWikisSection.tsx
git commit -m "feat(home): wire category and featured-wikis sections to real data

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01YT5MVaXncBzHesYjjtXSom"
```

---

### Task 16: Trending Pages + Community/Recent Activity sections wired to real data

**Files:**
- Modify: `app/(site)/page.tsx`
- Modify: `src/components/home/TrendingPagesSection.tsx`
- Modify: `src/components/home/RecentActivitySection.tsx`
- Modify: `src/components/home/CommunitySection.tsx` (only if it's meant
  to show real content updates — read it fully first; if its "Update"
  shape has no real backing model like blog posts yet, per
  `PROGRESS.md` Blog Post isn't built, feed it real `Revision`-derived
  "wiki-update" items only, per its own `type: 'wiki-update' | ...` union
  seen in planning, and leave the other update types empty rather than
  fabricating content)

**Interfaces:**
- Produces: `TrendingPagesSection` and `RecentActivitySection` accept
  real data via props, same pattern as Task 15.

- [ ] **Step 1: Read all 3 component files in full**

Same reasoning as Task 15 Step 1 — the mock arrays and exact prop shapes
weren't fully read during planning.

- [ ] **Step 2: Convert each to accept props**, deleting their mock
  arrays, keeping render bodies intact (same approach as Task 15).

- [ ] **Step 3: Extend `getHomeData()` in `app/(site)/page.tsx`** (from
  Task 15) to also compute:

```ts
  const trendingPages = await Page.aggregate([
    { $match: { status: 'published' } },
    trendingScoreStage(),
    { $sort: { trendingScore: -1 } },
    { $limit: 6 },
    { $lookup: { from: 'wikis', localField: 'wiki', foreignField: '_id', as: 'wiki' } },
    { $unwind: '$wiki' },
  ]);
  const recentRevisions = await Revision.find({ contentType: 'page' })
    .populate('editedBy', 'name')
    .populate({ path: 'contentId', select: 'title slug wiki', model: 'Page', populate: { path: 'wiki', select: 'name slug' } })
    .sort({ createdAt: -1 })
    .limit(8)
    .lean();
```

(Import `trendingScoreStage` from `@/src/lib/db/trending` and `Revision`/
`Page` from the models barrel; `trendingScoreStage` is already exported
per `src/lib/db/trending.ts:17`.) Map these onto whatever exact prop
shapes Step 1 revealed and pass them into `<TrendingPagesSection
pages={...} />` and `<RecentActivitySection activity={...} />` /
`<CommunitySection updates={...} />` in the JSX.

- [ ] **Step 4: Type-check and verify in the browser**

```bash
npx tsc --noEmit
```

Confirm the homepage's Trending and Recent Activity/Community sections
show real pages/edits from the DB (created across earlier tasks'
verification), with correct links, and degrade gracefully to their
existing empty state with zero data.

- [ ] **Step 5: Commit**

```bash
git add "app/(site)/page.tsx" src/components/home/TrendingPagesSection.tsx src/components/home/RecentActivitySection.tsx src/components/home/CommunitySection.tsx
git commit -m "feat(home): wire trending pages and recent activity sections to real data

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01YT5MVaXncBzHesYjjtXSom"
```

---

## Phase D — Site Pages editor (Home copy / About / etc.)

### Task 17: Schema — optional `wiki`, `siteSlug`, `pageType: 'site'`

**Files:**
- Modify: `src/lib/db/models/Page.ts`
- Modify: `src/lib/blocks/templates.ts`

**Interfaces:**
- Produces: `Page.wiki` becomes optional (`required: function(){ return
  this.pageType !== 'site'; }`), new `Page.siteSlug?: string` (unique
  when present), `PageArchetype` gains `'site'`.

- [ ] **Step 1: Modify `src/lib/db/models/Page.ts`**

Change the `wiki` field's `required: true` to a conditional:

```ts
    wiki: {
      type: Schema.Types.ObjectId,
      ref: 'Wiki',
      required: function (this: IPage) {
        return this.pageType !== 'site';
      },
    },
```

Add `siteSlug?: string;` to `IPage` and to the schema:

```ts
    siteSlug: {
      type: String,
      lowercase: true,
      trim: true,
    },
```

Change the compound unique index (near the bottom of the file) from:

```ts
PageSchema.index({ wiki: 1, slug: 1 }, { unique: true });
```

to also declare a separate partial-unique index for site pages:

```ts
PageSchema.index({ wiki: 1, slug: 1 }, { unique: true, partialFilterExpression: { wiki: { $exists: true } } });
PageSchema.index({ siteSlug: 1 }, { unique: true, sparse: true });
```

- [ ] **Step 2: Modify `src/lib/blocks/templates.ts`**

Add `'site'` to the `PageArchetype` union (alongside `'cover'` added in
Task 6):

```ts
export type PageArchetype = 'overview' | 'character' | 'location' | 'episode' | 'cover' | 'site' | 'blank';
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Verify the index change doesn't break existing data**

```bash
mongosh wiki-platform --eval 'db.pages.getIndexes()'
```

Confirm both the new partial `wiki_1_slug_1` and the new sparse
`siteSlug_1` indexes exist (Mongoose auto-syncs indexes in dev by
default; if the old non-partial index lingers, drop it manually:
`db.pages.dropIndex('wiki_1_slug_1')` then restart the dev server so
Mongoose recreates it with the partial filter).

- [ ] **Step 5: Commit**

```bash
git add src/lib/db/models/Page.ts src/lib/blocks/templates.ts
git commit -m "feat(pages): make Page.wiki optional to support standalone site pages

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01YT5MVaXncBzHesYjjtXSom"
```

---

### Task 18: Admin site pages list/editor + API

**Files:**
- Create: `app/api/admin/site-pages/route.ts`
- Create: `app/api/admin/site-pages/[id]/route.ts`
- Create: `app/admin/pages/site/page.tsx`
- Create: `app/admin/pages/site/[id]/edit/page.tsx`
- Modify: `src/components/admin/shell/AdminSidebar.tsx`

**Interfaces:**
- Produces: `GET/POST /api/admin/site-pages`, `GET/PATCH
  /api/admin/site-pages/[id]` — same shape as the existing
  `/api/admin/pages` routes but keyed by `siteSlug` instead of
  `wiki`+`slug`, `pageType: 'site'` always, trusted-role only (no review
  workflow for site pages — always admin/editor authored).

- [ ] **Step 1: Write `app/api/admin/site-pages/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { Page } from '@/src/lib/db/models';
import { getSessionUser } from '@/src/lib/auth/getSessionUser';
import { isTrustedRole } from '@/src/lib/auth/roles';
import { slugify } from '@/src/lib/slugify';
import type { Block } from '@/src/lib/blocks/types';

const SEED_PAGES = [{ title: 'About', siteSlug: 'about' }];

export async function GET() {
  await connectDB();
  const session = await getSessionUser();
  if (!session || !isTrustedRole(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  // Idempotent seed, same pattern as GET /api/admin/categories.
  for (const seed of SEED_PAGES) {
    if (!(await Page.exists({ siteSlug: seed.siteSlug }))) {
      await Page.create({
        pageType: 'site', siteSlug: seed.siteSlug, title: seed.title,
        slug: seed.siteSlug, blocks: [], author: session.sub, lastEditedBy: session.sub, status: 'draft',
      });
    }
  }

  const pages = await Page.find({ pageType: 'site' }).select('title siteSlug status updatedAt').sort({ title: 1 });
  return NextResponse.json({ pages });
}

export async function POST(req: NextRequest) {
  await connectDB();
  const session = await getSessionUser();
  if (!session || !isTrustedRole(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const title: string = body.title?.trim();
  const blocks: Block[] = body.blocks ?? [];
  if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

  const baseSlug = slugify(title);
  let siteSlug = baseSlug;
  let suffix = 1;
  while (await Page.exists({ siteSlug })) {
    suffix += 1;
    siteSlug = `${baseSlug}-${suffix}`;
  }

  const page = await Page.create({
    pageType: 'site', siteSlug, slug: siteSlug, title, blocks,
    author: session.sub, lastEditedBy: session.sub, status: 'draft',
  });
  return NextResponse.json({ page }, { status: 201 });
}
```

- [ ] **Step 2: Write `app/api/admin/site-pages/[id]/route.ts`**

Mirror `app/api/admin/pages/[id]/route.ts`'s `GET`/`PATCH` structure
exactly (session check, snapshot-then-save), but without the Task 10
pending-revision branch (site pages are trusted-only, no review path)
and without the `wiki`-scoped slug uniqueness check:

```ts
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { Page } from '@/src/lib/db/models';
import { getSessionUser } from '@/src/lib/auth/getSessionUser';
import { isTrustedRole } from '@/src/lib/auth/roles';
import { snapshotPageRevision } from '@/src/lib/db/pageRevisions';
import type { Block } from '@/src/lib/blocks/types';
import type { PageStatus } from '@/src/lib/db/models/Page';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const page = await Page.findOne({ _id: id, pageType: 'site' });
  if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ page });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const session = await getSessionUser();
  if (!session || !isTrustedRole(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const title: string | undefined = body.title?.trim();
  const blocks: Block[] | undefined = body.blocks;
  const status: PageStatus | undefined = body.status;
  const editSummary: string | undefined = body.editSummary?.trim() || undefined;

  const existing = await Page.findOne({ _id: id, pageType: 'site' });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await snapshotPageRevision(existing, session.sub, editSummary);
  if (title) existing.title = title;
  if (blocks) existing.blocks = blocks;
  if (status && status !== existing.status) {
    existing.status = status;
    if (status === 'published' && !existing.publishedAt) existing.publishedAt = new Date();
  }
  existing.lastEditedBy = new mongoose.Types.ObjectId(session.sub);
  existing.editCount += 1;
  await existing.save();

  return NextResponse.json({ page: existing });
}
```

- [ ] **Step 3: Write `app/admin/pages/site/page.tsx`**

A simple list (title, status, "Edit" link), mirroring `/admin/pages`'s
existing card style:

```tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface SitePage { _id: string; title: string; siteSlug: string; status: string; updatedAt: string; }

export default function SitePagesList() {
  const [pages, setPages] = useState<SitePage[]>([]);
  useEffect(() => {
    fetch('/api/admin/site-pages').then((r) => r.json()).then(({ pages }) => setPages(pages ?? []));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Site Pages</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pages.map((p) => (
          <Link key={p._id} href={`/admin/pages/site/${p._id}/edit`} className="card p-4 hover:border-accent">
            <h3 className="font-semibold text-foreground">{p.title}</h3>
            <p className="text-xs text-foreground-muted mt-1">/{p.siteSlug} · {p.status}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Write `app/admin/pages/site/[id]/edit/page.tsx`**

Mirror `app/admin/wiki/[id]/edit/page.tsx`'s existing structure (read it
first for the exact pattern — load-by-id, `PageBuilder`/`TextEditor`
toggle by `user.preferences.editorMode`, save via `PATCH`), pointed at
`/api/admin/site-pages/[id]` instead of `/api/admin/pages/[id]`, with a
publish toggle calling the same endpoint with `{status: 'published'}`.

- [ ] **Step 5: Wire the sidebar**

In `AdminSidebar.tsx`, add a `{ label: 'Site Pages', href:
'/admin/pages/site', icon: FileText }` entry to the "Content" group
(reuse the `FileText` icon already imported for "Pages").

- [ ] **Step 6: Verify**

```bash
npx tsc --noEmit
```

As admin, visit `/admin/pages/site` — confirm the seeded "About" page
appears, click into it, add some blocks, save, publish. Confirm via
`mongosh`: `db.pages.findOne({ siteSlug: 'about' })` shows the saved
blocks and `status: 'published'`.

- [ ] **Step 7: Commit**

```bash
git add app/api/admin/site-pages app/admin/pages/site src/components/admin/shell/AdminSidebar.tsx
git commit -m "feat(admin): add site pages (About, etc.) editor reusing the wiki page block system

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01YT5MVaXncBzHesYjjtXSom"
```

---

### Task 19: Public site page route

**Files:**
- Create: `app/(site)/[siteSlug]/page.tsx`

**Interfaces:**
- Consumes: `BlockListRenderer`, real `Page` document by `siteSlug`.

- [ ] **Step 1: Write `app/(site)/[siteSlug]/page.tsx`**

Same server-rendered pattern as the wiki page route (Task 9):

```tsx
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import connectDB from '@/src/lib/db/connection';
import { Page } from '@/src/lib/db/models';
import { BlockListRenderer } from '@/src/components/blocks/BlockRenderer';
import type { Block } from '@/src/lib/blocks/types';

interface Props {
  params: Promise<{ siteSlug: string }>;
}

async function loadSitePage(siteSlug: string) {
  await connectDB();
  return Page.findOne({ siteSlug, pageType: 'site', status: 'published' }).lean();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { siteSlug } = await params;
  const page = await loadSitePage(siteSlug);
  if (!page) return {};
  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || page.excerpt,
    alternates: { canonical: `/${siteSlug}` },
  };
}

export default async function SitePage({ params }: Props) {
  const { siteSlug } = await params;
  const page = await loadSitePage(siteSlug);
  if (!page) notFound();

  return (
    <div className="container py-12 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-foreground mb-6">{page.title}</h1>
      <BlockListRenderer blocks={page.blocks as Block[]} />
    </div>
  );
}
```

- [ ] **Step 2: Confirm no route collisions**

Next.js resolves more specific static segments (`/login`, `/register`,
`/account`, `/wiki`) before the dynamic `/[siteSlug]` catch-all — verify
this holds by starting the dev server and requesting `/login` (should
still hit the login page, not 404 via the site-page route) and `/about`
(should hit the new site-page route once published in Task 18).

- [ ] **Step 3: Type-check and verify in the browser**

```bash
npx tsc --noEmit
```

Visit `/about` after Task 18's verification published it — confirm the
content renders. Visit an unpublished/nonexistent slug (e.g. `/nonexistent`)
— confirm a clean 404, not a crash.

- [ ] **Step 4: Commit**

```bash
git add "app/(site)/[siteSlug]"
git commit -m "feat(pages): add public route for site pages (About, etc.)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01YT5MVaXncBzHesYjjtXSom"
```

---

---

## Phase E — Admin portal visual design pass

Client feedback mid-session: the admin portal currently reads as
"vague and dirty" — functional but visually generic (plain `card p-4`
boxes everywhere with almost no differentiation, a bare two-element
topbar, flat sidebar rows). This phase is a **visual-only** pass —
no IA/structure changes beyond what Phases A-D already added
(Review Queue, Site Pages) — across the screens already in the
codebase: `AdminSidebar.tsx`, `AdminTopBar.tsx`, `app/admin/page.tsx`
(dashboard), `app/admin/wikis/page.tsx`, `app/admin/pages/page.tsx`,
plus whatever new screens Phases B/D added (Review Queue, Site Pages
list). Explicitly out of scope: the wiki page builder canvas itself
(`PageBuilder`/`TextEditor`) — that's already had multiple dedicated
design passes per `PROGRESS.md` and the client's complaint is about
the surrounding admin shell, not the editor.

### Task 20: Redesign the admin shell and list/dashboard screens

**Files:**
- Modify: `app/globals.css` (only if the design calls for new/adjusted
  theme tokens — e.g. a refined shadow/elevation scale, an accent-tint
  system for stat cards — added under the existing `@layer
  base`/`@layer components` structure per the 2026-08-31 layer-bug fix
  logged in `PROGRESS.md`; never add unlayered rules)
- Modify: `src/components/admin/shell/AdminSidebar.tsx`
- Modify: `src/components/admin/shell/AdminTopBar.tsx`
- Modify: `app/admin/page.tsx`
- Modify: `app/admin/wikis/page.tsx`
- Modify: `app/admin/pages/page.tsx`
- Modify: `app/admin/review/page.tsx` (from Task 12)
- Modify: `app/admin/pages/site/page.tsx` (from Task 18)

**Interfaces:**
- No prop/data-shape changes — every file in scope already receives
  the data it needs (this is a pure visual/markup/class pass, not a
  data-wiring change). Do not touch the `fetch`/query logic in any of
  these files.

- [ ] **Step 1: Invoke the `frontend-design` skill before writing any
  CSS or component changes** — this is exactly the kind of "make an
  existing UI distinctive and intentional" task it's meant for. Use it
  to decide the specific visual direction (spacing rhythm, typography
  scale, color/accent usage, elevation/shadow system, empty-state
  treatment) rather than guessing.

- [ ] **Step 2: Take stock of what's actually weak, concretely, before
  changing anything**

Start the dev server, log in as admin, and look at each in-scope
screen. From reading the code during planning, the concrete weaknesses
already visible are: every panel uses the identical flat `card p-4`
treatment with no visual hierarchy between a stat card, a list row, and
a page-level container; `AdminTopBar` is two elements in a bare flex
row with no visual weight; `AdminSidebar`'s active-state indicator is a
single 2px accent bar and nothing else differentiates sections; list
views (`/admin/wikis`, `/admin/pages`) are card grids with a thumbnail
and two lines of text and nothing else — no density, no secondary
metadata, no visual interest. Confirm these against the live app and
note anything else that reads as "dirty" (inconsistent spacing values,
misaligned icon sizes, etc.) before starting Step 3.

- [ ] **Step 3: Apply the design** — implement the direction decided in
  Step 1 across all the files listed above consistently (a shared
  visual language, not a one-off treatment per screen). Preserve every
  existing route, data fetch, and interactive behavior (drag-and-drop,
  collapsible sidebar, review approve/decline, etc.) — only markup,
  classNames, and (if needed) new `app/globals.css` tokens change.

- [ ] **Step 4: Type-check and verify visually**

```bash
npx tsc --noEmit
```

Manually click through `/admin`, `/admin/wikis`, `/admin/pages`,
`/admin/review`, `/admin/pages/site`, and the sidebar/topbar on every
one of them, in both light and dark theme (the theme toggle already
exists via `ThemeContext` — confirm the admin shell actually exposes a
way to toggle it, or test by changing the OS/browser preference, since
`app/admin/layout.tsx` currently hardcodes `data-theme="dark"` at
line 33 — flag this as a real bug the client will hit if they expect
the admin portal to follow the same light/dark switching the public
site has, and fix it as part of this task rather than leaving admin
permanently dark).

- [ ] **Step 5: Commit**

```bash
git add app/globals.css src/components/admin/shell app/admin
git commit -m "style(admin): redesign the admin shell, dashboard, and list views

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01YT5MVaXncBzHesYjjtXSom"
```

---

## Final verification (after all 20 tasks)

- [ ] Run `npx tsc --noEmit` once more from a clean state — expect zero errors.
- [ ] Run `npm run build` — expect a clean production build (this exercises every route including the dynamic ones that `tsc --noEmit` alone won't fully validate).
- [ ] Full manual walkthrough as three different accounts (reader, contributor-promoted-to-`contributor`-role if you want to distinguish it from reader, and admin): register → browse homepage with real data → create a wiki as reader (draft) → submit for review → admin approves via `/admin/review` after previewing → wiki now live at `/wiki/<slug>` → reader edits a live page → pending revision → admin approves → live page updates → reader's `/account` dashboard shows the approved contribution and their reading history → admin publishes an About page via `/admin/pages/site` → live at `/about`.
- [ ] Update `PROGRESS.md`: mark this work's tasks done, note the new "Auth" row in Technical Decisions is now "Confirmed" not "In progress", and remove the completed items from the Backlog section only if any were actually folded in (none should be, per the scope-lock decision).
