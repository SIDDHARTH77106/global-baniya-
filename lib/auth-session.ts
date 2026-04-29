import { createHmac, timingSafeEqual } from 'crypto';

export type AppRole = 'CUSTOMER' | 'RETAILER' | 'WHOLESALER' | 'ADMIN';

export const SESSION_COOKIE_NAME = 'global-baniya-session';

const ROLE_VALUES: AppRole[] = ['CUSTOMER', 'RETAILER', 'WHOLESALER', 'ADMIN'];

function getSessionSecret() {
  return process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'global-baniya-dev-secret-change-me';
}

function base64UrlEncode(value: string) {
  return Buffer.from(value, 'utf8').toString('base64url');
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function sign(payload: string) {
  return createHmac('sha256', getSessionSecret()).update(payload).digest('base64url');
}

export function normalizeRole(role: unknown): AppRole {
  const normalized = String(role || 'CUSTOMER').toUpperCase() as AppRole;
  return ROLE_VALUES.includes(normalized) ? normalized : 'CUSTOMER';
}

export function createRoleSession(user: { id: string; role: unknown }) {
  const payload = base64UrlEncode(
    JSON.stringify({
      userId: user.id,
      role: normalizeRole(user.role),
      issuedAt: Date.now(),
    })
  );
  return `${payload}.${sign(payload)}`;
}

export function readRoleSession(token?: string | null) {
  if (!token) return null;

  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;

  const expected = sign(payload);
  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const session = JSON.parse(base64UrlDecode(payload)) as { userId?: string; role?: AppRole };
    if (!session.userId || !session.role) return null;
    return { userId: session.userId, role: normalizeRole(session.role) };
  } catch {
    return null;
  }
}
