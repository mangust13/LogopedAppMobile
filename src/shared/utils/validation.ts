export type ValidationErrors<T> = Partial<Record<keyof T, string>>;

export function validateEmail(email: string): string | null {
  if (!email.trim()) return "Email є обовʼязковим";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) return "Невірний формат email";
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return "Пароль є обовʼязковим";
  if (password.length < 6) return "Пароль має містити щонайменше 6 символів";
  return null;
}

export type LoginFields = { email: string; password: string };
export type RegisterFields = { email: string; password: string };

export function validateLoginForm(
  fields: LoginFields,
): ValidationErrors<LoginFields> {
  const errors: ValidationErrors<LoginFields> = {};
  const emailError = validateEmail(fields.email);
  const passwordError = validatePassword(fields.password);
  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;
  return errors;
}

export function validateRegisterForm(
  fields: RegisterFields,
): ValidationErrors<RegisterFields> {
  const errors: ValidationErrors<RegisterFields> = {};
  const emailError = validateEmail(fields.email);
  const passwordError = validatePassword(fields.password);
  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;
  return errors;
}

export function hasErrors<T>(errors: ValidationErrors<T>): boolean {
  return Object.keys(errors).length > 0;
}
