const vaildatePassword = (password: string): string => {
  const trimmed = password.trim();
  if (!trimmed) return "Password cannot be empty";
  if (trimmed.length < 6) return "Password must be at least 6 characters";
  if (trimmed.length > 20) return "Password must be less than 20 characters";
  return "";
};

const validateEmail = (email: string): string => {
  const trimmed = email.trim();
  if (!trimmed) return "Email cannot be empty";
  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|hotmail\.com)$/i;
  if (!emailRegex.test(trimmed)) {
    return "Email must be from gmail.com, yahoo.com, or hotmail.com";
  }
  return "";
};
interface LoginInput {
  email: string;
  password: string;
}

export const vaildationLogin = ({
  email,
  password,
}: LoginInput): LoginInput => {
  const errors: LoginInput = {
    email: validateEmail(email),

    password: vaildatePassword(password),
  };

  return errors;
};
