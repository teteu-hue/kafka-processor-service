import crypto from 'crypto';
import 'dotenv/config';

const algorithm = process.env.ALGORITHM || '';
const secretKeyHex = process.env.SECRET_KEY || '';

const secretKey = Buffer.from(secretKeyHex, 'hex');

if (!algorithm || !secretKey) {
    throw new Error('ALGORITHM and SECRET_KEY must be set');
}

function encrypt(text: string) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(hash: string) {
  const [ivHex, contentHex] = hash.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encryptedText = Buffer.from(contentHex, 'hex');

  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
  return decrypted.toString('utf8');
}

export { encrypt, decrypt };
