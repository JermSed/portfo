import { timingSafeEqual } from 'node:crypto';
import { cookies, headers } from 'next/headers';

export function studioEnabled() {
  return process.env.NODE_ENV === 'development' && process.env.STUDIO_ENABLED === '1' && (process.env.STUDIO_TOKEN?.length || 0) >= 32;
}
export function validToken(token: string) {
  const expected = process.env.STUDIO_TOKEN || '';
  return studioEnabled() && Buffer.byteLength(token) === Buffer.byteLength(expected) && timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}
export async function studioAuthorized() {
  const h = await headers();
  const host = h.get('host') || '';
  return studioEnabled() && /^127\.0\.0\.1:\d+$/.test(host) && validToken((await cookies()).get('portfolio-studio')?.value || '');
}
export async function sameOrigin(request: Request) {
  const host = (await headers()).get('host');
  return request.headers.get('origin') === `http://${host}`;
}
