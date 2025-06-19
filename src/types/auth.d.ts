export type AuthFieldErrors = {
  email?: string;
  password?: string;
  fullname?: string;
  confirmPassword?: string;
  oldPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  [key: string]: string | undefined;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterFormData = {
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  dob?: string;
  phone?: string;
  address?: string;
  avatar?: string;
};
