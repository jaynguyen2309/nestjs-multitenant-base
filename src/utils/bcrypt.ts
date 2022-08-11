import * as bcrypt from 'bcrypt';

/**
 * Encodes a password using bcrypt.
 *
 * @param plainPassword plain password to be hashed
 * @returns hashed password
 */
export async function encodePassword(plainPassword: string): Promise<string> {
  const salt = bcrypt.genSaltSync();
  const password = await bcrypt.hashSync(plainPassword, salt);
  return password;
}

/**
 * Compares a plain password with a hashed password.
 *
 * @param plainPassword plain password to be compared
 * @param hash hashed password to be compared
 * @returns true/false
 */
export function comparePassword(plainPassword: string, hash: string) {
  return bcrypt.compareSync(plainPassword, hash);
}
