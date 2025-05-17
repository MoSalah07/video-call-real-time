interface Errors {
  fullName: string;
  email: string;
  password: string;
}

export const validateFullName = (fullName: string): string => {
  const trimmed = fullName.trim();
  if (!trimmed) return "Full name cannot be empty";
  if (trimmed.length < 4) return "Full name must be at least 4 characters";
  if (trimmed.length > 20) return "Full name must be less than 20 characters";
  return "";
};

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

export const vaildationRegister = ({
  email,
  fullName,
  password,
}: Errors): Errors => {
  const errors: Errors = {
    email: validateEmail(email),
    fullName: validateFullName(fullName),
    password: vaildatePassword(password),
  };

  return errors;
};
