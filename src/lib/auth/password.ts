import bcrypt from 'bcryptjs';

/**
 * Hash a password
 * @param password The plain text password to hash
 * @returns The hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compare a plain text password with a hashed password
 * @param password The plain text password
 * @param hashedPassword The hashed password
 * @returns True if the passwords match, false otherwise
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * Generate a random token for password reset
 * @returns A random token
 */
export const generateResetToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Rastgele güvenli şifre oluşturur
 * @param length Şifre uzunluğu (varsayılan: 12)
 * @returns Oluşturulan rastgele şifre
 */
export function generateRandomPassword(length = 12): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return password;
}

/**
 * Şifre gücünü kontrol eder
 * @param password Kontrol edilecek şifre
 * @returns Şifre gücü değerlendirmesi (weak, medium, strong)
 */
export function checkPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  if (!password || password.length < 8) {
    return 'weak';
  }
  
  let strength = 0;
  
  // Harf kontrolü
  if (/[a-z]/.test(password)) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  
  // Sayı kontrolü
  if (/[0-9]/.test(password)) strength += 1;
  
  // Özel karakter kontrolü
  if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
  
  // Uzunluk kontrolü
  if (password.length >= 12) strength += 1;
  
  if (strength < 3) return 'weak';
  if (strength < 5) return 'medium';
  return 'strong';
}