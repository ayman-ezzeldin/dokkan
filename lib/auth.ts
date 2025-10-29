import crypto from 'crypto';

const AUTH_SECRET = process.env.AUTH_SECRET;

if (!AUTH_SECRET) {
  throw new Error('Please define AUTH_SECRET in .env.local');
}

export function randomSalt(bytes = 16): string {
  return crypto.randomBytes(bytes).toString('hex');
}

export function scryptHash(password: string, salt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(derivedKey.toString('hex'));
    });
  });
}

export function sign(data: string): string {
  return crypto.createHmac('sha256', AUTH_SECRET as string).update(data).digest('hex');
}

export function createSessionToken(userId: string): string {
  const payload = JSON.stringify({ userId, iat: Date.now() });
  const signature = sign(payload);
  const token = Buffer.from(payload).toString('base64url') + '.' + signature;
  return token;
}

export function verifySessionToken(token: string): { userId: string } | null {
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payloadB64, signature] = parts;
  try {
    const payload = Buffer.from(payloadB64, 'base64url').toString('utf8');
    const expected = sign(payload);
    if (!crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expected, 'hex'))) {
      return null;
    }
    const obj = JSON.parse(payload);
    if (!obj?.userId) return null;
    return { userId: obj.userId };
  } catch {
    return null;
  }
}

